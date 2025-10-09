import { Usuario } from './Usuario';
import { Evento } from './Evento';
import { TipoEvento } from './TipoEvento';
import { Participante } from './Participante';
import { RolUsuario } from './RolUsuario';
import { ServicioEventoPublico } from './ServicioEventoPublico';

export class GeneradorEvento {

    public crearEvento(
        usuario: Usuario,
        titulo: string,
        tipo: TipoEvento,
        servicioPublico: ServicioEventoPublico
    ): Evento {
        const evento = new Evento(titulo, tipo);

        // Crear participante con rol ORGANIZADOR
        const participante = new Participante(usuario, RolUsuario.ORGANIZADOR, evento);

        // Agregar participación al usuario y al evento
        usuario.agregarParticipacion(participante);
        evento.agregarParticipante(participante);

        // Si el evento es público, agregarlo al servicio de eventos públicos
        if (tipo === TipoEvento.PUBLICO) {
        servicioPublico.agregarEvento(evento);
        }

        return evento;
    }
}