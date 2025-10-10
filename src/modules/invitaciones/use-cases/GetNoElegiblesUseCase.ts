import { IInvitacionRepository } from '../../../domain/interfaces/IInvitacionRepository';

export class GetNoElegiblesUseCase {
  constructor(private invitacionRepository: IInvitacionRepository) {}

  async execute(eventoId: number): Promise<any[]> {
    if (!eventoId) {
      throw new Error('evento_id es requerido');
    }

    const noElegibles = await this.invitacionRepository.findNoElegiblesByEvento(eventoId);
    return noElegibles;
  }
}
