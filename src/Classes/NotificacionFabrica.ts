import { Notificacion } from './Notificacion';
import { Evento } from './Evento';

export abstract class NotificacionFabrica {
    constructor() {}

    public abstract MetodoFabrica(
        fechaHora: Date,
        eventoOrigen: Evento,
        fechaLimite?: Date
    ): Notificacion;

    public static async crearNotificacion(  // ciclico
        fechaHora: Date,
        eventoOrigen: Evento,
        tipo: string,
        fechaLimite?: Date // opcional
    ): Promise<Notificacion | null> {
        let notificacion: Notificacion | null = null;

        if (tipo === "INVITACION") {
            const { InvitacionFabrica } = await import('./InvitacionFabrica');
            notificacion = new InvitacionFabrica().MetodoFabrica(fechaHora, eventoOrigen, fechaLimite);
        }

        return notificacion;
    }
}