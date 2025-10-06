"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitacionFabrica = void 0;
const NotificacionFabrica_1 = require("./NotificacionFabrica");
const Invitacion_1 = require("./Invitacion");
class InvitacionFabrica extends NotificacionFabrica_1.NotificacionFabrica {
    // Metodo sobreescrito
    MetodoFabrica(fechaHora, eventoOrigen, emisor) {
        return new Invitacion_1.Invitacion(fechaHora, eventoOrigen, emisor);
    }
}
exports.InvitacionFabrica = InvitacionFabrica;
//# sourceMappingURL=InvitacionFabrica.js.map