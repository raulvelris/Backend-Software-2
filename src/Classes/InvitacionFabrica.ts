import { NotificacionFabrica } from './NotificacionFabrica';
import { Notificacion } from './Notificacion';
import { Invitacion } from './Invitacion';
import { Evento } from './Evento';

export class InvitacionFabrica extends NotificacionFabrica {
    // Metodo sobreescrito
    public MetodoFabrica(fechaHora: Date, eventoOrigen: Evento, fechaLimite?: Date): Notificacion {
        return new Invitacion(fechaHora, eventoOrigen, fechaLimite);
    }
}