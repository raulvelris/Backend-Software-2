import { Evento } from './Evento';

export abstract class Notificacion {
    protected fechaHora: Date;
    protected eventoOrigen: Evento;

    constructor(fechaHora: Date, eventoOrigen: Evento) {
        this.fechaHora = fechaHora;
        this.eventoOrigen = eventoOrigen;
    }

    public getFechaHora(): Date {
        return this.fechaHora;
    }

    public getEventoOrigen(): Evento {
        return this.eventoOrigen;
    }

    public abstract verDetalle(): void;
}