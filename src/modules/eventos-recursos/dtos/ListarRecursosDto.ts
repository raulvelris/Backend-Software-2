export interface RecursoDto {
  id: number;
  nombre: string;
  url: string;
  tipo_recurso: {
    id: number;
    nombre: string;
  };
  evento_id: number;
  created_at?: string;
  updated_at?: string;
}

