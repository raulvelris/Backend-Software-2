import { InvitacionUsuario } from './InvitacionUsuario';
import { Participante } from './Participante';
import { Cliente } from './Cliente';

export class Usuario {
    private clave: string;
    private correo: string;
    private estaActivo: boolean;
    private perfil: Cliente | null;
    private invitaciones: InvitacionUsuario[];
    private participaciones: Participante[];

    constructor(correo: string, clave: string) {
        this.correo = correo;
        this.clave = clave;
        this.estaActivo = false; // por defecto inactivo hasta activación
        this.perfil = null; // se asigna luego
        this.invitaciones = [];
        this.participaciones = [];
    }

    // Getters y setters
    public getClave(): string {
        return this.clave;
    }

    public setClave(clave: string): void {
        this.clave = clave;
    }

    public getCorreo(): string {
        return this.correo;
    }

    public setCorreo(correo: string): void {
        this.correo = correo;
    }

    public getEstaActivo(): boolean {
        return this.estaActivo;
    }

    public setEstaActivo(estaActivo: boolean): void {
        this.estaActivo = estaActivo;
    }

    public getPerfil(): Cliente | null {
        return this.perfil;
    }

    public setPerfil(perfil: Cliente | null): void {
        this.perfil = perfil;
    }

    public getParticipaciones(): Participante[] {
        return this.participaciones;
    }

    // Método para agregar una participación
    public agregarParticipacion(participante: Participante): void {
        this.participaciones.push(participante);
    }

    public getInvitaciones(): InvitacionUsuario[] {
        return this.invitaciones;
    }

    // Método para agregar una invitación
    public agregarInvitacion(invitacion: InvitacionUsuario): void {
        this.invitaciones.push(invitacion);
    }
}