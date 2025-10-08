import { Usuario } from './Usuario';
import { Invitacion } from './Invitacion';
import { EstadoInvitacion } from './EstadoInvitacion';

export class InvitacionUsuario {
    private destinatario: Usuario;
    private invitacion: Invitacion;
    private confirmacion: boolean;
    private estado: EstadoInvitacion;

    constructor(destinatario: Usuario, invitacion: Invitacion) {
        this.destinatario = destinatario;
        this.invitacion = invitacion;
        this.confirmacion = false;
        this.estado = EstadoInvitacion.PENDIENTE;
    }

    public getDestinatario(): Usuario {
        return this.destinatario;
    }

    public setDestinatario(destinatario: Usuario): void {
        this.destinatario = destinatario;
    }

    public getInvitacion(): Invitacion {
        return this.invitacion;
    }

    public setInvitacion(invitacion: Invitacion): void {
        this.invitacion = invitacion;
    }

    public getConfirmacion(): boolean {
        return this.confirmacion;
    }

    public setConfirmacion(confirmacion: boolean): void {
        this.confirmacion = confirmacion;
    }

    public getEstado(): EstadoInvitacion {
        return this.estado;
    }

    public setEstado(estado: EstadoInvitacion): void {
        this.estado = estado;
    }
}