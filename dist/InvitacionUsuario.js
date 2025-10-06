"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitacionUsuario = void 0;
const EstadoInvitacion_1 = require("./EstadoInvitacion");
class InvitacionUsuario {
    destinatario;
    invitacion;
    confirmacion;
    estado;
    constructor(destinatario, invitacion) {
        this.destinatario = destinatario;
        this.invitacion = invitacion;
        this.confirmacion = false;
        this.estado = EstadoInvitacion_1.EstadoInvitacion.PENDIENTE;
    }
    getDestinatario() {
        return this.destinatario;
    }
    setDestinatario(destinatario) {
        this.destinatario = destinatario;
    }
    getInvitacion() {
        return this.invitacion;
    }
    setInvitacion(invitacion) {
        this.invitacion = invitacion;
    }
    getConfirmacion() {
        return this.confirmacion;
    }
    setConfirmacion(confirmacion) {
        this.confirmacion = confirmacion;
    }
    getEstado() {
        return this.estado;
    }
    setEstado(estado) {
        this.estado = estado;
    }
}
exports.InvitacionUsuario = InvitacionUsuario;
//# sourceMappingURL=InvitacionUsuario.js.map