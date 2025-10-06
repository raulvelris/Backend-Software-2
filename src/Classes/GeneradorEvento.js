"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneradorEvento = void 0;
var Evento_1 = require("./Evento");
var TipoEvento_1 = require("./TipoEvento");
var Participante_1 = require("./Participante");
var RolUsuario_1 = require("./RolUsuario");
var GeneradorEvento = /** @class */ (function () {
    function GeneradorEvento() {
    }
    GeneradorEvento.prototype.crearEvento = function (usuario, titulo, tipo, servicioPublico) {
        var evento = new Evento_1.Evento(titulo, tipo);
        // Crear participante con rol ORGANIZADOR
        var participante = new Participante_1.Participante(usuario, RolUsuario_1.RolUsuario.ORGANIZADOR, evento);
        // Agregar participación al usuario y al evento
        usuario.agregarParticipacion(participante);
        evento.agregarParticipante(participante);
        // Si el evento es público, agregarlo al servicio de eventos públicos
        if (tipo === TipoEvento_1.TipoEvento.PUBLICO) {
            servicioPublico.agregarEvento(evento);
        }
        return evento;
    };
    return GeneradorEvento;
}());
exports.GeneradorEvento = GeneradorEvento;
