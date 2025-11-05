// Interfaz de repositorio para InvitacionUsuario
// Usa modelos de Sequelize directamente (any)
export interface IInvitacionUsuarioRepository {
  create(data: any): Promise<any>;
  findPendienteByEventoAndUsuario(eventoId: number, estadoPendienteId: number, usuarioId: number): Promise<any | null>;
  countPendientesByEventoYTipo(eventoId: number, estadoPendienteId: number, esParaCoorganizar: boolean): Promise<number>;
  findByIdWithEventoAndUsuario(invitacionUsuarioId: number): Promise<any | null>;
  update(invitacionUsuarioId: number, data: any): Promise<any | null>;
  findAllByUsuarioIdWithDetalles(usuarioId: number): Promise<any[]>;
  findPendientesByEvento(eventoId: number, estadoPendienteId: number): Promise<any[]>;
}
