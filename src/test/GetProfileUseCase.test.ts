import { GetProfileUseCase } from '../modules/gestion-perfil/use-cases/GetProfileUseCase'
import { IUsuarioRepository } from '../domain/interfaces/IUsuarioRepository'

class FakeUsuarioRepository implements Partial<IUsuarioRepository> {
  public findById = jest.fn()
  public findByEmail = jest.fn()
  public findByActivationToken = jest.fn()
  public searchActiveByQuery = jest.fn()
  public create = jest.fn()
  public update = jest.fn()
  public delete = jest.fn()
}

describe('GetProfileUseCase', () => {
  it('retorna el perfil correctamente cuando el usuario existe', async () => {
    const usuarioRepo = new FakeUsuarioRepository()

    usuarioRepo.findById!.mockResolvedValue({
      usuario_id: 1,
      correo: 'user@test.com',
      cliente: {
        nombre: 'Juan',
        apellido: 'Pérez',
        foto_perfil: 'http://example.com/avatar.png',
      },
    })

    const useCase = new GetProfileUseCase(usuarioRepo as IUsuarioRepository)

    const result = await useCase.execute(1)

    expect(usuarioRepo.findById).toHaveBeenCalledWith(1)
    expect(result.success).toBe(true)
    expect(result.user).toEqual({
      usuario_id: 1,
      correo: 'user@test.com',
      nombre: 'Juan',
      apellido: 'Pérez',
      foto_perfil: 'http://example.com/avatar.png',
    })
  })

  it('soporta valores nulos en los datos de cliente', async () => {
    const usuarioRepo = new FakeUsuarioRepository()

    usuarioRepo.findById!.mockResolvedValue({
      usuario_id: 2,
      correo: 'nulls@test.com',
      cliente: {
        nombre: null,
        apellido: undefined,
        foto_perfil: null,
      },
    })

    const useCase = new GetProfileUseCase(usuarioRepo as IUsuarioRepository)

    const result = await useCase.execute(2)

    expect(result.success).toBe(true)
    expect(result.user).toEqual({
      usuario_id: 2,
      correo: 'nulls@test.com',
      nombre: null,
      apellido: null,
      foto_perfil: null,
    })
  })

  it('lanza error si el usuario no existe', async () => {
    const usuarioRepo = new FakeUsuarioRepository()

    usuarioRepo.findById!.mockResolvedValue(null)

    const useCase = new GetProfileUseCase(usuarioRepo as IUsuarioRepository)

    await expect(useCase.execute(999)).rejects.toThrow('Usuario no encontrado')
  })
})
