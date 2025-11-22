// Interfaz de repositorio para Ubicacion
// Usa modelos de Sequelize directamente (any)
export interface IUbicacionRepository {
  // Propiedad para acceder a la instancia de sequelize
  sequelize: any;
  
  // Métodos CRUD con soporte opcional para transacciones
  create(data: any): Promise<any>;
  findByEventoId(eventoId: number): Promise<any | null>;
  update(id: number, data: any): Promise<any | null>;
  delete(id: number): Promise<boolean>;
}
