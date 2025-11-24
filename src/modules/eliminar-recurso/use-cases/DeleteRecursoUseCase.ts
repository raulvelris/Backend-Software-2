import { IRecursoRepository } from '../../../domain/interfaces/IRecursoRepository'
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository'
import { NotificationManager } from '../../../infrastructure/patterns/observer/NotificationManager'
import { DeleteRecursoDto, DeleteRecursoResponseDto } from '../dtos/DeleteRecursoDto'

export class DeleteRecursoUseCase {
  constructor(
    private recursoRepository: IRecursoRepository,
    private eventoRepository: IEventoRepository,
    private notificationManager: NotificationManager
  ) {}

  async execute({ evento_id, recurso_id, usuario_id }: DeleteRecursoDto): Promise<DeleteRecursoResponseDto> {
    if (!evento_id || !recurso_id || !usuario_id) {
      throw new Error('evento_id y recurso_id son requeridos')
    }

    const evento = await this.eventoRepository.findById(evento_id)
    if (!evento) {
      throw new Error('Evento no encontrado')
    }

    const recurso = await this.recursoRepository.findById(recurso_id)
    if (!recurso) {
      throw new Error('Recurso no encontrado')
    }

    if (Number(recurso.evento_id) !== Number(evento_id)) {
      throw new Error('El recurso no pertenece al evento indicado')
    }
    const deleted = await this.recursoRepository.delete(recurso_id)
    if (!deleted) {
      throw new Error('No se pudo eliminar el recurso')
    }

    await this.notificationManager.notify('RECURSO_ELIMINADO', {
      eventoId: evento_id,
      emisorId: usuario_id
    })

    return {
      success: true,
      message: 'Recurso eliminado correctamente'
    }
  }
}
