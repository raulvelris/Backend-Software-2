"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioVisualizacion = void 0;
var RolUsuario_1 = require("./RolUsuario");
var ServicioVisualizacion = /** @class */ (function () {
    function ServicioVisualizacion() {
    }
    ServicioVisualizacion.prototype.filtrarEventosPorRol = function (usuario, rol) {
        return usuario.getParticipaciones()
            .filter(function (p) { return p.getRol() === rol; })
            .map(function (p) { return p.getEvento(); });
    };
    ServicioVisualizacion.prototype.verEventosAsistidos = function (usuario) {
        return this.filtrarEventosPorRol(usuario, RolUsuario_1.RolUsuario.ASISTENTE);
    };
    ServicioVisualizacion.prototype.verEventosCreados = function (usuario) {
        return this.filtrarEventosPorRol(usuario, RolUsuario_1.RolUsuario.ORGANIZADOR);
    };
    return ServicioVisualizacion;
}());
exports.ServicioVisualizacion = ServicioVisualizacion;
