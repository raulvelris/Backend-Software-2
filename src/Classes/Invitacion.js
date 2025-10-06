"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invitacion = void 0;
var Notificacion_1 = require("./Notificacion");
var Invitacion = /** @class */ (function (_super) {
    __extends(Invitacion, _super);
    function Invitacion(fechaHora, eventoOrigen, emisor) {
        return _super.call(this, fechaHora, eventoOrigen, emisor) || this; // llama al constructor de Notificacion
    }
    // Metodo sobreescrito
    Invitacion.prototype.verDetalle = function () {
        // Método vacío
    };
    return Invitacion;
}(Notificacion_1.Notificacion));
exports.Invitacion = Invitacion;
