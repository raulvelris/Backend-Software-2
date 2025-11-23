import { IUsuarioRepository } from '../../../domain/interfaces/IUsuarioRepository'
import { ProfileResultDto } from '../dtos/ProfileResultDto'

export class GetProfileUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(usuarioId: number): Promise<ProfileResultDto> {
    const user = await this.usuarioRepository.findById(usuarioId)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    return {
      success: true,
      user: {
        usuario_id: user.usuario_id,
        correo: user.correo,
        nombre: user.cliente?.nombre ?? null,
        apellido: user.cliente?.apellido ?? null,
        foto_perfil: user.cliente?.foto_perfil ?? null,
      },
    }
  }
}
