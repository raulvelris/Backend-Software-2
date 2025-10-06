import { TipoEvento } from './TipoEvento';
import { Participante } from './Participante';
export declare class Evento {
    private titulo;
    private tipo;
    private participaciones;
    constructor(titulo: string, tipo: TipoEvento);
    getTitulo(): string;
    setTitulo(titulo: string): void;
    getTipo(): TipoEvento;
    setTipo(tipo: TipoEvento): void;
    agregarParticipante(participante: Participante): void;
    verInvitados(): Participante[];
}
//# sourceMappingURL=Evento.d.ts.map