import { IUbicacionRepository } from '../../domain/interfaces/IUbicacionRepository';

const db = require('../database/models');

export class UbicacionRepository implements IUbicacionRepository {
  // Implementación de la propiedad sequelize requerida por la interfaz
  public sequelize = db.sequelize;
  
  async create(data: any): Promise<any> {
    try {
      const nuevaUbicacion = await db.Ubicacion.create(data);
      return nuevaUbicacion;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async findByEventoId(eventoId: number): Promise<any | null> {
    try {
      const ubicacion = await db.Ubicacion.findOne({
        where: { evento_id: eventoId },
        attributes: ['latitud', 'longitud']
      });
      return ubicacion;
    } catch (error) {
      console.error('Error en findByEventoId:', error);
      throw error;
    }
  }

  async update(id: number, data: any): Promise<any | null> {
    try {
      // Find the location by evento_id
      const [updated] = await db.Ubicacion.update(data, {
        where: { evento_id: id },
        returning: true
      });

      if (updated === 0) return null;
      
      // Return the first updated record
      return await this.findByEventoId(id);
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await db.Ubicacion.destroy({
        where: { ubicacion_id: id },
      });
      return result > 0;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }
}
