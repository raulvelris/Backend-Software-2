import { IInvitacionRepository } from '../../../domain/interfaces/IInvitacionRepository';
import { LIMITE_INVITACIONES_PENDIENTES } from '../../../domain/value-objects/Constantes';

export class CountInvitacionesPendientesUseCase {
  constructor(private invitacionRepository: IInvitacionRepository) {}

  async execute(eventoId: number): Promise<{ pendientes: number; limite: number }> {
    if (!eventoId) {
      throw new Error('evento_id es requerido');
    }

    const pendientes = await this.invitacionRepository.countPendientesByEvento(eventoId);
    
    return {
      pendientes,
      limite: LIMITE_INVITACIONES_PENDIENTES
    };
  }
}
