import { InvitacionUsuario } from './InvitacionUsuario';
import { Participante } from './Participante';
export declare class Usuario {
    private clave;
    private correo;
    private invitaciones;
    private participaciones;
    constructor(correo: string, clave: string);
    getClave(): string;
    setClave(clave: string): void;
    getCorreo(): string;
    setCorreo(correo: string): void;
    getParticipaciones(): Participante[];
    agregarParticipacion(participante: Participante): void;
    getInvitaciones(): InvitacionUsuario[];
    agregarInvitacion(invitacion: InvitacionUsuario): void;
}
//# sourceMappingURL=Usuario.d.ts.map