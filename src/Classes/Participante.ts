import { Usuario } from './Usuario';
import { RolUsuario } from './RolUsuario';
import { Evento } from './Evento';

export class Participante {
  private usuario: Usuario;
  private rol: RolUsuario;
  private evento: Evento;

  // Constructor
  constructor(usuario: Usuario, rol: RolUsuario, evento: Evento) {
    this.usuario = usuario;
    this.rol = rol;
    this.evento = evento;
  }

  // Getters y setters
  public getUsuario(): Usuario {
    return this.usuario;
  }

  public setUsuario(usuario: Usuario): void {
    this.usuario = usuario;
  }

  public getRol(): RolUsuario {
    return this.rol;
  }

  public setRol(rol: RolUsuario): void {
    this.rol = rol;
  }

  public getEvento(): Evento {
    return this.evento;
  }

  public setEvento(evento: Evento): void {
    this.evento = evento;
  }
}