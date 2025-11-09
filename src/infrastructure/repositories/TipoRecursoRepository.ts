import { ITipoRecursoRepository } from '../../domain/interfaces/ITipoRecursoRepository';

const db = require('../database/models');

export class TipoRecursoRepository implements ITipoRecursoRepository {
  async findById(id: number): Promise<any | null> {
    try {
      return await db.TipoRecurso.findByPk(id);
    } catch (error) {
      console.error('Error en TipoRecursoRepository.findById:', error);
      throw error;
    }
  }

  async create(data: any): Promise<any> {
    try {
      return await db.TipoRecurso.create(data);
    } catch (error) {
      console.error('Error en TipoRecursoRepository.create:', error);
      throw error;
    }
  }

  async update(id: number, data: any): Promise<any | null> {
    try {
      const [updated] = await db.TipoRecurso.update(data, {
        where: { tipo_recurso_id: id }
      });
      if (updated) {
        return await this.findById(id);
      }
      return null;
    } catch (error) {
      console.error('Error en TipoRecursoRepository.update:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const deleted = await db.TipoRecurso.destroy({
        where: { tipo_recurso_id: id }
      });
      return deleted > 0;
    } catch (error) {
      console.error('Error en TipoRecursoRepository.delete:', error);
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    try {
      return await db.TipoRecurso.findAll();
    } catch (error) {
      console.error('Error en TipoRecursoRepository.findAll:', error);
      throw error;
    }
  }

  async findByName(nombre: string): Promise<any | null> {
    try {
      return await db.TipoRecurso.findOne({
        where: { nombre }
      });
    } catch (error) {
      console.error('Error en TipoRecursoRepository.findByName:', error);
      throw error;
    }
  }
}
