export interface CrearRecursoDto {
  evento_id: number;
  nombre: string;
  url: string;
  tipo_recurso: number;
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

