import { Evento } from './Evento';
import { Usuario } from './Usuario';
import { RolUsuario } from './RolUsuario';

export class ServicioVisualizacion {

    private filtrarEventosPorRol(usuario: Usuario, rol: RolUsuario): Evento[] {
        return usuario.getParticipaciones()
            .filter(p => p.getRol() === rol)
            .map(p => p.getEvento());
    }

    public verEventosAsistidos(usuario: Usuario): Evento[] {
        return this.filtrarEventosPorRol(usuario, RolUsuario.ASISTENTE);
    }

    public verEventosCreados(usuario: Usuario): Evento[] {
        return this.filtrarEventosPorRol(usuario, RolUsuario.ORGANIZADOR);
    }
    
}
