import { IRecursoRepository } from '../../../domain/interfaces/IRecursoRepository';
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { ITipoRecursoRepository } from '../../../domain/interfaces/ITipoRecursoRepository';
import { IEventoParticipanteRepository } from '../../../domain/interfaces/IEventoParticipanteRepository';
import { NotificationManager } from '../../../infrastructure/patterns/observer/NotificationManager';
import { TipoNotificacion } from '../../../domain/value-objects/TipoNotificacion';
import { CrearRecursoDto, RecursoResponseDto } from '../dtos/CrearRecursoDto';

export class CrearRecursoEnlaceUseCase {
  constructor(
    private recursoRepository: IRecursoRepository,
    private eventoRepository: IEventoRepository,
    private tipoRecursoRepository: ITipoRecursoRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository,
    private notificationManager: NotificationManager
  ) {}

  async execute(dto: CrearRecursoDto): Promise<RecursoResponseDto> {
    // Validar datos requeridos
    if (!dto.nombre || !dto.nombre.trim()) {
      throw new Error('Faltan campos requeridos: nombre es obligatorio para enlaces');
    }

    if (!dto.url || !dto.url.trim()) {
      throw new Error('Faltan campos requeridos: url es obligatorio para enlaces');
    }

    // Validar formato de URL
    try {
      new URL(dto.url);
    } catch (e) {
      throw new Error('La URL proporcionada no es válida');
    }

    // Validar que el evento existe
    const evento = await this.eventoRepository.findById(dto.evento_id);
    if (!evento) {
      throw new Error('Evento no encontrado');
    }

    // Validar que el tipo de recurso existe
    const tipoRecurso = await this.tipoRecursoRepository.findById(dto.tipo_recurso);
    if (!tipoRecurso) {
      throw new Error('Tipo de recurso no encontrado');
    }

    // Validar que no exista otro recurso con el mismo nombre en el mismo evento
    const nombreNormalizado = dto.nombre.trim();
    const recursoConMismoNombre = await this.recursoRepository.findByEventoIdAndNombre(
      dto.evento_id,
      nombreNormalizado,
    );

    if (recursoConMismoNombre) {
      throw new Error('Nombre de recurso no válido: ya existe un recurso con ese nombre para este evento');
    }

    // Validar que no exista otra URL igual en el mismo evento
    const urlNormalizada = dto.url.trim();
    const recursoConMismaUrl = await this.recursoRepository.findByEventoIdAndUrl(
      dto.evento_id,
      urlNormalizada,
    );

    if (recursoConMismaUrl) {
      throw new Error('URL de recurso no válido: ya existe un recurso con esta URL para este evento');
    }

    // Crear el recurso
    const recurso = await this.recursoRepository.create({
      nombre: dto.nombre.trim(),
      url: dto.url.trim(),
      tipo_recurso: dto.tipo_recurso,
      evento_id: dto.evento_id
    });

    if (!recurso?.recurso_id) {
      throw new Error('Error al crear el recurso en la base de datos');
    }

    // Verificar si se debe enviar notificación
    // Solo notificar si: hay participantes Y el evento no ha pasado
    if (dto.emisorId) {
      // Convertir a objeto plano si es un modelo de Sequelize
      const eventoPlain = typeof evento.toJSON === 'function' ? evento.toJSON() : evento;
      const fechaFin = eventoPlain.fechaFin ? new Date(eventoPlain.fechaFin) : null;
      const ahora = new Date();
      
      // Verificar que el evento no haya pasado
      const eventoNoHaPasado = fechaFin && fechaFin > ahora;
      
      // Verificar que haya participantes
      const cantidadParticipantes = await this.eventoParticipanteRepository.countByEvento(dto.evento_id);
      const hayParticipantes = cantidadParticipantes > 1;
      
      // Notificar solo si ambas condiciones se cumplen
      if (eventoNoHaPasado && hayParticipantes) {
        await this.notificationManager.notify(
          TipoNotificacion.RECURSO_AGREGADO,
          { eventoId: dto.evento_id, emisorId: dto.emisorId }
        );
      }
    }

    // Mapear la respuesta al formato que espera el frontend
    return {
      id: recurso.recurso_id,
      nombre: dto.nombre.trim(),
      url: dto.url.trim(),
      tipo_recurso: {
        id: dto.tipo_recurso,
        nombre: tipoRecurso.nombre
      },
      evento_id: dto.evento_id
    };
  }
}

