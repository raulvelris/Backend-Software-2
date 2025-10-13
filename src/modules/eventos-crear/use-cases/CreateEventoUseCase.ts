import { CrearEventoDto } from '../dtos/CrearEventoDto'

export class CreateEventoUseCase {
  private db = require('../../../infrastructure/database/models')

  async execute(input: CrearEventoDto) {
    const {
      name,
      date,
      capacity,
      description,
      privacy,
      ownerId,
      locationAddress,
      imageUrl,
      lat,
      lng,
    } = input

    if (!name || !date || !capacity || !ownerId) {
      throw new Error('Missing required fields')
    }

    if (Number(capacity) < 1 || Number(capacity) > 100) {
      throw new Error('Capacity must be between 1 and 100')
    }

    if (!imageUrl || String(imageUrl).trim().length === 0) {
      throw new Error('Image is required')
    }

    // Nombre único (case-insensitive)
    const lower = String(name).toLowerCase()
    const exists = await this.db.Evento.findOne({
      where: this.db.Sequelize.where(
        this.db.Sequelize.fn('LOWER', this.db.Sequelize.col('titulo')),
        this.db.Sequelize.Op.eq,
        lower
      )
    })
    if (exists) {
      throw new Error('Event name must be unique')
    }

    const fechaInicio = new Date(date)
    if (!(fechaInicio instanceof Date) || Number.isNaN(fechaInicio.getTime())) {
      throw new Error('Invalid date')
    }

    // Validar que esté en Lima por dirección o bounding box
    const isLimaByText = /lima/i.test(String(locationAddress || ''))
    const isLimaByCoords = typeof lat === 'number' && typeof lng === 'number'
      && lat >= -12.5 && lat <= -11.7 && lng >= -77.3 && lng <= -76.6
    if (!isLimaByText && !isLimaByCoords) {
      throw new Error('Location must be within Lima')
    }

    const ID_ESTADO_PROGRAMADO = 1
    const ID_PRIVACIDAD_PUBLICO = 1
    const ID_PRIVACIDAD_PRIVADO = 2

    const privacidadId = (String(privacy || '').toLowerCase() === 'private')
      ? ID_PRIVACIDAD_PRIVADO
      : ID_PRIVACIDAD_PUBLICO

    // Límite por usuario: máximo 5 eventos como Organizador
    const existingCount = await this.db.Evento.count({
      include: [
        {
          model: this.db.Participante,
          as: 'participantes',
          required: true,
          through: { attributes: [] },
          include: [
            { model: this.db.Usuario, as: 'usuario', required: true, where: { usuario_id: ownerId } },
            { model: this.db.Rol, as: 'rol', required: true, where: { nombre: 'Organizador' } },
          ],
        },
      ],
      distinct: true,
      col: 'evento_id',
    })

    if (existingCount >= 5) {
      throw new Error('You reached your event limit')
    }

    const nuevo = await this.db.sequelize.transaction(async (t: any) => {
      const evento = await this.db.Evento.create({
        titulo: name,
        descripcion: description ?? null,
        fechaInicio,
        fechaFin: new Date(fechaInicio.getTime() + 24 * 60 * 60 * 1000),
        imagen: imageUrl ?? null,
        nroParticipantes: 0,
        aforo: Number(capacity),
        estadoEvento: ID_ESTADO_PROGRAMADO,
        privacidad: privacidadId,
      }, { transaction: t })

      const direccion = locationAddress || ''
      if (direccion) {
        await this.db.Ubicacion.create({
          direccion,
          latitud: lat ?? null,
          longitud: lng ?? null,
          evento_id: evento.evento_id,
        }, { transaction: t })
      }

      const rolOrganizador = await this.db.Rol.findOne({ where: { nombre: 'Organizador' }, transaction: t })
      const rolId = rolOrganizador?.rol_id ?? 1
      let participante = await this.db.Participante.findOne({ where: { usuario_id: ownerId, rol_id: rolId }, transaction: t })
      if (!participante) {
        participante = await this.db.Participante.create({ usuario_id: ownerId, rol_id: rolId }, { transaction: t })
      }

      await this.db.EventoParticipante.create({ evento_id: evento.evento_id, participante_id: participante.participante_id }, { transaction: t })

      return evento
    })

    return { success: true, evento: { id: nuevo.evento_id } }
  }
}
