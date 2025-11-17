import { IInvitacionUsuarioRepository } from '../../../domain/interfaces/IInvitacionUsuarioRepository';
import { IEstadoInvitacionRepository } from '../../../domain/interfaces/IEstadoInvitacionRepository';
import { IParticipanteRepository } from '../../../domain/interfaces/IParticipanteRepository';
import { IRolRepository } from '../../../domain/interfaces/IRolRepository';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { RespondInvitacionDto } from '../dtos/RespondInvitacionDto';
import { RespondInvitacionResultDto } from '../dtos/RespondInvitacionResultDto';
import { EstadoInvitacionEnum } from '../../../domain/value-objects/EstadoInvitacion';
import { MAXIMO_EVENTOS_POR_USUARIO } from '../../../domain/value-objects/Constantes';

export class RespondInvitacionUseCase {
  constructor(
    private invitacionUsuarioRepository: IInvitacionUsuarioRepository,
    private estadoInvitacionRepository: IEstadoInvitacionRepository,
    private participanteRepository: IParticipanteRepository,
    private rolRepository: IRolRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository
  ) {}

  async execute(dto: RespondInvitacionDto): Promise<RespondInvitacionResultDto> {
    // Validar datos requeridos
    if (!dto.invitacion_usuario_id || typeof dto.accept !== 'boolean') {
      throw new Error('invitacion_usuario_id y accept son requeridos');
    }

    // Cargar invitación con todas las relaciones
    const invitacionUsuario = await this.invitacionUsuarioRepository.findByIdWithEventoAndUsuario(dto.invitacion_usuario_id);

    if (!invitacionUsuario) {
      throw new Error('Invitación de usuario no encontrada');
    }

    // Validar estado actual
    const estadoActual = invitacionUsuario.estado?.nombre || '';
    if (estadoActual && estadoActual !== EstadoInvitacionEnum.PENDIENTE) {
      throw new Error('Ya respondió esta invitación');
    }

    const invitacion = invitacionUsuario.invitacion;
    const notificacion = invitacion?.notificacion;
    const evento = notificacion?.evento;
    const usuario = invitacionUsuario.usuario;
    const esParaCoorganizar = Boolean(invitacionUsuario.esParaCoorganizar);
    const now = new Date();

    // Validar fecha límite
    if (invitacion && invitacion.fechaLimite && new Date(invitacion.fechaLimite) < now) {
      throw new Error('Invitación expirada');
    }

    // Validar que el evento no haya comenzado (fechaInicio)
    if (evento && evento.fechaInicio && new Date(evento.fechaInicio) <= now) {
      throw new Error('El evento ya comenzó');
    }

    // Validar capacidad del evento
    if (dto.accept && evento) {
        const current = await this.participanteRepository.countAttendees(evento.evento_id);
        const capacity = typeof evento.aforo === 'number' ? evento.aforo : 0;

        if (current === capacity) {
          throw new Error('El evento está lleno');
        }
    }

    if (!dto.accept) {
      // Rechazar invitación
      const estadoRechazada = await this.estadoInvitacionRepository.findByNombre(EstadoInvitacionEnum.RECHAZADA);
      
      if (estadoRechazada) {
        await this.invitacionUsuarioRepository.update(dto.invitacion_usuario_id, {
          estado_invitacion_id: estadoRechazada.estado_id,
        });
      }
      
      return { success: true, message: 'Invitación rechazada' };
    } else {
      const existingCount = await this.eventoParticipanteRepository.countByUsuarioEventoActivo(usuario.usuario_id);

      if (existingCount === MAXIMO_EVENTOS_POR_USUARIO) {
        throw new Error('Alcanzó el límite de eventos permitidos');
      }
    }

    let rolId: number;

    if (!esParaCoorganizar) {
      // Aceptar invitación (según seeders: nombre 'Asistente')
      const rolAsistente = await this.rolRepository.findByNombre('Asistente');
      if (!rolAsistente) {
        // Evitar asignar por defecto un rol incorrecto (p.ej. ORGANIZADOR)
        throw new Error('Rol Asistente no configurado');
      }
      rolId = rolAsistente.rol_id;
    } else { 
      // Aceptar invitación (según seeders: nombre 'Coorganizador')
      const rolCoorganizador = await this.rolRepository.findByNombre('Coorganizador');
      if (!rolCoorganizador) {
        // Evitar asignar por defecto un rol incorrecto (p.ej. ORGANIZADOR)
        throw new Error('Rol Coorganizador no configurado');
      }
      rolId = rolCoorganizador.rol_id;
    }
    // Buscar o crear participante
    let participante = await this.participanteRepository.findByUsuarioAndRol(usuario.usuario_id, rolId);
    
    if (!participante) {
      participante = await this.participanteRepository.create({
        usuario_id: usuario.usuario_id,
        rol_id: rolId
      });
    }

    // Verificar si ya está en el evento
    const existingLink = await this.eventoParticipanteRepository.findByEventoAndParticipante(
      evento.evento_id,
      participante.participante_id
    );

    if (!existingLink) {
      // Crear relación evento-participante
      await this.eventoParticipanteRepository.create(
        evento.evento_id,
        participante.participante_id
      );
    }

    // Actualizar estado de invitación a Aceptada
    const estadoAceptada = await this.estadoInvitacionRepository.findByNombre(EstadoInvitacionEnum.ACEPTADA);
    
    if (estadoAceptada) {
      await this.invitacionUsuarioRepository.update(dto.invitacion_usuario_id, {
        estado_invitacion_id: estadoAceptada.estado_id,
      });
    }

    const tipoInvitacion = esParaCoorganizar ? true : false;
    const tipoInvitacionLabel = esParaCoorganizar ? 'coorganizador' : 'asistente';

    return {
      success: true,
      message: `Invitación aceptada como ${tipoInvitacionLabel}`,
      tipoInvitacion,
    };
  }
}
