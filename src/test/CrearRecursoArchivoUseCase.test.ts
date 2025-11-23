import { CrearRecursoArchivoUseCase } from '../modules/compartir-recursos/use-cases/CrearRecursoArchivoUseCase'
import { IRecursoRepository } from '../domain/interfaces/IRecursoRepository'
import { IEventoRepository } from '../domain/interfaces/IEventoRepository'
import { ITipoRecursoRepository } from '../domain/interfaces/ITipoRecursoRepository'
import { IEventoParticipanteRepository } from '../domain/interfaces/IEventoParticipanteRepository'
import { NotificationManager } from '../infrastructure/patterns/observer/NotificationManager'
import { TipoNotificacion } from '../domain/value-objects/TipoNotificacion'
import { CrearRecursoDto } from '../modules/compartir-recursos/dtos/CrearRecursoDto'

class FakeRecursoRepository implements Partial<IRecursoRepository> {
  public findById = jest.fn()
  public create = jest.fn()
  public update = jest.fn()
  public delete = jest.fn()
  public findAll = jest.fn()
  public findByEventoId = jest.fn()
  public findByTipoRecurso = jest.fn()
  public findByEventoIdAndNombre = jest.fn()
  public findByEventoIdAndUrl = jest.fn()
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

class FakeTipoRecursoRepository implements Partial<ITipoRecursoRepository> {
  public findById = jest.fn()
  public create = jest.fn()
  public update = jest.fn()
  public delete = jest.fn()
  public findAll = jest.fn()
  public findByName = jest.fn()
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

class FakeNotificationManager implements Partial<NotificationManager> {
  public notify = jest.fn()
  public attach = jest.fn()
  public detach = jest.fn()
}

describe('CrearRecursoArchivoUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('crea un recurso archivo correctamente cuando todos los datos son válidos', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoArchivoUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
      fechaFin: new Date(Date.now() + 86400000), // mañana
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 1,
      nombre: 'Archivo',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)

    ;(recursoRepository.create as jest.Mock).mockResolvedValue({
      recurso_id: 100,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
      evento_id: 1,
    })

    const result = await useCase.execute(dto)

    expect(eventoRepository.findById).toHaveBeenCalledWith(1)
    expect(tipoRecursoRepository.findById).toHaveBeenCalledWith(1)
    expect(recursoRepository.findByEventoIdAndNombre).toHaveBeenCalledWith(1, 'Documento.pdf')
    expect(recursoRepository.create).toHaveBeenCalledWith({
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
      evento_id: 1,
    })

