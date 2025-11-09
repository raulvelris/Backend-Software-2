import { IRecursoRepository } from 'domain/interfaces/IRecursoRepository';

export class EliminarRecursoUseCase {
  constructor(
    private recursoRepository: IRecursoRepository
  ) {}

  async execute(input: { recurso_id: number }): Promise<void> {
    const { recurso_id } = input;

    // Verificar que el recurso existe
    const recurso = await this.recursoRepository.findById(recurso_id);
    if (!recurso) {
      throw new Error('Recurso no encontrado');
    }

    // Eliminar el recurso
    await this.recursoRepository.delete(recurso_id);
  }
}
