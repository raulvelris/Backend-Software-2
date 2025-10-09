// src/Classes/Cliente.ts
import { Usuario } from './Usuario';

export class Cliente {
  private nombre: string;
  private apellido: string;
  private usuario: Usuario;

  // Constructor
  constructor(nombre: string, apellido: string, usuario: Usuario) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.usuario = usuario ?? null;
  }

  public getNombre(): string {
    return this.nombre;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public getApellido(): string {
    return this.apellido;
  }

  public setApellido(apellido: string): void {
    this.apellido = apellido;
  }

  public getUsuario(): Usuario {
    return this.usuario;
  }

  public setUsuario(usuario: Usuario): void {
    this.usuario = usuario;
  }

  // Metodo
  public getNombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`;
  }
}