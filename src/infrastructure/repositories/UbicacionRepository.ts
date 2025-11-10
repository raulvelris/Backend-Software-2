import { IUbicacionRepository } from '../../domain/interfaces/IUbicacionRepository';
import { Transaction } from 'sequelize';

const db = require('../database/models');

export class UbicacionRepository implements IUbicacionRepository {
  // Implementación de la propiedad sequelize requerida por la interfaz
  public sequelize = db.sequelize;
  
  async create(data: any, options?: { transaction?: Transaction }): Promise<any> {
    try {
      const nuevaUbicacion = await db.Ubicacion.create(data, { transaction: options?.transaction });
      return nuevaUbicacion;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async findByEventoId(eventoId: number, options?: { transaction?: Transaction }): Promise<any | null> {
    try {
      const ubicacion = await db.Ubicacion.findOne({
        where: { evento_id: eventoId },
        transaction: options?.transaction
      });
      return ubicacion;
    } catch (error) {
      console.error('Error en findByEventoId:', error);
      throw error;
    }
  }

  async update(id: number, data: any, options?: { transaction?: Transaction }): Promise<any | null> {
    try {
      const ubicacion = await db.Ubicacion.findByPk(id, { transaction: options?.transaction });
      if (!ubicacion) return null;
      
      await ubicacion.update(data, { transaction: options?.transaction });
      return ubicacion;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  async delete(id: number, options?: { transaction?: Transaction }): Promise<boolean> {
    try {
      const result = await db.Ubicacion.destroy({
        where: { ubicacion_id: id },
        transaction: options?.transaction
      });
      return result > 0;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }
}
