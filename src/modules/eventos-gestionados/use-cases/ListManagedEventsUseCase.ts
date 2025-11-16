import { IEventoRepository } from '../../../domain/interfaces/IEventoRepository'

export class ListManagedEventsUseCase {
  constructor(
    private eventoRepository: IEventoRepository
  ) {}

  async execute(usuarioId: number) {
    const eventos = await this.eventoRepository.findManagedEventsByUsuario(usuarioId)

    const payload = (eventos ?? []).map((ev: any) => {
      const id = ev.get('id')
      const name = ev.get('name')
      const dateStart = ev.get('dateStart')
      const dateEnd = ev.get('dateEnd')
      const imageUrl = ev.get('imageUrl')
      const capacity = ev.get('capacity')
      const roleName = Array.isArray(ev.participantes) && ev.participantes[0]?.rol?.nombre
        ? String(ev.participantes[0].rol.nombre)
        : null
      return {
        id,
        name,
        dateStart,
        dateEnd,
        imageUrl,
        capacity,
        managedAs: roleName, // 'Organizador' | 'Coorganizador'
        isOrganizer: roleName === 'Organizador',
      }
    })

    return { success: true, eventos: payload }
  }
}
