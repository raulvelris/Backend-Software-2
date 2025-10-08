import { Participante } from './Participante';
import { EstadoEvento } from './EstadoEvento';
import { Privacidad } from './Privacidad';
import { Ubicacion } from './Ubicacion';

export class Evento {
    private titulo: string;
    private descripcion: string;
    private fechaHora: Date;
    private imagen: string;
    private maxNroParticipantes: number;
    private nroParticipantes: number;
    private estado: EstadoEvento;
    private privacidad: Privacidad;
    private ubicacion: Ubicacion;
    private participaciones: Participante[];

    // Constructor
    constructor(titulo: string, descripcion: string, fechaHora: Date, imagen: string, 
                maxNroParticipantes: number, estado: EstadoEvento, privacidad: Privacidad, ubicacion: Ubicacion) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fechaHora = fechaHora;
        this.imagen = imagen;
        this.maxNroParticipantes = maxNroParticipantes;
        this.nroParticipantes = 0;
        this.estado = estado;
        this.privacidad = privacidad;
        this.ubicacion = ubicacion;
        this.participaciones = [];
    }

    // Getters y setters
    public getTitulo(): string {
        return this.titulo;
    }

    public setTitulo(titulo: string): void {
        this.titulo = titulo;
    }

    public getDescripcion(): string {
        return this.descripcion;
    }

    public setDescripcion(descripcion: string): void {
        this.descripcion = descripcion;
    }

    public getFechaHora(): Date {
        return this.fechaHora;
    }

    public setFechaHora(fechaHora: Date): void {
        this.fechaHora = fechaHora;
    }

    public getImagen(): string {
        return this.imagen;
    }

    public setImagen(imagen: string): void {
        this.imagen = imagen;
    }

    public getMaxNroParticipantes(): number {
        return this.maxNroParticipantes;
    }

    public setMaxNroParticipantes(maxNroParticipantes: number): void {
        this.maxNroParticipantes = maxNroParticipantes;
    }

    public getNroParticipantes(): number {
        return this.nroParticipantes;
    }

    public setNroParticipantes(nroParticipantes: number): void {
        this.nroParticipantes = nroParticipantes;
    }

    public getEstado(): EstadoEvento {
        return this.estado;
    }

    public setEstado(estado: EstadoEvento): void {
        this.estado = estado;
    }

    public getPrivacidad(): Privacidad {
        return this.privacidad;
    }

    public setPrivacidad(privacidad: Privacidad): void {
        this.privacidad = privacidad;
    }

    public getUbicacion(): Ubicacion {
        return this.ubicacion;
    }

    public setUbicacion(ubicacion: Ubicacion): void {
        this.ubicacion = ubicacion;
    }

    public getParticipaciones(): Participante[] {
        return this.participaciones;
    }

    // Métodos
    public verDetalle(): void {
        console.log(`Evento: ${this.titulo}`);
        console.log(`Descripción: ${this.descripcion}`);
        console.log(`Fecha y Hora: ${this.fechaHora}`);
        console.log(`Ubicación: ${this.ubicacion.getDireccion()}`);
        console.log(`Estado: ${this.estado}`);
        console.log(`Privacidad: ${this.privacidad}`);
        console.log(`Participantes: ${this.nroParticipantes}/${this.maxNroParticipantes}`);
    }

    public verParticipantes(): void {
        console.log(`Participantes del evento "${this.titulo}":`);
        this.participaciones.forEach((participante, index) => {
            console.log(`${index + 1}. ${participante.getUsuario().getCorreo()} - ${participante.getRol()}`);
        });
    }

    // Agregar participante
    public agregarParticipante(participante: Participante): void {
        if (this.nroParticipantes < this.maxNroParticipantes) {
            this.participaciones.push(participante);
            this.nroParticipantes++;
        } else {
            throw new Error("El evento ha alcanzado el máximo número de participantes");
        }
    }

    // Ver invitados (retorna la lista de participantes)
    public verInvitados(): Participante[] {
        return this.participaciones;
    }
}