// Interfaz de repositorio para Evento
// Usa modelos de Sequelize directamente (any)
export interface IEventoRepository {
  findById(id: number): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: number, data: any): Promise<any | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<any[]>;
  incrementParticipantes(eventoId: number): Promise<void>;
}
