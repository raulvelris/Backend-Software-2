import { TipoEvento } from './TipoEvento';
import { Participante } from './Participante';

export class Evento {
    private titulo: string;
    private tipo: TipoEvento;
    private participaciones: Participante[];

    // Constructor
    constructor(titulo: string, tipo: TipoEvento) {
      this.titulo = titulo;
      this.tipo = tipo;
      this.participaciones = []; // lista vacía al crear
    }

    // Getters y setters
    public getTitulo(): string {
      return this.titulo;
    }

    public setTitulo(titulo: string): void {
      this.titulo = titulo;
    }

    public getTipo(): TipoEvento {
      return this.tipo;
    }

    public setTipo(tipo: TipoEvento): void {
      this.tipo = tipo;
    }

    // Agregar participante
    public agregarParticipante(participante: Participante): void {
      this.participaciones.push(participante);
    }

    // Ver invitados (retorna la lista de participantes)
    public verInvitados(): Participante[] {
      return this.participaciones;
    }
}