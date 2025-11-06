import { IInvitacionUsuarioRepository } from '../../../domain/interfaces/IInvitacionUsuarioRepository';
import { IEstadoInvitacionRepository } from '../../../domain/interfaces/IEstadoInvitacionRepository';
import { EstadoInvitacionEnum } from '../../../domain/value-objects/EstadoInvitacion';
import { 
  LIMITE_INVITACIONES_PENDIENTES_ASISTENTES,
  LIMITE_INVITACIONES_PENDIENTES_COORGANIZADORES
} from '../../../domain/value-objects/Constantes';

export class CountInvitacionesPendientesUseCase {
  constructor(
    private invitacionUsuarioRepository: IInvitacionUsuarioRepository,
    private estadoInvitacionRepository: IEstadoInvitacionRepository
  ) {}

  async execute(eventoId: number): Promise<{
    pendientesParaAsistente: number;
    limiteAsistentes: number;
    pendientesParaCoorganizador: number;
    limiteCoorganizadores: number;
  }> {
    if (!eventoId) {
      throw new Error('evento_id es requerido');
    }

    // Obtener estado "Pendiente"
    const estadoPendiente = await this.estadoInvitacionRepository.findByNombre(EstadoInvitacionEnum.PENDIENTE);
    if (!estadoPendiente) {
      return {
        pendientesParaAsistente: 0,
        limiteAsistentes: LIMITE_INVITACIONES_PENDIENTES_ASISTENTES,
        pendientesParaCoorganizador: 0,
        limiteCoorganizadores: LIMITE_INVITACIONES_PENDIENTES_COORGANIZADORES
      };
    }

    // Contar pendientes para Asistentes (esParaCoorganizar = false)
    const pendientesParaAsistente = await this.invitacionUsuarioRepository.countPendientesByEventoYTipo(
      eventoId,
      estadoPendiente.estado_id,
      false
    );

    // Contar pendientes para Coorganizadores (esParaCoorganizar = true)
    const pendientesParaCoorganizador = await this.invitacionUsuarioRepository.countPendientesByEventoYTipo(
      eventoId,
      estadoPendiente.estado_id,
      true
    );
    
    return {
      pendientesParaAsistente,
      limiteAsistentes: LIMITE_INVITACIONES_PENDIENTES_ASISTENTES,
      pendientesParaCoorganizador,
      limiteCoorganizadores: LIMITE_INVITACIONES_PENDIENTES_COORGANIZADORES
    };
  }
}
