import { EliminarInvitadoUseCase } from '../modules/eliminar-invitado/use-cases/EliminarInvitadoUseCase'
import { EliminarInvitadoDto } from '../modules/eliminar-invitado/dtos/EliminarInvitadoDto'
import { IEventoRepository } from '../domain/interfaces/IEventoRepository'
import { IEventoParticipanteRepository } from '../domain/interfaces/IEventoParticipanteRepository'
import { INotificacionUsuarioRepository } from '../domain/interfaces/INotificacionUsuarioRepository'
import { NotificacionFabrica } from '../infrastructure/patterns/factoryMethod/NotificacionFabrica'
import { TipoNotificacion } from '../domain/value-objects/TipoNotificacion'
import { TipoRol } from '../domain/value-objects/TipoRol'

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

class FakeNotificacionUsuarioRepository implements Partial<INotificacionUsuarioRepository> {
  public create = jest.fn()
  public findAllByUsuarioIdWithDetalles = jest.fn()
}

describe('EliminarInvitadoUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('elimina correctamente a un participante no organizador y crea notificación', async () => {
    const eventoRepository = new FakeEventoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificacionUsuarioRepository = new FakeNotificacionUsuarioRepository()

    const useCase = new EliminarInvitadoUseCase(
      eventoRepository as IEventoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificacionUsuarioRepository as INotificacionUsuarioRepository,
    )

    const dto: EliminarInvitadoDto = {
      evento_id: 1,
      usuario_id: 10,
      emisor_id: 99,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({ evento_id: 1 })
    ;(eventoParticipanteRepository.findByEventoAndUsuario as jest.Mock).mockResolvedValue({
      participante: {
        participante_id: 123,
        rol: {
          nombre: TipoRol.ASISTENTE,
        },
      },
    })

    mockedNotificacionFabrica.crearNotificacion.mockResolvedValue({
      notificacion_id: 777,
      tipo: TipoNotificacion.ACCION,
    })

    const result = await useCase.execute(dto)

    expect(eventoRepository.findById).toHaveBeenCalledWith(1)
    expect(eventoParticipanteRepository.findByEventoAndUsuario).toHaveBeenCalledWith(1, 10)
    expect(eventoParticipanteRepository.deleteByEventoAndParticipante).toHaveBeenCalledWith(1, 123)
    expect(mockedNotificacionFabrica.crearNotificacion).toHaveBeenCalled()
    expect(notificacionUsuarioRepository.create).toHaveBeenCalledWith({
      notificacion_accion_id: 777,
      usuario_id: 10,
    })

    expect(result).toEqual({
      success: true,
      message: 'Participante eliminado correctamente',
      evento_id: 1,
    })
  })

  it('retorna error si el evento no existe', async () => {
    const eventoRepository = new FakeEventoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificacionUsuarioRepository = new FakeNotificacionUsuarioRepository()

    const useCase = new EliminarInvitadoUseCase(
      eventoRepository as IEventoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificacionUsuarioRepository as INotificacionUsuarioRepository,
    )

    const dto: EliminarInvitadoDto = {
      evento_id: 999,
      usuario_id: 10,
      emisor_id: 99,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue(null)

    const result = await useCase.execute(dto)

    expect(eventoRepository.findById).toHaveBeenCalledWith(999)
    expect(result).toEqual({ success: false, message: 'Evento no encontrado' })
  })

  it('retorna error si el emisor intenta eliminarse a sí mismo', async () => {
    const eventoRepository = new FakeEventoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificacionUsuarioRepository = new FakeNotificacionUsuarioRepository()

    const useCase = new EliminarInvitadoUseCase(
      eventoRepository as IEventoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificacionUsuarioRepository as INotificacionUsuarioRepository,
    )

    const dto: EliminarInvitadoDto = {
      evento_id: 1,
      usuario_id: 10,
      emisor_id: 10,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({ evento_id: 1 })

    const result = await useCase.execute(dto)

    expect(eventoRepository.findById).toHaveBeenCalledWith(1)
    expect(eventoParticipanteRepository.findByEventoAndUsuario).not.toHaveBeenCalled()
    expect(result).toEqual({ success: false, message: 'No puedes eliminarte a ti mismo' })
  })

  it('retorna error si el participante no está asociado al evento', async () => {
    const eventoRepository = new FakeEventoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificacionUsuarioRepository = new FakeNotificacionUsuarioRepository()

    const useCase = new EliminarInvitadoUseCase(
      eventoRepository as IEventoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificacionUsuarioRepository as INotificacionUsuarioRepository,
    )

    const dto: EliminarInvitadoDto = {
      evento_id: 1,
      usuario_id: 10,
      emisor_id: 99,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({ evento_id: 1 })
    ;(eventoParticipanteRepository.findByEventoAndUsuario as jest.Mock).mockResolvedValue(null)

    const result = await useCase.execute(dto)

    expect(eventoParticipanteRepository.findByEventoAndUsuario).toHaveBeenCalledWith(1, 10)
    expect(result).toEqual({ success: false, message: 'Participante no encontrado en el evento' })
  })

  it('retorna error si se intenta eliminar al organizador principal', async () => {
    const eventoRepository = new FakeEventoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificacionUsuarioRepository = new FakeNotificacionUsuarioRepository()

    const useCase = new EliminarInvitadoUseCase(
      eventoRepository as IEventoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificacionUsuarioRepository as INotificacionUsuarioRepository,
    )

    const dto: EliminarInvitadoDto = {
      evento_id: 1,
      usuario_id: 10,
      emisor_id: 99,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({ evento_id: 1 })
    ;(eventoParticipanteRepository.findByEventoAndUsuario as jest.Mock).mockResolvedValue({
      participante: {
        participante_id: 123,
        rol: {
          nombre: TipoRol.ORGANIZADOR,
        },
      },
    })

    const result = await useCase.execute(dto)

    expect(result).toEqual({
      success: false,
      message: 'No se puede eliminar al organizador principal del evento',
    })
    expect(eventoParticipanteRepository.deleteByEventoAndParticipante).not.toHaveBeenCalled()
    expect(mockedNotificacionFabrica.crearNotificacion).not.toHaveBeenCalled()
  })
})
