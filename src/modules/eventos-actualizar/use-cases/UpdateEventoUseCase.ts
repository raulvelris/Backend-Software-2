import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { IUbicacionRepository } from '../../../domain/interfaces/IUbicacionRepository';

export interface UpdateEventoRequest {
  name: string;
  date: string;
  capacity: number;
  description?: string;
  privacy?: 'public' | 'private';
  locationAddress: string;
  imageUrl: string;
  lat: number;
  lng: number;
}

export class UpdateEventoUseCase {
  constructor(
    private eventoRepository: IEventoRepository,
    private ubicacionRepository: IUbicacionRepository
  ) {}

  async execute(id: number, eventData: UpdateEventoRequest): Promise<{
    success: boolean;
    message: string;
    evento?: any;
  }> {
    try {
      // Verificar si el evento existe
      const eventoExistente = await this.eventoRepository.findById(id);
      if (!eventoExistente) {
        return { 
          success: false, 
          message: 'Evento no encontrado' 
        };
      }
      
      // Mapear privacidad a ID numérico
      const privacidadId = eventData.privacy === 'private' ? 2 : 1;

      // Datos para actualizar la ubicación
      const ubicacionData = {
        direccion: eventData.locationAddress,
        latitud: eventData.lat,
        longitud: eventData.lng
      };

      // Buscar ubicación existente para este evento
      const ubicacionExistente = await this.ubicacionRepository.findByEventoId(id);
      let ubicacionId: number | undefined;

      if (ubicacionExistente) {
        // Si existe, actualizarla
        await this.ubicacionRepository.update(
          id, 
          ubicacionData
        );
        ubicacionId = ubicacionExistente.ubicacion_id || ubicacionExistente.id;
      } else {
        // Si no existe, crearla
        const nuevaUbicacion = await this.ubicacionRepository.create({
          ...ubicacionData,
          evento_id: id
        });
        ubicacionId = nuevaUbicacion.ubicacion_id || nuevaUbicacion.id;
      }

      // Actualizar el evento
      const eventoActualizado = await this.eventoRepository.update(
        id,
        {
          nombre: eventData.name,
          descripcion: eventData.description || '',
          fechaInicio: new Date(eventData.date),
          aforo: eventData.capacity,
          privacidad: privacidadId,
          imagen: eventData.imageUrl,
          ubicacionId: ubicacionId
        }
      );

      // Obtener la ubicación actualizada
      const ubicacionActualizada = await this.ubicacionRepository.findByEventoId(id);

      return {
        success: true,
        message: 'Evento actualizado correctamente',
        evento: {
          ...eventoActualizado,
          ubicacion: ubicacionActualizada
        }
      };
    } catch (error: unknown) {
      console.error('Error en UpdateEventoUseCase:', error);
      
      let errorMessage = 'Error al actualizar el evento';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  }
}