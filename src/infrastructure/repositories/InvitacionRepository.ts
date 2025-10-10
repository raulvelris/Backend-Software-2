import { IInvitacionRepository } from '../../domain/interfaces/IInvitacionRepository';
import { EstadoInvitacionEnum, TipoNoElegible } from '../../domain/value-objects/EstadoInvitacion';

const db = require('../database/models');

export class InvitacionRepository implements IInvitacionRepository {
  
  async findById(id: number): Promise<any | null> {
    try {
      const invitacion = await db.Invitacion.findByPk(id);
      return invitacion;
    } catch (error) {
      console.error('Error en findById:', error);
      throw error;
    }
  }

  async create(data: any): Promise<any> {
    try {
      const nuevaInvitacion = await db.Invitacion.create(data);
      return nuevaInvitacion;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async createInvitacionUsuario(data: any): Promise<any> {
    try {
      const nuevaInvitacionUsuario = await db.InvitacionUsuario.create(data);
      return nuevaInvitacionUsuario;
    } catch (error) {
      console.error('Error en createInvitacionUsuario:', error);
      throw error;
    }
  }

  async findInvitacionUsuarioByEventoAndUsuario(eventoId: number, usuarioId: number): Promise<any | null> {
    try {
      const invitacionExistente = await db.InvitacionUsuario.findOne({
        where: { usuario_id: usuarioId },
        include: [{
          model: db.Invitacion,
          as: 'invitacion',
          required: true,
          include: [{
            model: db.Notificacion,
            as: 'notificacion',
            required: true,
            where: { evento_id: eventoId }
          }]
        }]
      });
      
      return invitacionExistente;
    } catch (error) {
      console.error('Error en findInvitacionUsuarioByEventoAndUsuario:', error);
      throw error;
    }
  }

  async countPendientesByEvento(eventoId: number): Promise<number> {
    try {
      const estadoPendiente = await db.EstadoInvitacion.findOne({
        where: { nombre: EstadoInvitacionEnum.PENDIENTE }
      });

      if (!estadoPendiente) return 0;

      const count = await db.InvitacionUsuario.count({
        include: [{
          model: db.Invitacion,
          as: "invitacion",
          required: true,
          include: [{
            model: db.Notificacion,
            as: "notificacion",
            required: true,
            where: { evento_id: eventoId }
          }]
        }],
        where: { estado_invitacion_id: estadoPendiente.estado_id }
      });

      return count;
    } catch (error) {
      console.error('Error en countPendientesByEvento:', error);
      throw error;
    }
  }

  async findNoElegiblesByEvento(eventoId: number): Promise<any[]> {
    try {
      const estadoPendiente = await db.EstadoInvitacion.findOne({
        where: { nombre: EstadoInvitacionEnum.PENDIENTE }
      });

      if (!estadoPendiente) return [];

      // Obtener pendientes
      const pendientes = await db.InvitacionUsuario.findAll({
        where: { estado_invitacion_id: estadoPendiente.estado_id },
        include: [
          {
            model: db.Invitacion,
            as: "invitacion",
            required: true,
            include: [{
              model: db.Notificacion,
              as: "notificacion",
              required: true,
              where: { evento_id: eventoId },
              attributes: []
            }],
            attributes: []
          },
          {
            model: db.Usuario,
            as: "usuario",
            attributes: ["usuario_id", "correo"],
            required: true,
            include: [{
              model: db.Cliente,
              as: "cliente",
              attributes: ["nombre", "apellido"],
              required: true
            }]
          }
        ]
      });

      // Obtener participantes
      const participantes = await db.EventoParticipante.findAll({
        where: { evento_id: eventoId },
        include: [{
          model: db.Participante,
          as: "participante",
          required: true,
          include: [{
            model: db.Usuario,
            as: "usuario",
            attributes: ["usuario_id", "correo"],
            required: true,
            include: [{
              model: db.Cliente,
              as: "cliente",
              attributes: ["nombre", "apellido"],
              required: true
            }]
          }]
        }]
      });

      const noElegibles = [
        ...pendientes.map((i: any) => ({
          usuario_id: i.usuario.usuario_id,
          correo: i.usuario.correo,
          nombre: i.usuario.cliente?.nombre || "",
          apellido: i.usuario.cliente?.apellido || "",
          tipo: TipoNoElegible.PENDIENTE
        })),
        ...participantes.map((p: any) => ({
          usuario_id: p.participante.usuario.usuario_id,
          correo: p.participante.usuario.correo,
          nombre: p.participante.usuario.cliente?.nombre || "",
          apellido: p.participante.usuario.cliente?.apellido || "",
          tipo: TipoNoElegible.PARTICIPANTE
        }))
      ];

      return noElegibles;
    } catch (error) {
      console.error('Error en findNoElegiblesByEvento:', error);
      throw error;
    }
  }
}
