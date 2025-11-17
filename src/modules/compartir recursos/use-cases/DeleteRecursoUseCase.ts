import fs from 'fs'
import path from 'path'
import { IRecursoRepository } from '../../../domain/interfaces/IRecursoRepository'
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository'
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository'
import { INotificacionUsuarioRepository } from '../../../domain/interfaces/INotificacionUsuarioRepository'
import { NotificacionFabrica } from '../../../infrastructure/patterns/factoryMethod/NotificacionFabrica'
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion'

interface DeleteRecursoInput {
  evento_id: number
  recurso_id: number
}

interface DeleteRecursoResult {
  success: boolean
  message: string
}

export class DeleteRecursoUseCase {
  constructor(
    private recursoRepository: IRecursoRepository,
    private eventoRepository: IEventoRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository,
    private notificacionUsuarioRepository: INotificacionUsuarioRepository
  ) {}

  async execute({ evento_id, recurso_id }: DeleteRecursoInput): Promise<DeleteRecursoResult> {
    if (!evento_id || !recurso_id) {
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

    await this.notificarAsistentes(evento_id, recurso.nombre)

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

  private async notificarAsistentes(evento_id: number, recursoNombre?: string | null): Promise<void> {
    try {
      const mensaje = recursoNombre
        ? `El recurso "${recursoNombre}" ha sido eliminado del evento.`
        : 'Un recurso ha sido eliminado del evento.'

      const notificacionAccion = await NotificacionFabrica.crearNotificacion(
        new Date(),
        evento_id,
        TipoNotificacion.ACCION,
        mensaje
      )

      if (!notificacionAccion?.notificacion_id) {
        return
      }

      const participantes = await this.eventoParticipanteRepository.findParticipantesByEventoAndRol(evento_id)
      const invitados = participantes.filter((p: any) => {
        const rol = (p.rol || '').toLowerCase()
        return ['coorganizador', 'asistente', 'participante'].includes(rol)
      })

      for (const participante of invitados) {
        try {
          await this.notificacionUsuarioRepository.create({
            notificacion_accion_id: notificacionAccion.notificacion_id,
            usuario_id: participante.usuario_id
          })
        } catch (error) {
          console.error('Error asociando notificación a usuario:', error)
        }
      }
    } catch (error) {
      console.error('Error enviando notificación de recurso eliminado:', error)
    }
  }
}
