// Interfaz de repositorio para Recurso
export interface IRecursoRepository {
  findById(id: number): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: number, data: any): Promise<any | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<any[]>;
  findByEventoId(eventoId: number): Promise<any[]>;
  findByTipoRecurso(tipoRecursoId: number): Promise<any[]>;
}
