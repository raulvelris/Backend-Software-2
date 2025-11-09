import { INotificacionParticipanteRepository } from '../../domain/interfaces/INotificacionParticipanteRepository';

const db = require('../database/models');

export class NotificacionParticipanteRepository implements INotificacionParticipanteRepository {
  
  constructor() {}
  
  async create(data: any): Promise<any> {
    try {
      const nuevaNotificacionParticipante = await db.NotificacionParticipante.create(data);
      return nuevaNotificacionParticipante;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

    async findAllByUsuarioIdWithDetalles(usuarioId: number): Promise<any[] | null> {
    try {
      const rows = await db.NotificacionParticipante.findAll({
        where: { usuario_id: usuarioId },
        include: [
          {
            model: db.NotificacionAccion,
            as: 'notificacion_accion',
            required: true,
            include: [
              {
                model: db.Notificacion,
                as: 'notificacion',
                required: true,
                include: [
                  {
                    model: db.Evento,
                    as: 'evento'
                  }
                ]
              }
            ]
          }
        ],
        order: [[{ model: db.NotificacionAccion, as: 'notificacion_accion' },
               { model: db.Notificacion, as: 'notificacion' },
               'fechaHora', 'DESC']] // Ordena por fechaHora en orden descendente
      });
      return rows;
    } catch (error) {
      console.error('Error en findAllByUsuarioIdWithDetalles:', error);
      throw error;
    }
  }
}