// Interfaz de repositorio para Invitacion
// Usa modelos de Sequelize directamente (any)
export interface IInvitacionRepository {
  findById(id: number): Promise<any | null>;
  create(data: any): Promise<any>;
  createInvitacionUsuario(data: any): Promise<any>;
  findInvitacionUsuarioByEventoAndUsuario(eventoId: number, usuarioId: number): Promise<any | null>;
  countPendientesByEvento(eventoId: number): Promise<number>;
  findNoElegiblesByEvento(eventoId: number): Promise<any[]>;
}
