import { Usuario } from './Usuario';
import { RolUsuario } from './RolUsuario';
import { Evento } from './Evento';
export declare class Participante {
    private usuario;
    private rol;
    private evento;
    constructor(usuario: Usuario, rol: RolUsuario, evento: Evento);
    getUsuario(): Usuario;
    setUsuario(usuario: Usuario): void;
    getRol(): RolUsuario;
    setRol(rol: RolUsuario): void;
    getEvento(): Evento;
    setEvento(evento: Evento): void;
}
//# sourceMappingURL=Participante.d.ts.map