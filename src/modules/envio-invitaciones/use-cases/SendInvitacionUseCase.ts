import { IUsuarioRepository } from '../../../domain/interfaces/IUsuarioRepository';
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { IInvitacionUsuarioRepository } from '../../../domain/interfaces/IInvitacionUsuarioRepository';
import { IEstadoInvitacionRepository } from '../../../domain/interfaces/IEstadoInvitacionRepository';
import { SendInvitacionDto, SendInvitacionResultDto } from '../dtos/SendInvitacionDto';
import { EstadoInvitacionEnum } from '../../../domain/value-objects/EstadoInvitacion';
import { 
  LIMITE_INVITACIONES_PENDIENTES_ASISTENTES,
  LIMITE_INVITACIONES_PENDIENTES_COORGANIZADORES
} from '../../../domain/value-objects/Constantes';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';
import { NotificacionFabrica } from '../../../infrastructure/patterns/factoryMethod/NotificacionFabrica';

export class SendInvitacionUseCase {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private eventoRepository: IEventoRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository,
    private invitacionUsuarioRepository: IInvitacionUsuarioRepository,
    private estadoInvitacionRepository: IEstadoInvitacionRepository
  ) {}

  async execute(dto: SendInvitacionDto): Promise<SendInvitacionResultDto> {
    // Validar datos requeridos
    if (!dto.evento_id || !Array.isArray(dto.usuarios) || dto.usuarios.length === 0) {
      throw new Error('evento_id y usuarios son requeridos');
    }

    // Verificar que el evento existe
    const evento = await this.eventoRepository.findById(dto.evento_id);
    if (!evento) {
      throw new Error('Event not found');
    }

    // Obtener estado "Pendiente"
    const estadoPendiente = await this.estadoInvitacionRepository.findByNombre(EstadoInvitacionEnum.PENDIENTE);
    if (!estadoPendiente) {
      throw new Error("Estado 'Pendiente' not found in database");
    }

    // Contar cuántos de cada tipo se quieren invitar
    const cantidadAsistentes = dto.usuarios.filter(u => !u.esParaCoorganizar).length;
    const cantidadCoorganizadores = dto.usuarios.filter(u => u.esParaCoorganizar).length;

    // Contar pendientes actuales por tipo
    const pendientesAsistentes = await this.invitacionUsuarioRepository.countPendientesByEventoYTipo(
      dto.evento_id,
      estadoPendiente.estado_id,
      false
    );

    const pendientesCoorganizadores = await this.invitacionUsuarioRepository.countPendientesByEventoYTipo(
      dto.evento_id,
      estadoPendiente.estado_id,
      true
    );

    // Validar cupos disponibles para Asistentes
    const cupoDisponibleAsistentes = LIMITE_INVITACIONES_PENDIENTES_ASISTENTES - pendientesAsistentes;
    if (cantidadAsistentes > cupoDisponibleAsistentes) {
      throw new Error(`No se pueden enviar ${cantidadAsistentes} invitaciones para asistentes. Solo quedan ${cupoDisponibleAsistentes} disponibles.`);
    }

    // Validar cupos disponibles para Coorganizadores
    const cupoDisponibleCoorganizadores = LIMITE_INVITACIONES_PENDIENTES_COORGANIZADORES - pendientesCoorganizadores;
    if (cantidadCoorganizadores > cupoDisponibleCoorganizadores) {
      throw new Error(`No se pueden enviar ${cantidadCoorganizadores} invitaciones para coorganizadores. Solo quedan ${cupoDisponibleCoorganizadores} disponibles.`);
    }

    // Filtrar usuarios que NO tienen invitación para este evento
    const usuariosNoInvitados: { usuario_id: number; esParaCoorganizar: boolean }[] = [];
    const resultados: any[] = [];

    for (const usuarioInvitacion of dto.usuarios) {
      const usuario_id = usuarioInvitacion.usuario_id;
      const usuario = await this.usuarioRepository.findById(usuario_id);
      if (!usuario) {
        resultados.push({ usuario_id, status: 'User not found' });
        continue;
      }

      // Validar si ya está en el evento sin importar el rol
      const yaEnEvento = await this.eventoParticipanteRepository.findByEventoAndUsuario(dto.evento_id, usuario_id);

      if (yaEnEvento) {
        resultados.push({ usuario_id, status: 'Already in event' });
        continue;
      }

      // Validar si ya tiene una invitación pendiente para este evento sin importar el rol
      const invitacionExistente = await this.invitacionUsuarioRepository.findPendienteByEventoAndUsuario(
        dto.evento_id,
        estadoPendiente.estado_id,
        usuario_id
      );

      if (invitacionExistente) {
        resultados.push({ usuario_id, status: 'Already invited' }); 
        continue;
      }

      usuariosNoInvitados.push({
        usuario_id,
        esParaCoorganizar: usuarioInvitacion.esParaCoorganizar
      });
    }

    // Si no hay usuarios nuevos, no crear Notificacion ni Invitacion
    if (usuariosNoInvitados.length === 0) {
      return {
        success: true,
        resultados
      };
    }

    // Usar Factory Method para crear Notificacion + Invitacion
    const nuevaInvitacion = await NotificacionFabrica.crearNotificacion(
      new Date(),
      dto.evento_id,
      TipoNotificacion.INVITACION
    );

    // Crear InvitacionUsuario solo para los usuarios no invitados
    for (const usuarioInvitacion of usuariosNoInvitados) {
      const nuevaInvitacionUsuario = await this.invitacionUsuarioRepository.create({
        estado_invitacion_id: estadoPendiente.estado_id,
        invitacion_id: nuevaInvitacion.notificacion_id,
        usuario_id: usuarioInvitacion.usuario_id,
        esParaCoorganizar: usuarioInvitacion.esParaCoorganizar
      });

      resultados.push({
        usuario_id: usuarioInvitacion.usuario_id,
        status: 'Invitation sent',
        invitacion_usuario_id: nuevaInvitacionUsuario.invitacion_usuario_id,
        esParaCoorganizar: usuarioInvitacion.esParaCoorganizar
      });
    }

    return {
      success: true,
      notificacion_id: nuevaInvitacion.notificacion_id,
      resultados
    };
  }
}
