export interface DeleteRecursoDto {
  evento_id: number;
  recurso_id: number;
  usuario_id: number;
}

export interface DeleteRecursoResponseDto {
  success: boolean;
  message: string;
}
