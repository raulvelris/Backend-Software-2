// Interfaz de repositorio para Recurso
export interface IRecursoRepository {
  findById(id: number): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: number, data: any): Promise<any | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<any[]>;
  findByEventoId(eventoId: number): Promise<any[]>;
  findByTipoRecurso(tipoRecursoId: number): Promise<any[]>;
  findByEventoIdAndNombre(eventoId: number, nombre: string): Promise<any | null>;
  findByEventoIdAndUrl(eventoId: number, url: string): Promise<any | null>;
}
