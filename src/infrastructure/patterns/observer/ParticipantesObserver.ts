import { Observer } from './Observer';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { INotificacionUsuarioRepository } from '../../../domain/interfaces/INotificacionUsuarioRepository';
import { IRolRepository } from '../../../domain/interfaces/IRolRepository';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';
import { NotificacionFabrica } from '../factoryMethod/NotificacionFabrica';
import { TipoRol } from '../../../domain/value-objects/TipoRol';
import { Payload } from './Payload';

export class ParticipantesObserver implements Observer {
  constructor(
    private eventoParticipanteRepository: IEventoParticipanteRepository,
    private notificacionUsuarioRepository: INotificacionUsuarioRepository,
    private rolRepository: IRolRepository
  ) {}

    async update(eventType: string, payload: Payload): Promise<void> {
        const { eventoId, emisorId } = payload;

        // Estrategias centralizadas: tipo → mensaje + público
        const estrategias: Record<
        string,
        {
            mensaje: string;
            soloParaOrganizadores: boolean
        }
        > = {
        EVENTO_EDITADO: {
            mensaje: 'El evento fue editado.',
            soloParaOrganizadores: false,
        },
        RECURSO_AGREGADO: {
            mensaje: 'Se agregó un nuevo recurso al evento.',
            soloParaOrganizadores: false,
        },
        DESVINCULACION: {
            mensaje: 'Se ha desvinculado un asistente del evento.',
            soloParaOrganizadores: true,
        },
        EVENTO_CANCELADO: {
            mensaje: 'El evento ha sido cancelado.',
            soloParaOrganizadores: false,
        },
        RECURSO_ELIMINADO: {
            mensaje: 'Un recurso ha sido eliminado del evento.',
            soloParaOrganizadores: false,
        }
        };

        const estrategia = estrategias[eventType];
        if (!estrategia) return; 

        const { mensaje, soloParaOrganizadores } = estrategia;

        // Llamar al método fábrica para Notificacion + NotificacionAccion
        const nuevaNotificacion = await NotificacionFabrica.crearNotificacion(
            new Date(),
            eventoId,
            TipoNotificacion.ACCION,
            mensaje
        );
    
        // Buscar roles base
        const org = await this.rolRepository.findByNombre(TipoRol.ORGANIZADOR);
        const coorg = await this.rolRepository.findByNombre(TipoRol.COORGANIZADOR);

        let rolesIds = [org.rol_id, coorg.rol_id];

        // Agregar asistentes si corresponde
        if (!soloParaOrganizadores) {
            const asist = await this.rolRepository.findByNombre(TipoRol.ASISTENTE);
            rolesIds.push(asist.rol_id);
        }

        // Buscar destinatarios filtrando por roles y excluyendo al emisor
        const destinatarios = await this.eventoParticipanteRepository.findAllWithFilters(
            eventoId,
            rolesIds,
            emisorId
        );

        // Crear notificaciones para los destinatarios
        for (const destinatario of destinatarios) {
            await this.notificacionUsuarioRepository.create({
                notificacion_accion_id: nuevaNotificacion.notificacion_id,
                usuario_id: destinatario.participante.usuario.usuario_id,
            });
        }

        console.log(
            `Notificados ${destinatarios.length} usuarios (${soloParaOrganizadores ? 'ORGANIZADORES' : 'TODOS LOS PARTICIPANTES'}) de evento_id ${eventoId} sobre ${eventType}`
        );
    }
}