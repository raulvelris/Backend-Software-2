"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
class Usuario {
    clave;
    correo;
    // private estaActivo: boolean;
    // private perfil: Cliente;
    invitaciones;
    participaciones;
    constructor(correo, clave) {
        this.correo = correo;
        this.clave = clave;
        // this.estaActivo = false; // por defecto activo
        // this.invitaciones = [];
        // this.perfil = null; // se asigna luego
        this.invitaciones = [];
        this.participaciones = [];
    }
    getClave() {
        return this.clave;
    }
    setClave(clave) {
        this.clave = clave;
    }
    getCorreo() {
        return this.correo;
    }
    setCorreo(correo) {
        this.correo = correo;
    }
    getParticipaciones() {
        return this.participaciones; // devolvemos copia para no exponer la lista interna
    }
    // Método para agregar una participación
    agregarParticipacion(participante) {
        this.participaciones.push(participante);
    }
    getInvitaciones() {
        return this.invitaciones;
    }
    // Método para agregar una invitación
    agregarInvitacion(invitacion) {
        this.invitaciones.push(invitacion);
    }
}
exports.Usuario = Usuario;
//# sourceMappingURL=Usuario.js.map