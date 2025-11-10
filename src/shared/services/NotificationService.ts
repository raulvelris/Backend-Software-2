import { EventoParticipanteRepository } from '../../infrastructure/repositories/EventoParticipanteRepository';
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { EmailService } from '../../infrastructure/services/EmailService';
import { Transaction } from 'sequelize';

interface Usuario {
  id: number;
  correo?: string;
  nombre?: string;
}

interface Participante {
  usuario_id: number;
}

interface NotificacionOptions {
  transaction?: Transaction;
}

export class NotificationService {
  constructor(
    private eventoParticipanteRepository: EventoParticipanteRepository & { sequelize?: any },
    private usuarioRepository: UsuarioRepository & { sequelize?: any },
    private emailService: EmailService
  ) {}

  async notificarEliminacionEvento(
    eventoId: number,
    motivo?: string,
    options?: NotificacionOptions
  ): Promise<void> {
    try {
      // Obtener participantes del evento
      const participantes = await this.obtenerParticipantesEvento(eventoId, options?.transaction);

      if (!participantes || participantes.length === 0) {
        console.log(`No hay participantes para notificar sobre el evento ${eventoId}`);
        return;
      }

      // Obtener usuarios
      const usuarios = await this.obtenerUsuarios(participantes, options?.transaction);

      // Enviar notificaciones
      await this.enviarNotificaciones(usuarios, eventoId, motivo, options);
      
      console.log(`Notificaciones enviadas a ${usuarios.length} participantes`);
    } catch (error) {
      console.error('Error al enviar notificaciones de eliminación de evento:', error);
      // No lanzamos el error para no interrumpir el flujo principal
    }
  }

  private async obtenerParticipantesEvento(
    eventoId: number, 
    transaction?: Transaction
  ): Promise<Participante[]> {
    try {
      // Usar consulta directa para obtener los participantes
      const result = await this.eventoParticipanteRepository.sequelize.query(
        'SELECT usuario_id FROM evento_participantes WHERE evento_id = :eventoId',
        {
          replacements: { eventoId },
          type: 'SELECT',
          transaction
        }
      ) as unknown as Participante[];
      
      return result || [];
    } catch (error) {
      console.error('Error al obtener participantes del evento:', error);
      return [];
    }
  }

  private async obtenerUsuarios(
    participantes: Participante[], 
    transaction?: Transaction
  ): Promise<Usuario[]> {
    if (participantes.length === 0) return [];
    
    try {
      const usuarioIds = participantes.map((p: Participante) => p.usuario_id);
      
      // Usar consulta directa para obtener los usuarios
      const result = await this.usuarioRepository.sequelize.query(
        'SELECT id, correo, nombre FROM usuarios WHERE id IN (:usuarioIds)',
        {
          replacements: { usuarioIds },
          type: 'SELECT',
          transaction
        }
      ) as unknown as Usuario[];
      
      return result || [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  private async enviarNotificaciones(
    usuarios: Usuario[],
    eventoId: number,
    motivo?: string,
    options?: NotificacionOptions
  ): Promise<void> {
    const notificaciones = usuarios
      .filter((usuario: Usuario) => usuario.correo)
      .map((usuario: Usuario) => 
        this.enviarNotificacionEliminacion(
          usuario.correo!,
          usuario.nombre || 'Usuario',
          eventoId,
          motivo,
          options
        )
      );

    await Promise.all(notificaciones);
  }

  private async enviarNotificacionEliminacion(
    email: string,
    nombre: string,
    eventoId: number,
    motivo?: string,
    options?: NotificacionOptions
  ): Promise<void> {
    const asunto = 'Evento cancelado';
    const mensaje = `
      <h2>¡Hola ${nombre}!</h2>
      <p>El evento al que estabas inscrito ha sido cancelado.</p>
      ${motivo ? `<p><strong>Motivo:</strong> ${motivo}</p>` : ''}
      <p>Lamentamos los inconvenientes que esto pueda ocasionar.</p>
      <p>¡Esperamos verte en futuros eventos!</p>
    `;

    try {
      await this.emailService.enviarEmail({
        to: email,
        subject: asunto,
        html: mensaje
      });
      
      console.log(`Notificación enviada a ${email} para el evento ${eventoId}`);
    } catch (error) {
      console.error(`Error al enviar notificación a ${email}:`, error);
      // No lanzamos el error para no interrumpir el flujo principal
    }
  }
}
