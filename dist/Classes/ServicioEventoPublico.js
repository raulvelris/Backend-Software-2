"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioEventoPublico = void 0;
const Participante_1 = require("./Participante");
const RolUsuario_1 = require("./RolUsuario");
class ServicioEventoPublico {
    eventosPublicos;
    constructor() {
        this.eventosPublicos = [];
    }
    agregarEvento(evento) {
        this.eventosPublicos.push(evento);
    }
    // Listar todos los eventos publicos
    getEventos() {
        return this.eventosPublicos;
    }
    confirmarAsistenciaPublica(evento, usuario) {
        // Crear un nuevo participante con rol ASISTENTE
        const participante = new Participante_1.Participante(usuario, RolUsuario_1.RolUsuario.ASISTENTE, evento);
        // Agregar al evento y al usuario
        evento.agregarParticipante(participante);
        usuario.agregarParticipacion(participante);
    }
}
exports.ServicioEventoPublico = ServicioEventoPublico;
//# sourceMappingURL=ServicioEventoPublico.js.map