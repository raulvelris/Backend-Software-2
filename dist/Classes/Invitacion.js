"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invitacion = void 0;
const Notificacion_1 = require("./Notificacion");
class Invitacion extends Notificacion_1.Notificacion {
    constructor(fechaHora, eventoOrigen, emisor) {
        super(fechaHora, eventoOrigen, emisor); // llama al constructor de Notificacion
    }
    // Metodo sobreescrito
    verDetalle() {
        // Método vacío
    }
}
exports.Invitacion = Invitacion;
//# sourceMappingURL=Invitacion.js.map