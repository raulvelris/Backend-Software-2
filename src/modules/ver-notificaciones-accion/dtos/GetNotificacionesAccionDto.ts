export interface GetNotificacionesAccionParamsDto {
  usuario_id: number;
}


export interface NotificacionAccionItemDto {
  /*
  invitacion_usuario_id: number;
  estado: string | null;
  fechaLimite: string | null;
  evento: {
    evento_id: number;
    titulo: string | null;
    fechaInicio: string | null;
    fechaFin: string | null;
  } | null;
   */
}

export interface GetNotificacionesAccionResultDto {
  success: boolean;
  notificaciones: NotificacionAccionItemDto[];
}
