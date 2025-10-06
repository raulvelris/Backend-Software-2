"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notificacion = void 0;
var Notificacion = /** @class */ (function () {
    function Notificacion(fechaHora, eventoOrigen, emisor) {
        this.fechaHora = fechaHora;
        this.eventoOrigen = eventoOrigen;
        this.emisor = emisor;
    }
    Notificacion.prototype.getFechaHora = function () {
        return this.fechaHora;
    };
    Notificacion.prototype.getEventoOrigen = function () {
        return this.eventoOrigen;
    };
    Notificacion.prototype.getEmisor = function () {
        return this.emisor;
    };
    return Notificacion;
}());
exports.Notificacion = Notificacion;
