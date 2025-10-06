"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evento = void 0;
var Evento = /** @class */ (function () {
    // Constructor
    function Evento(titulo, tipo) {
        this.titulo = titulo;
        this.tipo = tipo;
        this.participaciones = []; // lista vacía al crear
    }
    // Getters y setters
    Evento.prototype.getTitulo = function () {
        return this.titulo;
    };
    Evento.prototype.setTitulo = function (titulo) {
        this.titulo = titulo;
    };
    Evento.prototype.getTipo = function () {
        return this.tipo;
    };
    Evento.prototype.setTipo = function (tipo) {
        this.tipo = tipo;
    };
    // Agregar participante
    Evento.prototype.agregarParticipante = function (participante) {
        this.participaciones.push(participante);
    };
    // Ver invitados (retorna la lista de participantes)
    Evento.prototype.verInvitados = function () {
        return this.participaciones;
    };
    return Evento;
}());
exports.Evento = Evento;
