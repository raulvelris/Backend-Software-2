import { Usuario } from './Usuario';
import { Invitacion } from './Invitacion';
import { EstadoInvitacion } from './EstadoInvitacion';
export declare class InvitacionUsuario {
    private destinatario;
    private invitacion;
    private confirmacion;
    private estado;
    constructor(destinatario: Usuario, invitacion: Invitacion);
    getDestinatario(): Usuario;
    setDestinatario(destinatario: Usuario): void;
    getInvitacion(): Invitacion;
    setInvitacion(invitacion: Invitacion): void;
    getConfirmacion(): boolean;
    setConfirmacion(confirmacion: boolean): void;
    getEstado(): EstadoInvitacion;
    setEstado(estado: EstadoInvitacion): void;
}
//# sourceMappingURL=InvitacionUsuario.d.ts.map