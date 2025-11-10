import { Transaction } from 'sequelize';

// Interfaz de repositorio para Ubicacion
// Usa modelos de Sequelize directamente (any)
export interface IUbicacionRepository {
  // Propiedad para acceder a la instancia de sequelize
  sequelize: any;
  
  // Métodos CRUD con soporte opcional para transacciones
  create(data: any, options?: { transaction?: Transaction }): Promise<any>;
  findByEventoId(eventoId: number, options?: { transaction?: Transaction }): Promise<any | null>;
  update(id: number, data: any, options?: { transaction?: Transaction }): Promise<any | null>;
  delete(id: number, options?: { transaction?: Transaction }): Promise<boolean>;
}
