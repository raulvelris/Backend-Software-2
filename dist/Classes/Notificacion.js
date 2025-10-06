"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notificacion = void 0;
class Notificacion {
    fechaHora;
    eventoOrigen;
    emisor;
    constructor(fechaHora, eventoOrigen, emisor) {
        this.fechaHora = fechaHora;
        this.eventoOrigen = eventoOrigen;
        this.emisor = emisor;
    }
    getFechaHora() {
        return this.fechaHora;
    }
    getEventoOrigen() {
        return this.eventoOrigen;
    }
    getEmisor() {
        return this.emisor;
    }
}
exports.Notificacion = Notificacion;
//# sourceMappingURL=Notificacion.js.map