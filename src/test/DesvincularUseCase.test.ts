import { DesvincularUseCase } from '../modules/desvincular-evento/use-cases/DesvincularUseCase'
import { DesvincularDto } from '../modules/desvincular-evento/dtos/DesvincularDto'
import { IEventoRepository } from '../domain/interfaces/IEventoRepository'
import { IEventoParticipanteRepository } from '../domain/interfaces/IEventoParticipanteRepository'
import { IParticipanteRepository } from '../domain/interfaces/IParticipanteRepository'
import { NotificationManager } from '../infrastructure/patterns/observer/NotificationManager'
import { TipoNotificacion } from '../domain/value-objects/TipoNotificacion'

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

class FakeParticipanteRepository implements Partial<IParticipanteRepository> {
  public findByUsuarioAndRol = jest.fn()
  public create = jest.fn()
  public findAllByUsuarioId = jest.fn()
  public countAttendees = jest.fn()
}

class FakeNotificationManager implements Partial<NotificationManager> {
  public notify = jest.fn()
}

describe('DesvincularUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('desvincula correctamente al usuario del evento y notifica a organizadores/coorganizadores', async () => {
    const eventoRepository = new FakeEventoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const participanteRepository = new FakeParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new DesvincularUseCase(
      eventoRepository as IEventoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      participanteRepository as IParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: DesvincularDto = {
      evento_id: 1,
      usuario_id: 10,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({ evento_id: 1 })
    ;(eventoParticipanteRepository.findByEventoAndUsuario as jest.Mock).mockResolvedValue({
      participante: {
        participante_id: 123,
      },
    })

    const result = await useCase.execute(dto)

    expect(eventoRepository.findById).toHaveBeenCalledWith(1)
    expect(eventoParticipanteRepository.findByEventoAndUsuario).toHaveBeenCalledWith(1, 10)
    expect(eventoParticipanteRepository.deleteByEventoAndParticipante).toHaveBeenCalledWith(1, 123)
    expect(notificationManager.notify).toHaveBeenCalledWith(
      TipoNotificacion.DESVINCULACION,
      { eventoId: 1, emisorId: 10 },
    )

    expect(result).toEqual({
      success: true,
      message: 'Se ha desvinculado del evento correctamente',
      evento_id: 1,
    })
  })

  it('lanza error si el evento no existe', async () => {
    const eventoRepository = new FakeEventoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const participanteRepository = new FakeParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new DesvincularUseCase(
      eventoRepository as IEventoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      participanteRepository as IParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: DesvincularDto = {
      evento_id: 999,
      usuario_id: 10,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue(null)

    await expect(useCase.execute(dto)).rejects.toThrow('Evento no encontrado')
    expect(eventoParticipanteRepository.findByEventoAndUsuario).not.toHaveBeenCalled()
    expect(notificationManager.notify).not.toHaveBeenCalled()
  })

  it('retorna error si el participante no está asociado al evento', async () => {
    const eventoRepository = new FakeEventoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const participanteRepository = new FakeParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new DesvincularUseCase(
      eventoRepository as IEventoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      participanteRepository as IParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: DesvincularDto = {
      evento_id: 1,
      usuario_id: 10,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({ evento_id: 1 })
    ;(eventoParticipanteRepository.findByEventoAndUsuario as jest.Mock).mockResolvedValue(null)

    const result = await useCase.execute(dto)

    expect(eventoParticipanteRepository.findByEventoAndUsuario).toHaveBeenCalledWith(1, 10)
    expect(result).toEqual({ success: false, message: 'Participante no encontrado en el evento' })
    expect(eventoParticipanteRepository.deleteByEventoAndParticipante).not.toHaveBeenCalled()
    expect(notificationManager.notify).not.toHaveBeenCalled()
  })
})
