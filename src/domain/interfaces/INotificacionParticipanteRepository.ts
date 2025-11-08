export interface INotificacionParticipanteRepository {
    create(data: any): Promise<any | null>;
    findAllByUsuarioIdWithDetalles(usuarioId: number): Promise<any[] | null>;
}

