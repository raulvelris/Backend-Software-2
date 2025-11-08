import { INotificacionParticipanteRepository } from '../../../domain/interfaces/INotificacionParticipanteRepository'
import { GetNotificacionesAccionParamsDto, GetNotificacionesAccionResultDto, NotificacionAccionItemDto } from '../dtos/GetNotificacionesAccionDto'

export class GetNotificacionesAccionUseCase {
  constructor(
    private notificacionParticipanteRepository: INotificacionParticipanteRepository
  ) {}

  async execute(params: GetNotificacionesAccionParamsDto): Promise<GetNotificacionesAccionResultDto> {
    if (!params || typeof params.usuario_id !== 'number') {
      throw new Error('usuario_id es requerido')
    }

    const rows = await this.notificacionParticipanteRepository.findAllByUsuarioIdWithDetalles(params.usuario_id)
    if (!rows) {
      throw new Error('No se encontraron notificaciones')
    }

    const notificaciones_accion: NotificacionAccionItemDto[] = rows.map((r: any) => {
      const notificacion_accion = r.notificacion_accion || null
      const notificacion = notificacion_accion?.notificacion || null
      const evento = notificacion?.evento || null
      return {
        notificacion_participante_id: r.notificacion_participante_id,
        mensaje: notificacion_accion?.mensaje || null,
        evento: evento
          ? {
              evento_id: evento.evento_id,
              titulo: evento.titulo ?? null,
              fechaInicio: evento.fechaInicio ? new Date(evento.fechaInicio).toISOString() : null,
              fechaFin: evento.fechaFin ? new Date(evento.fechaFin).toISOString() : null,
            }
          : null,
      }
    })

    return { success: true, notificaciones_accion} 
  }
}
