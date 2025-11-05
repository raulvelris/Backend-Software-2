export interface UsuarioInvitacion {
  usuario_id: number;
  esParaCoorganizar: boolean; // true = Coorganizador, false = Asistente
}

export interface SendInvitacionDto {
  evento_id: number;
  usuarios: UsuarioInvitacion[]; // Array de usuarios con su tipo de invitación
}

export interface SendInvitacionResultDto {
  success: boolean;
  notificacion_id?: number;
  resultados: {
    usuario_id: number;
    status: string;
    invitacion_usuario_id?: number;
    esParaCoorganizar?: boolean;
  }[];
}
