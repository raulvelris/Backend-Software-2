import fs from 'fs'
import { DeleteRecursoUseCase } from '../modules/eliminar-recurso/use-cases/DeleteRecursoUseCase'
import { IRecursoRepository } from '../domain/interfaces/IRecursoRepository'
import { IEventoRepository } from '../domain/interfaces/IEventoRepository'
import { NotificationManager } from '../infrastructure/patterns/observer/NotificationManager'
import { DeleteRecursoDto } from '../modules/eliminar-recurso/dtos/DeleteRecursoDto'

jest.mock('fs', () => ({
  promises: {
    stat: jest.fn(),
    unlink: jest.fn(),
  },
}))

const fsPromises = fs.promises as unknown as {
  stat: jest.Mock
  unlink: jest.Mock
}

class FakeRecursoRepository implements Partial<IRecursoRepository> {
  public findById = jest.fn()
  public delete = jest.fn()
  public findByEventoId = jest.fn()
  public findAll = jest.fn()
  public create = jest.fn()
  public update = jest.fn()
}

class FakeEventoRepository implements Partial<IEventoRepository> {
  public findById = jest.fn()
  public create = jest.fn()
  public update = jest.fn()
  public delete = jest.fn()
  public findAll = jest.fn()
}

class FakeNotificationManager implements Partial<NotificationManager> {
  public notify = jest.fn()
  public attach = jest.fn()
  public detach = jest.fn()
}

describe('DeleteRecursoUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const buildUseCase = () => {
    const recursoRepository = new FakeRecursoRepository()
    const eventoRepository = new FakeEventoRepository()
    const notificationManager = new FakeNotificationManager()

    const useCase = new DeleteRecursoUseCase(
      recursoRepository as unknown as IRecursoRepository,
      eventoRepository as unknown as IEventoRepository,
      notificationManager as unknown as NotificationManager,
    )

    return { useCase, recursoRepository, eventoRepository, notificationManager }
  }

  it('elimina el recurso, borra el archivo físico y notifica cuando todo es válido', async () => {
    const { useCase, recursoRepository, eventoRepository, notificationManager } = buildUseCase()

    const dto: DeleteRecursoDto = {
      evento_id: 1,
      recurso_id: 10,
      usuario_id: 7,
    }

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({ evento_id: 1 })
    ;(recursoRepository.findById as jest.Mock).mockResolvedValue({
      recurso_id: 10,
      evento_id: 1,
      url: '/assets/uploads/file.pdf',
    })
    ;(recursoRepository.delete as jest.Mock).mockResolvedValue(true)
    ;(notificationManager.notify as jest.Mock).mockResolvedValue(undefined)
    fsPromises.stat.mockResolvedValue(undefined)
    fsPromises.unlink.mockResolvedValue(undefined)

    const result = await useCase.execute(dto)

    expect(eventoRepository.findById).toHaveBeenCalledWith(1)
    expect(recursoRepository.findById).toHaveBeenCalledWith(10)
    expect(fsPromises.stat).toHaveBeenCalled()
    expect(fsPromises.unlink).toHaveBeenCalled()
    expect(recursoRepository.delete).toHaveBeenCalledWith(10)
    expect(notificationManager.notify).toHaveBeenCalledWith('RECURSO_ELIMINADO', {
      eventoId: 1,
      emisorId: 7,
    })
    expect(result).toEqual({
      success: true,
      message: 'Recurso eliminado correctamente',
    })
  })

  it('lanza error si faltan evento_id, recurso_id o usuario_id', async () => {
    const { useCase } = buildUseCase()

    await expect(
      useCase.execute({ evento_id: undefined as any, recurso_id: 1, usuario_id: 1 }),
    ).rejects.toThrow('evento_id y recurso_id son requeridos')
    await expect(
      useCase.execute({ evento_id: 1, recurso_id: undefined as any, usuario_id: 1 }),
    ).rejects.toThrow('evento_id y recurso_id son requeridos')
    await expect(
      useCase.execute({ evento_id: 1, recurso_id: 1, usuario_id: undefined as any }),
    ).rejects.toThrow('evento_id y recurso_id son requeridos')
  })

  it('lanza error si el evento no existe', async () => {
    const { useCase, eventoRepository } = buildUseCase()

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue(null)

    await expect(
      useCase.execute({ evento_id: 1, recurso_id: 2, usuario_id: 3 }),
    ).rejects.toThrow('Evento no encontrado')
  })

  it('lanza error si el recurso no existe', async () => {
    const { useCase, eventoRepository, recursoRepository } = buildUseCase()

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({ evento_id: 1 })
    ;(recursoRepository.findById as jest.Mock).mockResolvedValue(null)

    await expect(
      useCase.execute({ evento_id: 1, recurso_id: 2, usuario_id: 3 }),
    ).rejects.toThrow('Recurso no encontrado')
  })

  it('lanza error si el recurso no pertenece al evento', async () => {
    const { useCase, eventoRepository, recursoRepository } = buildUseCase()

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({ evento_id: 1 })
    ;(recursoRepository.findById as jest.Mock).mockResolvedValue({
      recurso_id: 2,
      evento_id: 99,
    })

    await expect(
      useCase.execute({ evento_id: 1, recurso_id: 2, usuario_id: 3 }),
    ).rejects.toThrow('El recurso no pertenece al evento indicado')
  })

  it('lanza error si el repositorio no puede eliminar el recurso', async () => {
    const { useCase, eventoRepository, recursoRepository } = buildUseCase()

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({ evento_id: 1 })
    ;(recursoRepository.findById as jest.Mock).mockResolvedValue({
      recurso_id: 2,
      evento_id: 1,
    })
    ;(recursoRepository.delete as jest.Mock).mockResolvedValue(false)

    await expect(
      useCase.execute({ evento_id: 1, recurso_id: 2, usuario_id: 3 }),
    ).rejects.toThrow('No se pudo eliminar el recurso')
  })

  it('no intenta borrar archivos físicos cuando la URL no es local', async () => {
    const { useCase, eventoRepository, recursoRepository, notificationManager } = buildUseCase()

    ;(eventoRepository.findById as jest.Mock).mockResolvedValue({ evento_id: 1 })
    ;(recursoRepository.findById as jest.Mock).mockResolvedValue({
      recurso_id: 5,
      evento_id: 1,
      url: 'https://example.com/file.pdf',
    })
    ;(recursoRepository.delete as jest.Mock).mockResolvedValue(true)
    ;(notificationManager.notify as jest.Mock).mockResolvedValue(undefined)

    const result = await useCase.execute({ evento_id: 1, recurso_id: 5, usuario_id: 9 })

    expect(fsPromises.stat).not.toHaveBeenCalled()
    expect(fsPromises.unlink).not.toHaveBeenCalled()
    expect(result.success).toBe(true)
  })
})
