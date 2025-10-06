import { Evento } from './Evento';
import { Usuario } from './Usuario';
import { TipoEvento } from './TipoEvento';
import { NotificacionFabrica } from './NotificacionFabrica';
import { Invitacion } from './Invitacion';
import { InvitacionUsuario } from './InvitacionUsuario';

export class ServicioEnvioInvitacion {
    public invitarParticipante(eventoOrigen: Evento, destinatario: Usuario): void {
        // Validar que el evento sea privado
        if (eventoOrigen.getTipo() !== TipoEvento.PRIVADO) {
        console.log("Solo se pueden enviar invitaciones para eventos privados.");
        return;
        }

        // Llama a la fábrica para crear la notificación
        const invitacion = NotificacionFabrica.crearNotificacion(
        new Date(), // fecha y hora actual
        eventoOrigen,
        eventoOrigen.verInvitados()[0]!, // siempre el primero es el emisor, se usa "!" para indicar que no es null
        "INVITACION"
        ) as Invitacion; // casteo a Invitacion

        // Enviar la notificación
        const invitacionUsuario = new InvitacionUsuario(destinatario, invitacion);

        destinatario.agregarInvitacion(invitacionUsuario);
    }
}
