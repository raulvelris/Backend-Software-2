import { Evento } from './Evento';
import { Usuario } from './Usuario';
export declare class ServicioEventoPublico {
    private eventosPublicos;
    constructor();
    agregarEvento(evento: Evento): void;
    getEventos(): Evento[];
    confirmarAsistenciaPublica(evento: Evento, usuario: Usuario): void;
}
//# sourceMappingURL=ServicioEventoPublico.d.ts.map