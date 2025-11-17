import { Transaction } from 'sequelize';

// Interfaz de repositorio para Evento
// Usa modelos de Sequelize directamente (any)
export interface IEventoRepository {
  findById(id: number): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: number, data: any): Promise<any | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<any[]>;
  
  // Métodos para consultas específicas
  findByTituloLowerCase(titulo: string, options?: { transaction?: Transaction }): Promise<any | null>;
  countEventosByOrganizador(usuarioId: number, options?: { transaction?: Transaction }): Promise<number>;
  findPublicEvents(excludeUsuarioId?: number, options?: { transaction?: Transaction }): Promise<any[]>;
  findManagedEventsByUsuario(usuarioId: number, options?: { transaction?: Transaction }): Promise<any[]>;
  findAttendedEventsByUsuario(usuarioId: number, options?: { transaction?: Transaction }): Promise<any[]>;
}
