export class ListAttendedEventsUseCase {
  private db = require('../../../infrastructure/database/models')

  async execute(usuarioId: number) {
    const eventos = await this.db.Evento.findAll({
      attributes: [
        ['evento_id', 'id'],
        ['titulo', 'name'],
        ['fechaInicio', 'dateStart'],
        ['fechaFin', 'dateEnd'],
        ['imagen', 'imageUrl'],
      ],
      include: [
        {
          model: this.db.Participante,
          as: 'participantes',
          required: true,
          through: { attributes: [] },
          include: [
            { model: this.db.Usuario, as: 'usuario', required: true, where: { usuario_id: usuarioId } },
          ],
        },
      ],
      order: [['fechaInicio', 'ASC']],
      subQuery: false,
    })

    const payload = (eventos ?? []).map((ev: any) => ({
      id: ev.get('id'),
      name: ev.get('name'),
      dateStart: ev.get('dateStart'),
      dateEnd: ev.get('dateEnd'),
      imageUrl: ev.get('imageUrl'),
    }))

    return { success: true, eventos: payload }
  }
}
