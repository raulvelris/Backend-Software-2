"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestorInvitaciones = void 0;
var GestorInvitaciones = /** @class */ (function () {
    function GestorInvitaciones() {
    }
    GestorInvitaciones.prototype.verInvitaciones = function (usuario) {
        return usuario.getInvitaciones();
    };
    return GestorInvitaciones;
}());
exports.GestorInvitaciones = GestorInvitaciones;
