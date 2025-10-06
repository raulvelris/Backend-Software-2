"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evento = void 0;
class Evento {
    titulo;
    tipo;
    participaciones;
    // Constructor
    constructor(titulo, tipo) {
        this.titulo = titulo;
        this.tipo = tipo;
        this.participaciones = []; // lista vacía al crear
    }
    // Getters y setters
    getTitulo() {
        return this.titulo;
    }
    setTitulo(titulo) {
        this.titulo = titulo;
    }
    getTipo() {
        return this.tipo;
    }
    setTipo(tipo) {
        this.tipo = tipo;
    }
    // Agregar participante
    agregarParticipante(participante) {
        this.participaciones.push(participante);
    }
    // Ver invitados (retorna la lista de participantes)
    verInvitados() {
        return this.participaciones;
    }
}
exports.Evento = Evento;
//# sourceMappingURL=Evento.js.map