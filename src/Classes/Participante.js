"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participante = void 0;
var Participante = /** @class */ (function () {
    // Constructor
    function Participante(usuario, rol, evento) {
        this.usuario = usuario;
        this.rol = rol;
        this.evento = evento;
    }
    // Getters y setters
    Participante.prototype.getUsuario = function () {
        return this.usuario;
    };
    Participante.prototype.setUsuario = function (usuario) {
        this.usuario = usuario;
    };
    Participante.prototype.getRol = function () {
        return this.rol;
    };
    Participante.prototype.setRol = function (rol) {
        this.rol = rol;
    };
    Participante.prototype.getEvento = function () {
        return this.evento;
    };
    Participante.prototype.setEvento = function (evento) {
        this.evento = evento;
    };
    return Participante;
}());
exports.Participante = Participante;
