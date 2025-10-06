"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Participante = void 0;
class Participante {
    usuario;
    rol;
    evento;
    // Constructor
    constructor(usuario, rol, evento) {
        this.usuario = usuario;
        this.rol = rol;
        this.evento = evento;
    }
    // Getters y setters
    getUsuario() {
        return this.usuario;
    }
    setUsuario(usuario) {
        this.usuario = usuario;
    }
    getRol() {
        return this.rol;
    }
    setRol(rol) {
        this.rol = rol;
    }
    getEvento() {
        return this.evento;
    }
    setEvento(evento) {
        this.evento = evento;
    }
}
exports.Participante = Participante;
//# sourceMappingURL=Participante.js.map