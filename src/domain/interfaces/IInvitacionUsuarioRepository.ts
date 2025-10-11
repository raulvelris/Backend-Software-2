// Interfaz de repositorio para InvitacionUsuario
// Usa modelos de Sequelize directamente (any)
export interface IInvitacionUsuarioRepository {
  create(data: any): Promise<any>;
  findByEventoAndUsuario(eventoId: number, usuarioId: number): Promise<any | null>;
  countPendientesByEvento(eventoId: number, estadoPendienteId: number): Promise<number>;
  findNoElegiblesByEvento(eventoId: number, estadoPendienteId: number): Promise<any[]>;
}
