export interface GetNotificacionesAccionParamsDto {
  usuario_id: number;
}

export interface NotificacionAccionItemDto {
  notificacion_participante_id: number;
  mensaje: string | null;
  evento: {
    evento_id: number;
    titulo: string | null;
    fechaInicio: string | null;
    fechaFin: string | null;
  } | null;
}

export interface GetNotificacionesAccionResultDto {
  success: boolean;
  notificaciones_accion: NotificacionAccionItemDto[];
}
