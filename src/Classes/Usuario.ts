import { InvitacionUsuario } from './InvitacionUsuario';
import { Participante } from './Participante';

export class Usuario {
  private clave: string;
  private correo: string;
  // private estaActivo: boolean;
  // private perfil: Cliente;
  private invitaciones: InvitacionUsuario[];
  private participaciones: Participante[];

  constructor(correo: string, clave: string) {
    this.correo = correo;
    this.clave = clave;
    // this.estaActivo = false; // por defecto activo
    // this.invitaciones = [];
    // this.perfil = null; // se asigna luego
    this.invitaciones = [];
    this.participaciones = [];
  }

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

  public getParticipaciones(): Participante[] {
    return this.participaciones; // devolvemos copia para no exponer la lista interna
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