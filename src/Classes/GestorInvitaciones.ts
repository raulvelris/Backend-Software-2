import { Usuario } from './Usuario';
import { InvitacionUsuario } from './InvitacionUsuario';

export class GestorInvitaciones {
    
    public verInvitaciones(usuario: Usuario): InvitacionUsuario[] {
        return usuario.getInvitaciones();
    }
}