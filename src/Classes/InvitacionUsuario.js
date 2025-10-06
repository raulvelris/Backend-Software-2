"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitacionUsuario = void 0;
var EstadoInvitacion_1 = require("./EstadoInvitacion");
var InvitacionUsuario = /** @class */ (function () {
    function InvitacionUsuario(destinatario, invitacion) {
        this.destinatario = destinatario;
        this.invitacion = invitacion;
        this.confirmacion = false;
        this.estado = EstadoInvitacion_1.EstadoInvitacion.PENDIENTE;
    }
    InvitacionUsuario.prototype.getDestinatario = function () {
        return this.destinatario;
    };
    InvitacionUsuario.prototype.setDestinatario = function (destinatario) {
        this.destinatario = destinatario;
    };
    InvitacionUsuario.prototype.getInvitacion = function () {
        return this.invitacion;
    };
    InvitacionUsuario.prototype.setInvitacion = function (invitacion) {
        this.invitacion = invitacion;
    };
    InvitacionUsuario.prototype.getConfirmacion = function () {
        return this.confirmacion;
    };
    InvitacionUsuario.prototype.setConfirmacion = function (confirmacion) {
        this.confirmacion = confirmacion;
    };
    InvitacionUsuario.prototype.getEstado = function () {
        return this.estado;
    };
    InvitacionUsuario.prototype.setEstado = function (estado) {
        this.estado = estado;
    };
    return InvitacionUsuario;
}());
exports.InvitacionUsuario = InvitacionUsuario;
