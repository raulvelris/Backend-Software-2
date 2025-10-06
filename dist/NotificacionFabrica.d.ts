import { Notificacion } from './Notificacion';
import { Evento } from './Evento';
import { Participante } from './Participante';
export declare abstract class NotificacionFabrica {
    constructor();
    abstract MetodoFabrica(fechaHora: Date, eventoOrigen: Evento, emisor: Participante): Notificacion;
    static crearNotificacion(// ciclico
    fechaHora: Date, eventoOrigen: Evento, emisor: Participante, tipo: string): Promise<Notificacion | null>;
}
//# sourceMappingURL=NotificacionFabrica.d.ts.map