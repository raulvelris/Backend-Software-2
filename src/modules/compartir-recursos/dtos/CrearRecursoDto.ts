export interface CrearRecursoDto {
  evento_id: number;
  nombre: string;
  url: string;
  tipo_recurso: number;
  emisorId?: number; // ID del usuario que está subiendo el recurso
}

export interface RecursoResponseDto {
  id: number;
  nombre: string;
  url: string;
  tipo_recurso: {
    id: number;
    nombre: string;
  };
  evento_id: number;
}

