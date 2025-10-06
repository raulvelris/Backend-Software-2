"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
var Usuario = /** @class */ (function () {
    function Usuario(correo, clave) {
        this.correo = correo;
        this.clave = clave;
        // this.estaActivo = false; // por defecto activo
        // this.invitaciones = [];
        // this.perfil = null; // se asigna luego
        this.invitaciones = [];
        this.participaciones = [];
    }
    Usuario.prototype.getClave = function () {
        return this.clave;
    };
    Usuario.prototype.setClave = function (clave) {
        this.clave = clave;
    };
    Usuario.prototype.getCorreo = function () {
        return this.correo;
    };
    Usuario.prototype.setCorreo = function (correo) {
        this.correo = correo;
    };
    Usuario.prototype.getParticipaciones = function () {
        return this.participaciones; // devolvemos copia para no exponer la lista interna
    };
    // Método para agregar una participación
    Usuario.prototype.agregarParticipacion = function (participante) {
        this.participaciones.push(participante);
    };
    Usuario.prototype.getInvitaciones = function () {
        return this.invitaciones;
    };
    // Método para agregar una invitación
    Usuario.prototype.agregarInvitacion = function (invitacion) {
        this.invitaciones.push(invitacion);
    };
    return Usuario;
}());
exports.Usuario = Usuario;
