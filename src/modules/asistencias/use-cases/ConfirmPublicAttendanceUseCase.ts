import { EventoRepository } from '../../../infrastructure/repositories/EventoRepository';
import { EventoParticipanteRepository } from '../../../infrastructure/repositories/EventoParticipanteRepository';

export class ConfirmPublicAttendanceUseCase {
  constructor(
    private readonly eventoRepository: EventoRepository,
    private readonly eventoParticipanteRepository: EventoParticipanteRepository,
  ) {}

  async execute(input: { evento_id: number; usuario_id: number }): Promise<{ success: boolean }>{
    const { evento_id, usuario_id } = input;

    if (!evento_id || Number.isNaN(evento_id) || !usuario_id || Number.isNaN(usuario_id)) {
      throw new Error('Invalid input');
    }

    const evento = await this.eventoRepository.findById(evento_id);
    if (!evento) {
      throw new Error('Event not found');
    }

    // No permitir confirmar si el evento ya inició
    const now = new Date();
    const start = new Date(evento.fechaHora);
    if (!(start.getTime() > now.getTime())) {
      throw new Error('Event already started');
    }

    // Evitar duplicados
    const already = await this.eventoParticipanteRepository.isUsuarioInEvento(evento_id, usuario_id);
    if (already) {
      throw new Error('Already confirmed');
    }

    // Verificar capacidad
    const current = await this.eventoParticipanteRepository.countByEvento(evento_id);
    const capacity = typeof evento.aforo === 'number' ? evento.aforo : 0;
    if (current >= capacity) {
      throw new Error('Event is full');
    }

    await this.eventoParticipanteRepository.addByUsuario(evento_id, usuario_id);

    return { success: true };
  }
}
