import { NotificacionFabrica } from './NotificacionFabrica';
import { Notificacion } from './Notificacion';
import { Invitacion } from './Invitacion';
import { Evento } from './Evento';
import { Participante } from './Participante';

export class InvitacionFabrica extends NotificacionFabrica {
    // Metodo sobreescrito
    public MetodoFabrica(fechaHora: Date, eventoOrigen: Evento, emisor: Participante): Notificacion {
        return new Invitacion(fechaHora, eventoOrigen, emisor);
    }
}