export type ProfileResultDto = {
  success: boolean
  user: {
    usuario_id: number
    correo: string
    nombre: string | null
    apellido: string | null
    foto_perfil: string | null
  }
}

export type UpdateProfileParamsDto = {
  usuarioId: number
  correo?: string
  nombre?: string
  apellido?: string
  foto_perfil?: string | null
}
