import { CountInvitacionesPendientesUseCase } from '../modules/envio-invitaciones/use-cases/CountInvitacionesPendientesUseCase'
import { IInvitacionUsuarioRepository } from '../domain/interfaces/IInvitacionUsuarioRepository'
import { IEstadoInvitacionRepository } from '../domain/interfaces/IEstadoInvitacionRepository'
import { EstadoInvitacionEnum } from '../domain/value-objects/EstadoInvitacion'
import {
  LIMITE_INVITACIONES_PENDIENTES_ASISTENTES,
  LIMITE_INVITACIONES_PENDIENTES_COORGANIZADORES,
} from '../domain/value-objects/Constantes'

class FakeInvitacionUsuarioRepository implements Partial<IInvitacionUsuarioRepository> {
  public create = jest.fn()
  public findPendienteByEventoAndUsuario = jest.fn()
  public countPendientesByEventoYTipo = jest.fn()
  public findByIdWithEventoAndUsuario = jest.fn()
  public update = jest.fn()
  public findAllByUsuarioIdWithDetalles = jest.fn()
  public findPendientesByEvento = jest.fn()
}

class FakeEstadoInvitacionRepository implements Partial<IEstadoInvitacionRepository> {
  public findByNombre = jest.fn()
}

describe('CountInvitacionesPendientesUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('retorna conteos de invitaciones pendientes para asistentes y coorganizadores cuando existe estado pendiente', async () => {
    const invitacionUsuarioRepository = new FakeInvitacionUsuarioRepository()
    const estadoInvitacionRepository = new FakeEstadoInvitacionRepository()

    const useCase = new CountInvitacionesPendientesUseCase(
      invitacionUsuarioRepository as IInvitacionUsuarioRepository,
      estadoInvitacionRepository as IEstadoInvitacionRepository,
    )

    ;(estadoInvitacionRepository.findByNombre as jest.Mock).mockResolvedValue({
      estado_id: 10,
      nombre: EstadoInvitacionEnum.PENDIENTE,
    })

    ;(invitacionUsuarioRepository.countPendientesByEventoYTipo as jest.Mock)
      .mockResolvedValueOnce(3) // asistentes
      .mockResolvedValueOnce(2) // coorganizadores

    const result = await useCase.execute(1)

    expect(estadoInvitacionRepository.findByNombre).toHaveBeenCalledWith(EstadoInvitacionEnum.PENDIENTE)
    expect(invitacionUsuarioRepository.countPendientesByEventoYTipo).toHaveBeenCalledTimes(2)
    expect(invitacionUsuarioRepository.countPendientesByEventoYTipo).toHaveBeenNthCalledWith(1, 1, 10, false)
    expect(invitacionUsuarioRepository.countPendientesByEventoYTipo).toHaveBeenNthCalledWith(2, 1, 10, true)

    expect(result).toEqual({
      pendientesParaAsistente: 3,
      limiteAsistentes: LIMITE_INVITACIONES_PENDIENTES_ASISTENTES,
      pendientesParaCoorganizador: 2,
      limiteCoorganizadores: LIMITE_INVITACIONES_PENDIENTES_COORGANIZADORES,
    })
  })

  it('retorna ceros cuando no existe estado pendiente', async () => {
    const invitacionUsuarioRepository = new FakeInvitacionUsuarioRepository()
    const estadoInvitacionRepository = new FakeEstadoInvitacionRepository()

    const useCase = new CountInvitacionesPendientesUseCase(
      invitacionUsuarioRepository as IInvitacionUsuarioRepository,
      estadoInvitacionRepository as IEstadoInvitacionRepository,
    )

    ;(estadoInvitacionRepository.findByNombre as jest.Mock).mockResolvedValue(null)

    const result = await useCase.execute(1)

    expect(estadoInvitacionRepository.findByNombre).toHaveBeenCalledWith(EstadoInvitacionEnum.PENDIENTE)
    expect(invitacionUsuarioRepository.countPendientesByEventoYTipo).not.toHaveBeenCalled()

    expect(result).toEqual({
      pendientesParaAsistente: 0,
      limiteAsistentes: LIMITE_INVITACIONES_PENDIENTES_ASISTENTES,
      pendientesParaCoorganizador: 0,
      limiteCoorganizadores: LIMITE_INVITACIONES_PENDIENTES_COORGANIZADORES,
    })
  })

  it('lanza error si eventoId es inválido o no viene', async () => {
    const invitacionUsuarioRepository = new FakeInvitacionUsuarioRepository()
    const estadoInvitacionRepository = new FakeEstadoInvitacionRepository()

    const useCase = new CountInvitacionesPendientesUseCase(
      invitacionUsuarioRepository as IInvitacionUsuarioRepository,
      estadoInvitacionRepository as IEstadoInvitacionRepository,
    )

    await expect(useCase.execute(0 as any)).rejects.toThrow('evento_id es requerido')
    await expect(useCase.execute(undefined as any)).rejects.toThrow('evento_id es requerido')
    await expect(useCase.execute(null as any)).rejects.toThrow('evento_id es requerido')
  })
})
