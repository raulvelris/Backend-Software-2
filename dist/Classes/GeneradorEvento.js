"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneradorEvento = void 0;
const Evento_1 = require("./Evento");
const TipoEvento_1 = require("./TipoEvento");
const Participante_1 = require("./Participante");
const RolUsuario_1 = require("./RolUsuario");
class GeneradorEvento {
    crearEvento(usuario, titulo, tipo, servicioPublico) {
        const evento = new Evento_1.Evento(titulo, tipo);
        // Crear participante con rol ORGANIZADOR
        const participante = new Participante_1.Participante(usuario, RolUsuario_1.RolUsuario.ORGANIZADOR, evento);
        // Agregar participación al usuario y al evento
        usuario.agregarParticipacion(participante);
        evento.agregarParticipante(participante);
        // Si el evento es público, agregarlo al servicio de eventos públicos
        if (tipo === TipoEvento_1.TipoEvento.PUBLICO) {
            servicioPublico.agregarEvento(evento);
        }
        return evento;
    }
}
exports.GeneradorEvento = GeneradorEvento;
//# sourceMappingURL=GeneradorEvento.js.map