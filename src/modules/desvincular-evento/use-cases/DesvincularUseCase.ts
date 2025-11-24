import { DesvincularDto } from '../dtos/DesvincularDto';
import { DesvincularResultDto } from '../dtos/DesvincularResultDto';
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { NotificationManager } from '../../../infrastructure/patterns/observer/NotificationManager';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';

export class DesvincularUseCase {
  constructor(
    private eventoRepository: IEventoRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository,
    private notificationManager: NotificationManager
  ) {}

  async execute(dto: DesvincularDto): Promise<DesvincularResultDto> {
    try {
      // Validar evento
      const evento = await this.eventoRepository.findById(dto.evento_id);
      if (!evento) throw new Error('Evento no encontrado');

      // Buscar relación participante ↔ evento (usa usuario_id para localizar participante)
      const link = await this.eventoParticipanteRepository.findByEventoAndUsuario(dto.evento_id, dto.usuario_id);
      if (!link) {
        return { success: false, message: 'Participante no encontrado en el evento' };
      }

      const participanteId = link.participante.participante_id;

      // Eliminar la relación (desvinculación)
      await this.eventoParticipanteRepository.deleteByEventoAndParticipante(dto.evento_id, participanteId);

      // Notificar a organizadores/coorganizadores (según estrategia en ParticipantesObserver)
      await this.notificationManager.notify(
        TipoNotificacion.DESVINCULACION,
        { eventoId: dto.evento_id, emisorId: dto.usuario_id }
      );

      return {
        success: true,
        message: 'Se ha desvinculado del evento correctamente',
        evento_id: dto.evento_id
      };

    } catch (error: any) {
      console.error('Error en DesvincularUseCase:', error);
      throw error;
    }
  }
}