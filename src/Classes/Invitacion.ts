import { Notificacion } from './Notificacion';
import { Evento } from './Evento';

export class Invitacion extends Notificacion {
    public fechaLimite: Date; // atributo extra

    constructor(fechaHora: Date, eventoOrigen: Evento, fechaLimite?: Date) {
        super(fechaHora, eventoOrigen); // llama al constructor de Notificacion
        this.fechaLimite = fechaLimite || new Date(Date.now() + 7*24*60*60*1000);
    }

    // Getter
    public getFechaLimite(): Date {
        return this.fechaLimite;
    }
    
    // Metodo sobreescrito
    public verDetalle(): void {
        // Método vacío
    }
}
