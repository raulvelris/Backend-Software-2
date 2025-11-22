import fs from 'fs'
import path from 'path'
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

    await this.removePhysicalFileIfNeeded(recurso.url)

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

  private async removePhysicalFileIfNeeded(url?: string | null): Promise<void> {
    if (!url || !url.startsWith('/assets/uploads/')) {
      return
    }

    const filename = url.replace('/assets/uploads/', '')
    if (!filename) {
      return
    }

    const filePath = path.join(__dirname, '../../../assets/uploads', filename)

    try {
      await fs.promises.stat(filePath)
      await fs.promises.unlink(filePath)
    } catch (error: any) {
      if (error?.code !== 'ENOENT') {
        console.error('Error eliminando archivo de recurso:', error)
      }
    }
  }

}
