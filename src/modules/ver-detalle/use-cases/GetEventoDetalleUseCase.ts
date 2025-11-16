import { IParticipanteRepository } from "../../../domain/interfaces/IParticipanteRepository";
import { IEventoRepository } from "../../../domain/interfaces/IEventoRepository";

export class GetEventoDetalleUseCase {
  constructor(
    private eventoRepository: IEventoRepository,
    private participanteRepository: IParticipanteRepository,
  ) {}

  async execute(eventoId: number): Promise<any> {
    if (!eventoId || Number.isNaN(eventoId)) {
      throw new Error('Invalid event id');
    }

    const evento = await this.eventoRepository.findById(eventoId);
    if (!evento) {
      throw new Error('Event not found');
    }

    const attendeesCount = await this.participanteRepository.countAttendees(eventoId);
    const plain = typeof evento.toJSON === 'function' ? evento.toJSON() : evento;
    return { ...plain, attendeesCount };
  }
}
