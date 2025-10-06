"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioVisualizacion = void 0;
const RolUsuario_1 = require("./RolUsuario");
class ServicioVisualizacion {
    filtrarEventosPorRol(usuario, rol) {
        return usuario.getParticipaciones()
            .filter(p => p.getRol() === rol)
            .map(p => p.getEvento());
    }
    verEventosAsistidos(usuario) {
        return this.filtrarEventosPorRol(usuario, RolUsuario_1.RolUsuario.ASISTENTE);
    }
    verEventosCreados(usuario) {
        return this.filtrarEventosPorRol(usuario, RolUsuario_1.RolUsuario.ORGANIZADOR);
    }
}
exports.ServicioVisualizacion = ServicioVisualizacion;
//# sourceMappingURL=ServicioVisualizacion.js.map