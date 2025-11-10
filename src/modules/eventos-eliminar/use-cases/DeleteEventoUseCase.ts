import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { IUbicacionRepository } from '../../../domain/interfaces/IUbicacionRepository';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { TipoRol } from '../../../domain/value-objects/TipoRol';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';
import { NotificationManager } from '../../../infrastructure/patterns/observer/NotificationManager';

export class DeleteEventoUseCase {
  constructor(
    private eventoRepository: IEventoRepository,
    private ubicacionRepository: IUbicacionRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository,
    private notificationManager: NotificationManager
  ) {}

  async execute(
    eventoId: number
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    console.log('Iniciando proceso de eliminación para el evento ID:', eventoId);
    
    try {
      // Verificar si el evento existe
      console.log(`Buscando evento con ID: ${eventoId}`);
      const evento = await this.eventoRepository.findById(eventoId);
      if (!evento) {
        const errorMsg = `No se encontró el evento con ID: ${eventoId}`;
        console.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Verificar si el evento tiene asistentes
      console.log('Verificando si el evento tiene asistentes...');
      const participantes = await this.eventoParticipanteRepository.findParticipantesByEventoAndRol(eventoId);
      console.log(`Total de participantes encontrados: ${participantes.length}`);
      
      const hasAsistentes = participantes.some((p: any) => {
        const rolNombre = p.rol;
        console.log(`Participante ${p.nombre} ${p.apellido} - rol: ${rolNombre}, esperado: ${TipoRol.ASISTENTE}`);
        return rolNombre === TipoRol.ASISTENTE;
      });
      
      console.log(`¿Tiene asistentes?: ${hasAsistentes}`);
      
      if (hasAsistentes) {
        const errorMsg = 'No se puede eliminar el evento porque tiene asistentes registrados';
        console.error(errorMsg);
        return { 
          success: false, 
          error: errorMsg,
          message: 'No se puede eliminar el evento porque tiene asistentes registrados.'
        };
      }

      // Notificar eliminación del evento
      await this.notificationManager.notify(
        TipoNotificacion.EVENTO_ELIMINADO,
        {
          eventoId,
          emisorId: evento.usuario_id,
        }
      );
      
      // 1. Eliminar relaciones de participantes del evento
      console.log('Eliminando participantes del evento...');
      await this.eventoParticipanteRepository.deleteByEventoId(eventoId);
      
      // 2. Eliminar ubicación si existe
      console.log('Buscando ubicación del evento...');
      const ubicacion = await this.ubicacionRepository.findByEventoId(eventoId);
      
      if (ubicacion) {
        console.log('Eliminando ubicación...');
        // Usar ubicacion.ubicacion_id en lugar de ubicacion.id
        await this.ubicacionRepository.delete(ubicacion.ubicacion_id);
      } else {
        console.log('No se encontró ubicación para eliminar');
      }
      
      // 3. Eliminar el evento
      console.log('Eliminando evento...');
      await this.eventoRepository.delete(eventoId);
      
      console.log('Evento eliminado correctamente');
      return { 
        success: true, 
        message: 'Evento eliminado correctamente' 
      };
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error en DeleteEventoUseCase:', errorMsg);
      return { 
        success: false, 
        error: 'Error al eliminar el evento',
        message: process.env.NODE_ENV === 'development' ? errorMsg : 'Error al procesar la solicitud'
      };
    }
  }
}
