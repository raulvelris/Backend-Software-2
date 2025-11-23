import { ListarRecursosUseCase } from '../modules/listar-recursos/use-cases/ListarRecursosUseCase'
import { IRecursoRepository } from '../domain/interfaces/IRecursoRepository'
import { IEventoRepository } from '../domain/interfaces/IEventoRepository'

class FakeRecursoRepository implements IRecursoRepository {
  public findById = jest.fn()
  public findAll = jest.fn()
  public findByTipoRecurso = jest.fn()
  public findByEventoIdAndNombre = jest.fn()
  public findByEventoIdAndUrl = jest.fn()
  public findByEventoId = jest.fn()
  public create = jest.fn()
  public update = jest.fn()
  public delete = jest.fn()
}

class FakeEventoRepository implements IEventoRepository {
  public findById = jest.fn()
  public findAll = jest.fn()
  public findByTituloLowerCase = jest.fn()
  public countEventosByOrganizador = jest.fn()
  public findPublicEvents = jest.fn()
  public findManagedEventsByUsuario = jest.fn()
  public findAttendedEventsByUsuario = jest.fn()
  public create = jest.fn()
  public update = jest.fn()
  public delete = jest.fn()
}


describe('ListarRecursosUseCase', () => {
  it('retorna los recursos mapeados cuando el evento existe y el tipo viene anidado', async () => {
    const recursoRepo = new FakeRecursoRepository()
    const eventoRepo = new FakeEventoRepository()

    eventoRepo.findById!.mockResolvedValue({
      evento_id: 1,
      nombre: 'Evento test',
    })

    recursoRepo.findByEventoId!.mockResolvedValue([
      {
        recurso_id: 10,
        nombre: 'Presentación',
        url: 'http://example.com/slide.pdf',
        tipo: {
          tipo_recurso_id: 2,
          nombre: 'PDF',
        },
        evento_id: 1,
      },
    ] as any)

    const useCase = new ListarRecursosUseCase(
      recursoRepo as IRecursoRepository,
      eventoRepo as IEventoRepository
    )

    const result = await useCase.execute({ evento_id: 1 })

    expect(eventoRepo.findById).toHaveBeenCalledWith(1)
    expect(recursoRepo.findByEventoId).toHaveBeenCalledWith(1)
    expect(result.success).toBe(true)
    expect(result.recursos).toEqual([
      {
        id: 10,
        nombre: 'Presentación',
        url: 'http://example.com/slide.pdf',
        tipo_recurso: {
          id: 2,
          nombre: 'PDF',
        },
        evento_id: 1,
      },
    ])
  })

  it('usa tipo_recurso plano cuando no existe objeto tipo', async () => {
    const recursoRepo = new FakeRecursoRepository()
    const eventoRepo = new FakeEventoRepository()

    eventoRepo.findById!.mockResolvedValue({
      evento_id: 2,
      nombre: 'Evento 2',
    })

    recursoRepo.findByEventoId!.mockResolvedValue([
      {
        recurso_id: 20,
        nombre: 'Link externo',
        url: 'http://example.com',
        tipo: undefined,
        tipo_recurso: 3,
        evento_id: 2,
      },
    ] as any)

    const useCase = new ListarRecursosUseCase(
      recursoRepo as IRecursoRepository,
      eventoRepo as IEventoRepository
    )

    const result = await useCase.execute({ evento_id: 2 })

    expect(result.success).toBe(true)
    expect(result.recursos).toEqual([
      {
        id: 20,
        nombre: 'Link externo',
        url: 'http://example.com',
        tipo_recurso: {
          id: 3,
          nombre: '',
        },
        evento_id: 2,
      },
    ])
  })

  it('lanza error si el evento no existe', async () => {
    const recursoRepo = new FakeRecursoRepository()
    const eventoRepo = new FakeEventoRepository()

    eventoRepo.findById!.mockResolvedValue(null)

    const useCase = new ListarRecursosUseCase(
      recursoRepo as IRecursoRepository,
      eventoRepo as IEventoRepository
    )

    await expect(useCase.execute({ evento_id: 999 })).rejects.toThrow(
      'Event not found'
    )

    expect(recursoRepo.findByEventoId).not.toHaveBeenCalled()
  })
})
