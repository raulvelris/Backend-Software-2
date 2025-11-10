// Interfaz de repositorio para EventoParticipante
export interface IEventoParticipanteRepository {
  // Propiedad para acceder a la instancia de sequelize
  sequelize: any;
  
  // Métodos del repositorio
  findByEventoAndUsuario(eventoId: number, usuarioId: number): Promise<any | null>;
  findParticipantesByEventoAndRol(eventoId: number): Promise<any[]>;
  findParticipantesByEvento(eventoId: number): Promise<any[]>;
  countByEvento(eventoId: number): Promise<number>;
  countByParticipante(participanteId: number): Promise<number>;
  findByEventoAndParticipante(eventoId: number, participanteId: number): Promise<any | null>;
  create(eventoId: number, participanteId: number): Promise<any>;
  findByParticipante(participanteId: number): Promise<any[]>;
  findByEventoId(eventoId: number): Promise<any[]>;
  deleteByEventoId(eventoId: number): Promise<boolean>;
}
