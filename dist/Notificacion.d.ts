import { Evento } from './Evento';
import { Participante } from './Participante';
export declare abstract class Notificacion {
    protected fechaHora: Date;
    protected eventoOrigen: Evento;
    protected emisor: Participante;
    constructor(fechaHora: Date, eventoOrigen: Evento, emisor: Participante);
    getFechaHora(): Date;
    getEventoOrigen(): Evento;
    getEmisor(): Participante;
    abstract verDetalle(): void;
}
//# sourceMappingURL=Notificacion.d.ts.map