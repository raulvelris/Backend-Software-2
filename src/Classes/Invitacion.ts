import { Notificacion } from './Notificacion';
import { Evento } from './Evento';
import { Participante } from './Participante';

export class Invitacion extends Notificacion {
    constructor(fechaHora: Date, eventoOrigen: Evento, emisor: Participante) {
        super(fechaHora, eventoOrigen, emisor); // llama al constructor de Notificacion
    }

    // Metodo sobreescrito
    public verDetalle(): void {
        // Método vacío
    }
}
