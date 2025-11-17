import { IRecursoRepository } from '../../domain/interfaces/IRecursoRepository';

const db = require('../database/models');

export class RecursoRepository implements IRecursoRepository {
  async findById(id: number): Promise<any | null> {
    try {
      return await db.Recurso.findByPk(id);
    } catch (error) {
      console.error('Error en RecursoRepository.findById:', error);
      throw error;
    }
  }

  async create(data: any): Promise<any> {
    try {
      return await db.Recurso.create(data);
    } catch (error) {
      console.error('Error en RecursoRepository.create:', error);
      throw error;
    }
  }

  async update(id: number, data: any): Promise<any | null> {
    try {
      const [updated] = await db.Recurso.update(data, {
        where: { recurso_id: id }
      });
      if (updated) {
        return await this.findById(id);
      }
      return null;
    } catch (error) {
      console.error('Error en RecursoRepository.update:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const deleted = await db.Recurso.destroy({
        where: { recurso_id: id }
      });
      return deleted > 0;
    } catch (error) {
      console.error('Error en RecursoRepository.delete:', error);
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    try {
      return await db.Recurso.findAll();
    } catch (error) {
      console.error('Error en RecursoRepository.findAll:', error);
      throw error;
    }
  }

  async findByEventoId(eventoId: number): Promise<any[]> {
    try {
      return await db.Recurso.findAll({
        where: { evento_id: eventoId },
        include: [
          {
            model: db.TipoRecurso,
            as: 'tipo',
            attributes: ['tipo_recurso_id', 'nombre']
          }
        ]
      });
    } catch (error) {
      console.error('Error en RecursoRepository.findByEventoId:', error);
      throw error;
    }
  }

  async findByTipoRecurso(tipoRecursoId: number): Promise<any[]> {
    try {
      return await db.Recurso.findAll({
        where: { tipo_recurso: tipoRecursoId }
      });
    } catch (error) {
      console.error('Error en RecursoRepository.findByTipoRecurso:', error);
      throw error;
    }
  }

  async findByEventoIdAndNombre(eventoId: number, nombre: string): Promise<any | null> {
    try {
      return await db.Recurso.findOne({
        where: {
          evento_id: eventoId,
          nombre,
        },
      });
    } catch (error) {
      console.error('Error en RecursoRepository.findByEventoIdAndNombre:', error);
      throw error;
    }
  }

  async findByEventoIdAndUrl(eventoId: number, url: string): Promise<any | null> {
    try {
      return await db.Recurso.findOne({
        where: {
          evento_id: eventoId,
          url,
        },
      });
    } catch (error) {
      console.error('Error en RecursoRepository.findByEventoIdAndUrl:', error);
      throw error;
    }
  }
}
