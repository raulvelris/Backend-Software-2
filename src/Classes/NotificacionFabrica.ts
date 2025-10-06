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

    public static async crearNotificacion(  // ciclico
        fechaHora: Date,
        eventoOrigen: Evento,
        emisor: Participante,
        tipo: string
    ): Promise<Notificacion | null> {
        let notificacion: Notificacion | null = null;

        if (tipo === "INVITACION") {
            const { InvitacionFabrica } = await import('./InvitacionFabrica');
            notificacion = new InvitacionFabrica().MetodoFabrica(fechaHora, eventoOrigen, emisor);
        }

        return notificacion;
    }
}