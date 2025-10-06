"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioEventoPublico = void 0;
var Participante_1 = require("./Participante");
var RolUsuario_1 = require("./RolUsuario");
var ServicioEventoPublico = /** @class */ (function () {
    function ServicioEventoPublico() {
        this.eventosPublicos = [];
    }
    ServicioEventoPublico.prototype.agregarEvento = function (evento) {
        this.eventosPublicos.push(evento);
    };
    // Listar todos los eventos publicos
    ServicioEventoPublico.prototype.getEventos = function () {
        return this.eventosPublicos;
    };
    ServicioEventoPublico.prototype.confirmarAsistenciaPublica = function (evento, usuario) {
        // Crear un nuevo participante con rol ASISTENTE
        var participante = new Participante_1.Participante(usuario, RolUsuario_1.RolUsuario.ASISTENTE, evento);
        // Agregar al evento y al usuario
        evento.agregarParticipante(participante);
        usuario.agregarParticipacion(participante);
    };
    return ServicioEventoPublico;
}());
exports.ServicioEventoPublico = ServicioEventoPublico;
