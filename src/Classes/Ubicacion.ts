import { Evento } from './Evento';

export class Ubicacion {
    private direccion: string;
    private latitud: number;
    private longitud: number;
    private evento: Evento;

    // Constructor
    constructor(direccion: string, latitud: number, longitud: number, evento: Evento) {
        this.direccion = direccion;
        this.latitud = latitud;
        this.longitud = longitud;
        this.evento = evento;
    }

    // Getters y setters
    public getDireccion(): string {
        return this.direccion;
    }

    public setDireccion(direccion: string): void {
        this.direccion = direccion;
    }

    public getLatitud(): number {
        return this.latitud;
    }

    public setLatitud(latitud: number): void {
        this.latitud = latitud;
    }

    public getLongitud(): number {
        return this.longitud;
    }

    public setLongitud(longitud: number): void {
        this.longitud = longitud;
    }

    public getEvento(): Evento {
        return this.evento;
    }

    public setEvento(evento: Evento): void {
        this.evento = evento;
    }
}
