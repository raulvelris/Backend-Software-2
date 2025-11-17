import { IRecursoRepository } from '../../../domain/interfaces/IRecursoRepository';
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';
import { ITipoRecursoRepository } from '../../../domain/interfaces/ITipoRecursoRepository';
import { CrearRecursoDto, RecursoResponseDto } from '../dtos/CrearRecursoDto';

export class CrearRecursoArchivoUseCase {
  constructor(
    private recursoRepository: IRecursoRepository,
    private eventoRepository: IEventoRepository,
    private tipoRecursoRepository: ITipoRecursoRepository
  ) {}

  async execute(dto: CrearRecursoDto): Promise<RecursoResponseDto> {
    // Validar datos requeridos
    if (!dto.nombre || !dto.nombre.trim()) {
      throw new Error('Faltan campos requeridos: nombre es obligatorio');
    }

    if (!dto.url || !dto.url.trim()) {
      throw new Error('Faltan campos requeridos: url es obligatorio');
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

