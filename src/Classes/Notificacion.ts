import { Evento } from './Evento';
import { Participante } from './Participante';

export abstract class Notificacion {
    protected fechaHora: Date;
    protected eventoOrigen: Evento;
    protected emisor: Participante;

    constructor(fechaHora: Date, eventoOrigen: Evento, emisor: Participante) {
        this.fechaHora = fechaHora;
        this.eventoOrigen = eventoOrigen;
        this.emisor = emisor;
    }

    public getFechaHora(): Date {
        return this.fechaHora;
    }

    public getEventoOrigen(): Evento {
        return this.eventoOrigen;
    }

    public getEmisor(): Participante {
        return this.emisor;
    }

    public abstract verDetalle(): void;
}