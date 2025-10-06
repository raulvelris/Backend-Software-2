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
exports.InvitacionFabrica = void 0;
var NotificacionFabrica_1 = require("./NotificacionFabrica");
var Invitacion_1 = require("./Invitacion");
var InvitacionFabrica = /** @class */ (function (_super) {
    __extends(InvitacionFabrica, _super);
    function InvitacionFabrica() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Metodo sobreescrito
    InvitacionFabrica.prototype.MetodoFabrica = function (fechaHora, eventoOrigen, emisor) {
        return new Invitacion_1.Invitacion(fechaHora, eventoOrigen, emisor);
    };
    return InvitacionFabrica;
}(NotificacionFabrica_1.NotificacionFabrica));
exports.InvitacionFabrica = InvitacionFabrica;
