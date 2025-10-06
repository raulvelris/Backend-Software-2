"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioEnvioInvitacion = void 0;
const TipoEvento_1 = require("./TipoEvento");
const NotificacionFabrica_1 = require("./NotificacionFabrica");
const InvitacionUsuario_1 = require("./InvitacionUsuario");
class ServicioEnvioInvitacion {
    invitarParticipante(eventoOrigen, destinatario) {
        // Validar que el evento sea privado
        if (eventoOrigen.getTipo() !== TipoEvento_1.TipoEvento.PRIVADO) {
            console.log("Solo se pueden enviar invitaciones para eventos privados.");
            return;
        }
        // Llama a la fábrica para crear la notificación
        const invitacion = NotificacionFabrica_1.NotificacionFabrica.crearNotificacion(new Date(), // fecha y hora actual
        eventoOrigen, eventoOrigen.verInvitados()[0], // siempre el primero es el emisor, se usa "!" para indicar que no es null
        "INVITACION"); // casteo a Invitacion
        // Enviar la notificación
        const invitacionUsuario = new InvitacionUsuario_1.InvitacionUsuario(destinatario, invitacion);
        destinatario.agregarInvitacion(invitacionUsuario);
    }
}
exports.ServicioEnvioInvitacion = ServicioEnvioInvitacion;
//# sourceMappingURL=ServicioEnvioInvitacion.js.map