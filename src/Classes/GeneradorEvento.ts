import { Usuario } from './Usuario';
import { Evento } from './Evento';
import { Participante } from './Participante';
import { RolUsuario } from './RolUsuario';
import { ServicioEventoPublico } from './ServicioEventoPublico';
import { EstadoEvento } from './EstadoEvento';
import { Privacidad } from './Privacidad';
import { Ubicacion } from './Ubicacion';

export class GeneradorEvento {

    public crearEvento(
        usuario: Usuario,
        titulo: string,
        descripcion: string,
        fechaHora: Date,
        imagen: string,
        maxNroParticipantes: number,
        estado: EstadoEvento,
        privacidad: Privacidad,
        ubicacion: Ubicacion,   
        servicioPublico: ServicioEventoPublico
    ): Evento {
        const evento = new Evento(titulo, descripcion, fechaHora, imagen, maxNroParticipantes, estado, privacidad, ubicacion);

        // Crear participante con rol ORGANIZADOR
        const participante = new Participante(usuario, RolUsuario.ORGANIZADOR, evento);

        // Agregar participación al usuario y al evento
        usuario.agregarParticipacion(participante);
        evento.agregarParticipante(participante);

        // Si el evento es público, agregarlo al servicio de eventos públicos
        if (privacidad === Privacidad.PUBLICO) {
        servicioPublico.agregarEvento(evento);
        }

        return evento;
    }
}