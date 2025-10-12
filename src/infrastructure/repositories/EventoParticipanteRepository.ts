import { IEventoParticipanteRepository } from '../../domain/interfaces/IEventoParticipanteRepository';

const db = require('../database/models');

export class EventoParticipanteRepository implements IEventoParticipanteRepository {
  
  async isUsuarioInEvento(eventoId: number, usuarioId: number): Promise<boolean> {
    try {
      const participante = await db.EventoParticipante.findOne({
        include: [{
          model: db.Participante,
          as: "participante",
          required: true,
          where: { usuario_id: usuarioId }
        }],
        where: { evento_id: eventoId }
      });
      
      return participante !== null;
    } catch (error) {
      console.error('Error en isUsuarioInEvento:', error);
      throw error;
    }
  }

  async countByEvento(eventoId: number): Promise<number> {
    try {
      const count = await db.EventoParticipante.count({ where: { evento_id: eventoId } });
      return count;
    } catch (error) {
      console.error('Error en countByEvento:', error);
      throw error;
    }
  }

  async addByUsuario(eventoId: number, usuarioId: number): Promise<any> {
    try {
      const participante = await db.Participante.findOne({ where: { usuario_id: usuarioId } });
      if (!participante) {
        throw new Error('Participante not found for user');
      }
      const created = await db.EventoParticipante.create({
        evento_id: eventoId,
        participante_id: participante.participante_id,
      });
      return created;
    } catch (error) {
      console.error('Error en addByUsuario:', error);
      throw error;
    }
  }
}
