import { IRecursoRepository } from 'domain/interfaces/IRecursoRepository';
import { IEventoRepository } from 'domain/interfaces/IEventoRepository';
import { ITipoRecursoRepository } from 'domain/interfaces/ITipoRecursoRepository';

export class SubirRecursoUseCase {
  constructor(
    private recursoRepository: IRecursoRepository,
    private eventoRepository: IEventoRepository,
    private tipoRecursoRepository: ITipoRecursoRepository
  ) {}

  async execute(input: { 
    evento_id: number | string; 
    nombre: string; 
    url: string; 
    tipo_recurso: number | string;
  }): Promise<{ success: boolean; recurso_id: number; message?: string }> {
    try {
      // Validación de tipos
      const eventoId = Number(input.evento_id);
      const tipoRecursoId = Number(input.tipo_recurso);
      
      if (isNaN(eventoId) || isNaN(tipoRecursoId)) {
        throw new Error('ID de evento o tipo de recurso no válido');
      }

      // Validar campos requeridos
      if (!input.nombre?.trim() || !input.url?.trim()) {
        throw new Error('Nombre y URL son campos requeridos');
      }

      // Validar formato de URL si es un enlace
      if (tipoRecursoId === 1) { // Asumiendo que 1 es para enlaces
        try {
          new URL(input.url);
        } catch (e) {
          throw new Error('La URL proporcionada no es válida');
        }
      }

      console.log('🔍 Verificando existencia de evento y tipo de recurso...');
      
      // Verificar que el evento existe
      const [evento, tipoRecurso] = await Promise.all([
        this.eventoRepository.findById(eventoId),
        this.tipoRecursoRepository.findById(tipoRecursoId)
      ]);

      if (!evento) {
        console.error(`❌ Evento no encontrado con ID: ${eventoId}`);
        throw new Error('Evento no encontrado');
      }

      if (!tipoRecurso) {
        console.error(`❌ Tipo de recurso no encontrado con ID: ${tipoRecursoId}`);
        throw new Error('Tipo de recurso no encontrado');
      }

      console.log('✅ Validaciones exitosas, creando recurso...');

      // Crear el recurso
      const recurso = await this.recursoRepository.create({
        nombre: input.nombre.trim(),
        url: input.url.trim(),
        tipo_recurso: tipoRecursoId,
        evento_id: eventoId
      });

      if (!recurso?.recurso_id) {
        throw new Error('Error al crear el recurso en la base de datos');
      }

      console.log('✅ Recurso creado exitosamente con ID:', recurso.recurso_id);
      
      return { 
        success: true, 
        recurso_id: recurso.recurso_id,
        message: 'Recurso creado exitosamente'
      };

    } catch (error: any) {
      console.error('❌ Error en SubirRecursoUseCase:', error);
      throw error; // Re-lanzar el error para que lo maneje el controlador
    }
  }
}
