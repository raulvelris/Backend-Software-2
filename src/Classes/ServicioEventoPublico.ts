import { Evento } from './Evento';
import { Usuario } from './Usuario';
import { Participante } from './Participante';
import { RolUsuario } from './RolUsuario';

export class ServicioEventoPublico {
    private eventosPublicos: Evento[];

    constructor() {
        this.eventosPublicos = [];
    }

    public agregarEvento(evento: Evento): void {
        this.eventosPublicos.push(evento);
    }

    // Listar todos los eventos publicos
    public getEventos(): Evento[] {
        return this.eventosPublicos;
    }

    public confirmarAsistenciaPublica(evento: Evento, usuario: Usuario): void {
        // Crear un nuevo participante con rol ASISTENTE
        const participante = new Participante(usuario, RolUsuario.ASISTENTE, evento);

        // Agregar al evento y al usuario
        evento.agregarParticipante(participante);
        usuario.agregarParticipacion(participante);
    }
}
