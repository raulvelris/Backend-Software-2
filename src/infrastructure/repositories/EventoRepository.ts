import { IEventoRepository } from '../../domain/interfaces/IEventoRepository';

const db = require('../database/models');

export class EventoRepository implements IEventoRepository {
  
  async findById(id: number): Promise<any | null> {
    try {
      const evento = await db.Evento.findByPk(id, {
        include: [
          {
            model: db.Ubicacion,
            as: 'ubicacion',
            attributes: ['direccion', 'latitud', 'longitud'],
            required: false,
          }
        ]
      });
      return evento;
    } catch (error) {
      console.error('Error en findById:', error);
      throw error;
    }
  }

  async create(data: any): Promise<any> {
    try {
      const nuevoEvento = await db.Evento.create(data);
      return nuevoEvento;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async update(id: number, data: any): Promise<any | null> {
    try {
      const evento = await db.Evento.findByPk(id);
      if (!evento) return null;
      
      await evento.update(data);
      return evento;
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await db.Evento.destroy({ where: { evento_id: id } });
      return result > 0;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const eventos = await db.Evento.findAll();
      return eventos;
    } catch (error) {
      console.error('Error en findAll:', error);
      throw error;
    }
  }
}
