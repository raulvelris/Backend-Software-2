import { Notificacion } from './Notificacion';
import { Evento } from './Evento';
import { Participante } from './Participante';
export declare class Invitacion extends Notificacion {
    constructor(fechaHora: Date, eventoOrigen: Evento, emisor: Participante);
    verDetalle(): void;
}
//# sourceMappingURL=Invitacion.d.ts.map