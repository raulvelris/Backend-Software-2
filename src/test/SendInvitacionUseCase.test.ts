import { SendInvitacionUseCase } from '../modules/envio-invitaciones/use-cases/SendInvitacionUseCase'
import { SendInvitacionDto } from '../modules/envio-invitaciones/dtos/SendInvitacionDto'
import { IUsuarioRepository } from '../domain/interfaces/IUsuarioRepository'
import { IEventoRepository } from '../domain/interfaces/IEventoRepository'
import { IEventoParticipanteRepository } from '../domain/interfaces/IEventoParticipanteRepository'
import { IInvitacionUsuarioRepository } from '../domain/interfaces/IInvitacionUsuarioRepository'
import { IEstadoInvitacionRepository } from '../domain/interfaces/IEstadoInvitacionRepository'
import { EstadoInvitacionEnum } from '../domain/value-objects/EstadoInvitacion'
import { NotificacionFabrica } from '../infrastructure/patterns/factoryMethod/NotificacionFabrica'

jest.mock('../infrastructure/patterns/factoryMethod/NotificacionFabrica', () => {
  return {
    NotificacionFabrica: {
      crearNotificacion: jest.fn(),
    },
  }
})

const mockedNotificacionFabrica = NotificacionFabrica as unknown as {
  crearNotificacion: jest.Mock
}

class FakeUsuarioRepository implements Partial<IUsuarioRepository> {
  public findById = jest.fn()
  public findByEmail = jest.fn()
  public findByActivationToken = jest.fn()
  public searchActiveByQuery = jest.fn()
  public create = jest.fn()
  public update = jest.fn()
  public delete = jest.fn()
}

class FakeEventoRepository implements Partial<IEventoRepository> {
  public findById = jest.fn()
  public create = jest.fn()
  public update = jest.fn()
  public delete = jest.fn()
  public findAll = jest.fn()
  public findByTituloLowerCase = jest.fn()
  public countEventosByOrganizador = jest.fn()
  public findPublicEvents = jest.fn()
  public findManagedEventsByUsuario = jest.fn()
  public findAttendedEventsByUsuario = jest.fn()
}

class FakeEventoParticipanteRepository implements Partial<IEventoParticipanteRepository> {
  public findByEventoAndUsuario = jest.fn()
  public findParticipantesByEventoAndRol = jest.fn()
  public findParticipantesByEvento = jest.fn()
  public countByEvento = jest.fn()
  public countByUsuarioEventoActivo = jest.fn()
  public findByEventoAndParticipante = jest.fn()
  public create = jest.fn()
  public findByParticipante = jest.fn()
  public findAllWithFilters = jest.fn()
  public deleteByEvento = jest.fn()
  public deleteByEventoAndParticipante = jest.fn()
}

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

describe('SendInvitacionUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('envía invitaciones a usuarios no invitados y retorna resultados exitosos', async () => {
    const usuarioRepository = new FakeUsuarioRepository()
    const eventoRepository = new FakeEventoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const invitacionUsuarioRepository = new FakeInvitacionUsuarioRepository()
    const estadoInvitacionRepository = new FakeEstadoInvitacionRepository()

    const useCase = new SendInvitacionUseCase(
      usuarioRepository as IUsuarioRepository,
      eventoRepository as IEventoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      invitacionUsuarioRepository as IInvitacionUsuarioRepository,
      estadoInvitacionRepository as IEstadoInvitacionRepository,
    )

    const dto: SendInvitacionDto = {
      evento_id: 1,
      usuarios: [
        { usuario_id: 10, esParaCoorganizar: false },
      ],
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({ evento_id: 1 })
    ;(estadoInvitacionRepository.findByNombre as jest.Mock).mockResolvedValue({
      estado_id: 5,
      nombre: EstadoInvitacionEnum.PENDIENTE,
    })
    ;(invitacionUsuarioRepository.countPendientesByEventoYTipo as jest.Mock)
      .mockResolvedValueOnce(0) // asistentes
      .mockResolvedValueOnce(0) // coorganizadores

    ;(usuarioRepository.findById as jest.Mock).mockResolvedValue({ usuario_id: 10 })
    ;(eventoParticipanteRepository.findByEventoAndUsuario as jest.Mock).mockResolvedValue(null)
    ;(invitacionUsuarioRepository.findPendienteByEventoAndUsuario as jest.Mock).mockResolvedValue(null)

    mockedNotificacionFabrica.crearNotificacion.mockResolvedValue({ notificacion_id: 99 })

    ;(invitacionUsuarioRepository.create as jest.Mock).mockResolvedValue({
      invitacion_usuario_id: 123,
    })

    const result = await useCase.execute(dto)

    expect(eventoRepository.findById).toHaveBeenCalledWith(1)
    expect(estadoInvitacionRepository.findByNombre).toHaveBeenCalledWith(EstadoInvitacionEnum.PENDIENTE)
    expect(invitacionUsuarioRepository.countPendientesByEventoYTipo).toHaveBeenCalledTimes(2)
    expect(usuarioRepository.findById).toHaveBeenCalledWith(10)
    expect(eventoParticipanteRepository.findByEventoAndUsuario).toHaveBeenCalledWith(1, 10)
    expect(invitacionUsuarioRepository.findPendienteByEventoAndUsuario).toHaveBeenCalledWith(1, 5, 10)
    expect(mockedNotificacionFabrica.crearNotificacion).toHaveBeenCalled()
    expect(invitacionUsuarioRepository.create).toHaveBeenCalledWith({
      estado_invitacion_id: 5,
      invitacion_id: 99,
      usuario_id: 10,
      esParaCoorganizar: false,
    })

    expect(result.success).toBe(true)
    expect(result.notificacion_id).toBe(99)
    expect(result.resultados).toHaveLength(1)
    expect(result.resultados[0]).toMatchObject({
      usuario_id: 10,
      status: 'Invitation sent',
      invitacion_usuario_id: 123,
      esParaCoorganizar: false,
    })
  })

  it('lanza error si el evento no existe', async () => {
    const usuarioRepository = new FakeUsuarioRepository()
    const eventoRepository = new FakeEventoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const invitacionUsuarioRepository = new FakeInvitacionUsuarioRepository()
    const estadoInvitacionRepository = new FakeEstadoInvitacionRepository()

    const useCase = new SendInvitacionUseCase(
      usuarioRepository as IUsuarioRepository,
      eventoRepository as IEventoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      invitacionUsuarioRepository as IInvitacionUsuarioRepository,
      estadoInvitacionRepository as IEstadoInvitacionRepository,
    )

    const dto: SendInvitacionDto = {
      evento_id: 999,
      usuarios: [{ usuario_id: 10, esParaCoorganizar: false }],
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue(null)

    await expect(useCase.execute(dto)).rejects.toThrow('Event not found')
  })
})
