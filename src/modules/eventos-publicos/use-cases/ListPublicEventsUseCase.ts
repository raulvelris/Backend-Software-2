export class ListPublicEventsUseCase {
  private db = require('../../../infrastructure/database/models')

  async execute() {
    const ID_ESTADO_PROGRAMADO = 1
    const ID_PRIVACIDAD_PUBLICO = 1

    const eventos = await this.db.Evento.findAll({
      attributes: [
        ['evento_id', 'id'],
        ['titulo', 'name'],
        ['fechaInicio', 'dateStart'],
        ['fechaFin', 'dateEnd'],
        ['imagen', 'imageUrl'],
        [
          this.db.Sequelize.fn(
            'COUNT',
            this.db.Sequelize.col('participantes.EventoParticipante.participante_id')
          ),
          'attendeesCount',
        ],
      ],
      where: {
        estadoEvento: ID_ESTADO_PROGRAMADO,
        privacidad: ID_PRIVACIDAD_PUBLICO,
        fechaFin: { [this.db.Sequelize.Op.gte]: new Date() },
      },
      include: [
        {
          model: this.db.Ubicacion,
          as: 'ubicacion',
          attributes: [['direccion', 'location']],
          required: false,
        },
        {
          model: this.db.Participante,
          as: 'participantes',
          attributes: [],
          required: false,
          through: { attributes: [] },
        },
      ],
      group: ['Evento.evento_id', 'ubicacion.ubicacion_id', 'ubicacion.direccion'],
      order: [['fechaInicio', 'ASC']],
      subQuery: false,
    })

    const payload = (eventos ?? []).map((ev: any) => ({
      id: ev.get('id'),
      name: ev.get('name'),
      dateStart: ev.get('dateStart'),
      dateEnd: ev.get('dateEnd'),
      imageUrl: ev.get('imageUrl'),
      attendeesCount: Number(ev.get('attendeesCount') ?? 0),
      location: ev?.ubicacion?.get?.('location') ?? ev?.ubicacion?.direccion ?? 'Sin ubicación',
    }))

    return { success: true, eventos: payload }
  }
}
