import { Notificacion } from './Notificacion';
import { Evento } from './Evento';

export class Invitacion extends Notificacion {
    constructor(fechaHora: Date, eventoOrigen: Evento) {
        super(fechaHora, eventoOrigen); // llama al constructor de Notificacion
    }

    // Metodo sobreescrito
    public verDetalle(): void {
        // Método vacío
    }
}
