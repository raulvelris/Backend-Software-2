import { Transaction } from 'sequelize';

// Interfaz de repositorio para Evento
// Usa modelos de Sequelize directamente (any)
export interface IEventoRepository {
  // Propiedad para acceder a la instancia de sequelize
  sequelize: any;
  
  // Métodos CRUD con soporte opcional para transacciones
  findById(id: number, options?: { transaction?: Transaction }): Promise<any | null>;
  create(data: any, options?: { transaction?: Transaction }): Promise<any>;
  update(id: number, data: any, options?: { transaction?: Transaction }): Promise<any | null>;
  delete(id: number, options?: { transaction?: Transaction }): Promise<boolean>;
  
  // Otros métodos
  findAll(options?: { transaction?: Transaction }): Promise<any[]>;
  incrementParticipantes(eventoId: number, options?: { transaction?: Transaction }): Promise<void>;
  
  // Métodos para consultas específicas
  findByTituloLowerCase(titulo: string, options?: { transaction?: Transaction }): Promise<any | null>;
  countEventosByOrganizador(usuarioId: number, options?: { transaction?: Transaction }): Promise<number>;
  findPublicEvents(excludeUsuarioId?: number, options?: { transaction?: Transaction }): Promise<any[]>;
  findManagedEventsByUsuario(usuarioId: number, options?: { transaction?: Transaction }): Promise<any[]>;
  findAttendedEventsByUsuario(usuarioId: number, options?: { transaction?: Transaction }): Promise<any[]>;
}
