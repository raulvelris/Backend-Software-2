import { IRecursoRepository } from '../../../domain/interfaces/IRecursoRepository';
import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository';

export class ListarRecursosUseCase {
  constructor(
    private recursoRepository: IRecursoRepository,
    private eventoRepository: IEventoRepository
  ) {}

  async execute(input: { evento_id: number }): Promise<any[]> {
    const { evento_id } = input;

    // Verificar que el evento existe
    const evento = await this.eventoRepository.findById(evento_id);
    if (!evento) {
      throw new Error('Event not found');
    }

    // Obtener los recursos del evento
    const recursos = await this.recursoRepository.findByEventoId(evento_id);
    
    // Mapear al formato que espera el frontend
    return recursos.map(recurso => ({
      id: recurso.recurso_id,
      nombre: recurso.nombre,
      url: recurso.url,
      tipo_recurso: {
        id: recurso.tipo?.tipo_recurso_id || recurso.tipo_recurso,
        nombre: recurso.tipo?.nombre || ''
      },
      evento_id: recurso.evento_id,
      created_at: recurso.created_at,
      updated_at: recurso.updated_at
    }));
  }
}
