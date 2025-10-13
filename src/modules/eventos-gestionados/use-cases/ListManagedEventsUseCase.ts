export class ListManagedEventsUseCase {
  private db = require('../../../infrastructure/database/models')

  async execute(usuarioId: number) {
    const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)

    const eventos = await this.db.Evento.findAll({
      attributes: [
        ['evento_id', 'id'],
        ['titulo', 'name'],
        ['fechaInicio', 'dateStart'],
        ['fechaFin', 'dateEnd'],
        ['imagen', 'imageUrl'],
        ['aforo', 'capacity'],
      ],
      where: {
        fechaFin: { [this.db.Sequelize.Op.gt]: cutoff },
      },
      include: [
        {
          model: this.db.Participante,
          as: 'participantes',
          required: true,
          through: { attributes: [] },
          include: [
            { model: this.db.Usuario, as: 'usuario', required: true, where: { usuario_id: usuarioId } },
            { model: this.db.Rol, as: 'rol', required: true, where: { nombre: 'Organizador' } },
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
      capacity: ev.get('capacity'),
    }))

    return { success: true, eventos: payload }
  }
}
