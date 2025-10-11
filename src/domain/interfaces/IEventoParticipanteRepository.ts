// Interfaz de repositorio para EventoParticipante
// Usa modelos de Sequelize directamente (any)
export interface IEventoParticipanteRepository {
  isUsuarioInEvento(eventoId: number, usuarioId: number): Promise<boolean>;
}
