"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionFabrica = void 0;
class NotificacionFabrica {
    constructor() { }
    static crearNotificacion(fechaHora, eventoOrigen, emisor, tipo) {
        let notificacion = null;
        if (tipo === "INVITACION") {
            // Lazy import para romper la dependencia circular
            const { InvitacionFabrica } = require('./InvitacionFabrica');
            notificacion = new InvitacionFabrica().MetodoFabrica(fechaHora, eventoOrigen, emisor);
        }
        return notificacion;
    }
}
exports.NotificacionFabrica = NotificacionFabrica;
//# sourceMappingURL=NotificacionFabrica.js.map