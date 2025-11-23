import { UpdateProfileUseCase } from '../modules/gestion-perfil/use-cases/UpdateProfileUseCase'
import { IUsuarioRepository } from '../domain/interfaces/IUsuarioRepository'
import { IClienteRepository } from '../domain/interfaces/IClienteRepository'

class FakeUsuarioRepository implements Partial<IUsuarioRepository> {
  public findById = jest.fn()
  public findByEmail = jest.fn()
  public findByActivationToken = jest.fn()
  public searchActiveByQuery = jest.fn()
  public create = jest.fn()
  public update = jest.fn()
  public delete = jest.fn()
}

class FakeClienteRepository implements Partial<IClienteRepository> {
  public findByUsuarioId = jest.fn()
  public create = jest.fn()
  public update = jest.fn()
}

describe('UpdateProfileUseCase', () => {
  it('actualiza correo y perfil correctamente cuando los datos son válidos', async () => {
    const usuarioRepo = new FakeUsuarioRepository()
    const clienteRepo = new FakeClienteRepository()

    const usuarioId = 1

    usuarioRepo.findByEmail!.mockResolvedValue(null)
    usuarioRepo.update!.mockResolvedValue(undefined)
    usuarioRepo.findById!.mockResolvedValue({
      usuario_id: usuarioId,
      correo: 'nuevo@correo.com',
      cliente: {
        nombre: 'Juan',
        apellido: 'Pérez',
        foto_perfil: 'http://example.com/avatar.png',
      },
    })

    clienteRepo.update!.mockResolvedValue(undefined)

    const useCase = new UpdateProfileUseCase(
      usuarioRepo as IUsuarioRepository,
      clienteRepo as IClienteRepository,
    )

    const result = await useCase.execute({
      usuarioId,
      correo: 'nuevo@correo.com',
      nombre: 'Juan',
      apellido: 'Pérez',
      foto_perfil: 'http://example.com/avatar.png',
    })

    expect(result.success).toBe(true)
    expect(result.user.correo).toBe('nuevo@correo.com')
    expect(usuarioRepo.findByEmail).toHaveBeenCalledWith('nuevo@correo.com')
    expect(usuarioRepo.update).toHaveBeenCalled()
    expect(clienteRepo.update).toHaveBeenCalled()
  })

  it('lanza error si el correo ya está tomado por otro usuario', async () => {
    const usuarioRepo = new FakeUsuarioRepository()
    const clienteRepo = new FakeClienteRepository()

    const usuarioId = 1

    usuarioRepo.findByEmail!.mockResolvedValue({ usuario_id: 2 })

    const useCase = new UpdateProfileUseCase(
      usuarioRepo as IUsuarioRepository,
      clienteRepo as IClienteRepository,
    )

    await expect(
      useCase.execute({
        usuarioId,
        correo: 'existe@correo.com',
      } as any),
    ).rejects.toMatchObject({ code: 'EMAIL_TAKEN' })
  })
})