    expect(result.id).toBe(100)
    expect(result.nombre).toBe('Documento.pdf')
    expect(result.url).toBe('https://example.com/files/documento.pdf')
    expect(result.tipo_recurso).toEqual({
      id: 1,
      nombre: 'Archivo',
    })
    expect(result.evento_id).toBe(1)
  })

  it('lanza error si el nombre está vacío', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoArchivoUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: '',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
    }

    await expect(useCase.execute(dto)).rejects.toThrow('Faltan campos requeridos: nombre es obligatorio')
  })

  it('lanza error si el nombre es solo espacios en blanco', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoArchivoUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: '   ',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
    }

    await expect(useCase.execute(dto)).rejects.toThrow('Faltan campos requeridos: nombre es obligatorio')
  })

  it('lanza error si la URL está vacía', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoArchivoUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Documento.pdf',
      url: '',
      tipo_recurso: 1,
    }

    await expect(useCase.execute(dto)).rejects.toThrow('Faltan campos requeridos: url es obligatorio')
  })

  it('lanza error si el evento no existe', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoArchivoUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 999,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue(null)

    await expect(useCase.execute(dto)).rejects.toThrow('Evento no encontrado')
  })

  it('lanza error si el tipo de recurso no existe', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoArchivoUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 999,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue(null)

    await expect(useCase.execute(dto)).rejects.toThrow('Tipo de recurso no encontrado')
  })

  it('lanza error si ya existe un recurso con el mismo nombre en el evento', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoArchivoUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 1,
      nombre: 'Archivo',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue({
      recurso_id: 50,
      nombre: 'Documento.pdf',
    })

    await expect(useCase.execute(dto)).rejects.toThrow(
      'Nombre de recurso no válido: ya existe un recurso con ese nombre para este evento',
    )
  })

  it('lanza error si no se puede crear el recurso en la base de datos', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoArchivoUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 1,
      nombre: 'Archivo',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)

    ;(recursoRepository.create as jest.Mock).mockResolvedValue(null)

    await expect(useCase.execute(dto)).rejects.toThrow('Error al crear el recurso en la base de datos')
  })

  it('envía notificación cuando hay participantes y el evento no ha pasado', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoArchivoUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
      emisorId: 5,
    }

    const fechaFinFutura = new Date(Date.now() + 86400000) // mañana
    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
      fechaFin: fechaFinFutura,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 1,
      nombre: 'Archivo',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)

    ;(recursoRepository.create as jest.Mock).mockResolvedValue({
      recurso_id: 100,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
      evento_id: 1,
    })

    ;(eventoParticipanteRepository.countByEvento as jest.Mock).mockResolvedValue(3)

    ;(notificationManager.notify as jest.Mock).mockResolvedValue(undefined)

    const result = await useCase.execute(dto)

    expect(eventoParticipanteRepository.countByEvento).toHaveBeenCalledWith(1)
    expect(notificationManager.notify).toHaveBeenCalledWith(TipoNotificacion.RECURSO_AGREGADO, {
      eventoId: 1,
      emisorId: 5,
    })
  })

  it('no envía notificación cuando no hay participantes suficientes', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoArchivoUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
      emisorId: 5,
    }

    const fechaFinFutura = new Date(Date.now() + 86400000) // mañana
    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
      fechaFin: fechaFinFutura,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 1,
      nombre: 'Archivo',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)

    ;(recursoRepository.create as jest.Mock).mockResolvedValue({
      recurso_id: 100,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
      evento_id: 1,
    })

    ;(eventoParticipanteRepository.countByEvento as jest.Mock).mockResolvedValue(1)

    const result = await useCase.execute(dto)

    expect(eventoParticipanteRepository.countByEvento).toHaveBeenCalledWith(1)
    expect(notificationManager.notify).not.toHaveBeenCalled()
  })

  it('no envía notificación cuando el evento ya ha pasado', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoArchivoUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
      emisorId: 5,
    }

    const fechaFinPasada = new Date(Date.now() - 86400000) // ayer
    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
      fechaFin: fechaFinPasada,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 1,
      nombre: 'Archivo',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)

    ;(recursoRepository.create as jest.Mock).mockResolvedValue({
      recurso_id: 100,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
      evento_id: 1,
    })

    ;(eventoParticipanteRepository.countByEvento as jest.Mock).mockResolvedValue(3)

    const result = await useCase.execute(dto)

    expect(eventoParticipanteRepository.countByEvento).toHaveBeenCalledWith(1)
    expect(notificationManager.notify).not.toHaveBeenCalled()
  })

  it('normaliza espacios en blanco del nombre y URL', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoArchivoUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: '  Documento.pdf  ',
      url: '  https://example.com/files/documento.pdf  ',
      tipo_recurso: 1,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 1,
      nombre: 'Archivo',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)

    ;(recursoRepository.create as jest.Mock).mockResolvedValue({
      recurso_id: 100,
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
      evento_id: 1,
    })

    const result = await useCase.execute(dto)

    expect(recursoRepository.findByEventoIdAndNombre).toHaveBeenCalledWith(1, 'Documento.pdf')
    expect(recursoRepository.create).toHaveBeenCalledWith({
      nombre: 'Documento.pdf',
      url: 'https://example.com/files/documento.pdf',
      tipo_recurso: 1,
      evento_id: 1,
    })
    expect(result.nombre).toBe('Documento.pdf')
    expect(result.url).toBe('https://example.com/files/documento.pdf')
  })
})

