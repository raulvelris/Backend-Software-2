import { CrearRecursoEnlaceUseCase } from '../modules/compartir-recursos/use-cases/CrearRecursoEnlaceUseCase'
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

describe('CrearRecursoEnlaceUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('crea un recurso enlace correctamente cuando todos los datos son válidos', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Sitio web oficial',
      url: 'https://example.com',
      tipo_recurso: 2,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
      fechaFin: new Date(Date.now() + 86400000), // mañana
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 2,
      nombre: 'Enlace',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)
    ;(recursoRepository.findByEventoIdAndUrl as jest.Mock).mockResolvedValue(null)

    ;(recursoRepository.create as jest.Mock).mockResolvedValue({
      recurso_id: 200,
      nombre: 'Sitio web oficial',
      url: 'https://example.com',
      tipo_recurso: 2,
      evento_id: 1,
    })

    const result = await useCase.execute(dto)

    expect(eventoRepository.findById).toHaveBeenCalledWith(1)
    expect(tipoRecursoRepository.findById).toHaveBeenCalledWith(2)
    expect(recursoRepository.findByEventoIdAndNombre).toHaveBeenCalledWith(1, 'Sitio web oficial')
    expect(recursoRepository.findByEventoIdAndUrl).toHaveBeenCalledWith(1, 'https://example.com')
    expect(recursoRepository.create).toHaveBeenCalledWith({
      nombre: 'Sitio web oficial',
      url: 'https://example.com',
      tipo_recurso: 2,
      evento_id: 1,
    })

    expect(result.id).toBe(200)
    expect(result.nombre).toBe('Sitio web oficial')
    expect(result.url).toBe('https://example.com')
    expect(result.tipo_recurso).toEqual({
      id: 2,
      nombre: 'Enlace',
    })
    expect(result.evento_id).toBe(1)
  })

  it('lanza error si el nombre está vacío', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: '',
      url: 'https://example.com',
      tipo_recurso: 2,
    }

    await expect(useCase.execute(dto)).rejects.toThrow(
      'Faltan campos requeridos: nombre es obligatorio para enlaces',
    )
  })

  it('lanza error si el nombre es solo espacios en blanco', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: '   ',
      url: 'https://example.com',
      tipo_recurso: 2,
    }

    await expect(useCase.execute(dto)).rejects.toThrow(
      'Faltan campos requeridos: nombre es obligatorio para enlaces',
    )
  })

  it('lanza error si la URL está vacía', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Sitio web',
      url: '',
      tipo_recurso: 2,
    }

    await expect(useCase.execute(dto)).rejects.toThrow('Faltan campos requeridos: url es obligatorio para enlaces')
  })

  it('lanza error si la URL no es válida', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Sitio web',
      url: 'no-es-una-url-valida',
      tipo_recurso: 2,
    }

    await expect(useCase.execute(dto)).rejects.toThrow('La URL proporcionada no es válida')
  })

  it('lanza error si el evento no existe', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 999,
      nombre: 'Sitio web',
      url: 'https://example.com',
      tipo_recurso: 2,
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

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Sitio web',
      url: 'https://example.com',
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

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Sitio web oficial',
      url: 'https://example.com',
      tipo_recurso: 2,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 2,
      nombre: 'Enlace',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue({
      recurso_id: 50,
      nombre: 'Sitio web oficial',
    })

    await expect(useCase.execute(dto)).rejects.toThrow(
      'Nombre de recurso no válido: ya existe un recurso con ese nombre para este evento',
    )
  })

  it('lanza error si ya existe un recurso con la misma URL en el evento', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Otro nombre',
      url: 'https://example.com',
      tipo_recurso: 2,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 2,
      nombre: 'Enlace',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)
    ;(recursoRepository.findByEventoIdAndUrl as jest.Mock).mockResolvedValue({
      recurso_id: 60,
      url: 'https://example.com',
    })

    await expect(useCase.execute(dto)).rejects.toThrow(
      'URL de recurso no válido: ya existe un recurso con esta URL para este evento',
    )
  })

  it('lanza error si no se puede crear el recurso en la base de datos', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Sitio web',
      url: 'https://example.com',
      tipo_recurso: 2,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 2,
      nombre: 'Enlace',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)
    ;(recursoRepository.findByEventoIdAndUrl as jest.Mock).mockResolvedValue(null)

    ;(recursoRepository.create as jest.Mock).mockResolvedValue(null)

    await expect(useCase.execute(dto)).rejects.toThrow('Error al crear el recurso en la base de datos')
  })

  it('envía notificación cuando hay participantes y el evento no ha pasado', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Sitio web oficial',
      url: 'https://example.com',
      tipo_recurso: 2,
      emisorId: 5,
    }

    const fechaFinFutura = new Date(Date.now() + 86400000) // mañana
    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
      fechaFin: fechaFinFutura,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 2,
      nombre: 'Enlace',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)
    ;(recursoRepository.findByEventoIdAndUrl as jest.Mock).mockResolvedValue(null)

    ;(recursoRepository.create as jest.Mock).mockResolvedValue({
      recurso_id: 200,
      nombre: 'Sitio web oficial',
      url: 'https://example.com',
      tipo_recurso: 2,
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

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Sitio web oficial',
      url: 'https://example.com',
      tipo_recurso: 2,
      emisorId: 5,
    }

    const fechaFinFutura = new Date(Date.now() + 86400000) // mañana
    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
      fechaFin: fechaFinFutura,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 2,
      nombre: 'Enlace',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)
    ;(recursoRepository.findByEventoIdAndUrl as jest.Mock).mockResolvedValue(null)

    ;(recursoRepository.create as jest.Mock).mockResolvedValue({
      recurso_id: 200,
      nombre: 'Sitio web oficial',
      url: 'https://example.com',
      tipo_recurso: 2,
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

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: 'Sitio web oficial',
      url: 'https://example.com',
      tipo_recurso: 2,
      emisorId: 5,
    }

    const fechaFinPasada = new Date(Date.now() - 86400000) // ayer
    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
      fechaFin: fechaFinPasada,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 2,
      nombre: 'Enlace',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)
    ;(recursoRepository.findByEventoIdAndUrl as jest.Mock).mockResolvedValue(null)

    ;(recursoRepository.create as jest.Mock).mockResolvedValue({
      recurso_id: 200,
      nombre: 'Sitio web oficial',
      url: 'https://example.com',
      tipo_recurso: 2,
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

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const dto: CrearRecursoDto = {
      evento_id: 1,
      nombre: '  Sitio web oficial  ',
      url: '  https://example.com  ',
      tipo_recurso: 2,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
      evento_id: 1,
    })

    ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
      tipo_recurso_id: 2,
      nombre: 'Enlace',
    })

    ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)
    ;(recursoRepository.findByEventoIdAndUrl as jest.Mock).mockResolvedValue(null)

    ;(recursoRepository.create as jest.Mock).mockResolvedValue({
      recurso_id: 200,
      nombre: 'Sitio web oficial',
      url: 'https://example.com',
      tipo_recurso: 2,
      evento_id: 1,
    })

    const result = await useCase.execute(dto)

    expect(recursoRepository.findByEventoIdAndNombre).toHaveBeenCalledWith(1, 'Sitio web oficial')
    expect(recursoRepository.findByEventoIdAndUrl).toHaveBeenCalledWith(1, 'https://example.com')
    expect(recursoRepository.create).toHaveBeenCalledWith({
      nombre: 'Sitio web oficial',
      url: 'https://example.com',
      tipo_recurso: 2,
      evento_id: 1,
    })
    expect(result.nombre).toBe('Sitio web oficial')
    expect(result.url).toBe('https://example.com')
  })

  it('valida diferentes formatos de URL válidos', async () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const tipoRecursoRepository = new FakeTipoRecursoRepository()
    const eventoParticipanteRepository = new FakeEventoParticipanteRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new CrearRecursoEnlaceUseCase(
      recursoRepository as IRecursoRepository,
      eventoRepository as IEventoRepository,
      tipoRecursoRepository as ITipoRecursoRepository,
      eventoParticipanteRepository as IEventoParticipanteRepository,
      notificationManager as unknown as NotificationManager,
    )

    const urlsValidas = [
      'https://example.com',
      'http://example.com',
      'https://www.example.com/path?query=value',
      'https://subdomain.example.com',
    ]

    for (const url of urlsValidas) {
      jest.clearAllMocks()

      const dto: CrearRecursoDto = {
        evento_id: 1,
        nombre: `Enlace ${url}`,
        url: url,
        tipo_recurso: 2,
      }

      ;(eventoRepository.findById as jest.Mock).mockResolvedValue({
        evento_id: 1,
      })

      ;(tipoRecursoRepository.findById as jest.Mock).mockResolvedValue({
        tipo_recurso_id: 2,
        nombre: 'Enlace',
      })

      ;(recursoRepository.findByEventoIdAndNombre as jest.Mock).mockResolvedValue(null)
      ;(recursoRepository.findByEventoIdAndUrl as jest.Mock).mockResolvedValue(null)

      ;(recursoRepository.create as jest.Mock).mockResolvedValue({
        recurso_id: 200,
        nombre: `Enlace ${url}`,
        url: url,
        tipo_recurso: 2,
        evento_id: 1,
      })

      const result = await useCase.execute(dto)

      expect(result.url).toBe(url)
    }
  })
})

