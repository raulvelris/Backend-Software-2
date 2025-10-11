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
}
