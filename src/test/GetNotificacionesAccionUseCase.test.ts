import { GetNotificacionesAccionUseCase } from '../modules/ver-notificaciones-accion/use-cases/GetNotificacionesAccionUseCase'
import { INotificacionUsuarioRepository } from '../domain/interfaces/INotificacionUsuarioRepository'

class FakeNotificacionUsuarioRepository implements Partial<INotificacionUsuarioRepository> {
  public create = jest.fn()
  public findAllByUsuarioIdWithDetalles = jest.fn()
}

describe('GetNotificacionesAccionUseCase', () => {
  it('retorna notificaciones de acción mapeadas correctamente', async () => {
    const notificacionUsuarioRepository = new FakeNotificacionUsuarioRepository()

    const fechaOriginal = '2024-01-01T12:00:00Z'

    notificacionUsuarioRepository.findAllByUsuarioIdWithDetalles!.mockResolvedValue([
      {
        notificacion_accion: {
          notificacion_id: 1,
          mensaje: 'Mensaje de prueba',
          notificacion: {
            fechaHora: fechaOriginal,
            evento: {
              evento_id: 10,
              titulo: 'Evento de prueba',
            },
          },
        },
      },
      {
        // Caso con varios campos nulos o faltantes para cubrir ramas opcionales
        notificacion_accion: {
          notificacion_id: 2,
          mensaje: null,
          notificacion: {
            fechaHora: null,
            evento: null,
          },
        },
      },
    ])

    const useCase = new GetNotificacionesAccionUseCase(
      notificacionUsuarioRepository as INotificacionUsuarioRepository,
    )

    const result = await useCase.execute({ usuario_id: 5 })

    expect(notificacionUsuarioRepository.findAllByUsuarioIdWithDetalles).toHaveBeenCalledWith(5)
    expect(result.success).toBe(true)
    expect(result.notificaciones_accion).toHaveLength(2)

    expect(result.notificaciones_accion[0]).toEqual({
      notificacion_accion_id: 1,
      fechaHora: new Date(fechaOriginal).toISOString(),
      mensaje: 'Mensaje de prueba',
      evento: {
        evento_id: 10,
        titulo: 'Evento de prueba',
      },
    })

    expect(result.notificaciones_accion[1]).toEqual({
      notificacion_accion_id: 2,
      fechaHora: null,
      mensaje: null,
      evento: null,
    })
  })

  it('lanza error si usuario_id es inválido o no viene en los parámetros', async () => {
    const notificacionUsuarioRepository = new FakeNotificacionUsuarioRepository()

    const useCase = new GetNotificacionesAccionUseCase(
      notificacionUsuarioRepository as INotificacionUsuarioRepository,
    )

    await expect(useCase.execute(undefined as any)).rejects.toThrow('usuario_id es requerido')
    await expect(useCase.execute({} as any)).rejects.toThrow('usuario_id es requerido')
    await expect(useCase.execute({ usuario_id: 'abc' } as any)).rejects.toThrow('usuario_id es requerido')
  })
})
