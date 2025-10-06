import { Notificacion } from './Notificacion';
import { Evento } from './Evento';
import { Participante } from './Participante';

export abstract class NotificacionFabrica {
    constructor() {}

    public abstract MetodoFabrica(
        fechaHora: Date,
        eventoOrigen: Evento,
        emisor: Participante
    ): Notificacion;

    public static crearNotificacion(
        fechaHora: Date,
        eventoOrigen: Evento,
        emisor: Participante,
        tipo: string
    ): Notificacion | null {
        let notificacion: Notificacion | null = null;

        if (tipo === "INVITACION") {

        // Lazy import para romper la dependencia circular
        const { InvitacionFabrica } = require('./InvitacionFabrica');
        
        notificacion = new InvitacionFabrica().MetodoFabrica(fechaHora, eventoOrigen, emisor);
        }

        return notificacion;
    }
}