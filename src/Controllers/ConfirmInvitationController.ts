import express, { Request, Response, Router } from 'express'
const db = require('../DAO/models')

// Función para verificar la conexión a la base de datos (mismo estilo que InviteUserController)
const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await db.sequelize.authenticate()
    console.log('✅ Conexión a la base de datos establecida correctamente')
    return true
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error)
    return false
  }
}

const ConfirmInvitationController = (): [string, Router] => {
  const path = '/api'
  const router = express.Router()

  router.post('/invitaciones/respond', async (req: Request, res: Response) => {
    try {
      // Verificar conexión a la DB
      const isConnected = await checkDatabaseConnection()
      if (!isConnected) return res.status(500).json({ success: false, message: 'Database connection error' })

      const { invitacion_usuario_id, accept } = req.body
      if (!invitacion_usuario_id || typeof accept !== 'boolean') {
        return res.status(400).json({ success: false, message: 'invitacion_usuario_id y accept son requeridos' })
      }

      // Cargar invitacion usuario con relaciones
      const invitacionUsuario = await db.InvitacionUsuario.findOne({
        where: { invitacion_usuario_id },
        include: [
          { model: db.Invitacion, as: 'invitacion', include: [{ model: db.Notificacion, as: 'notificacion', include: [{ model: db.Evento, as: 'evento' }] }] },
          { model: db.Usuario, as: 'usuario', include: [{ model: db.Cliente, as: 'cliente' }] },
          { model: db.EstadoInvitacion, as: 'estado' }
        ]
      })

      if (!invitacionUsuario) return res.status(404).json({ success: false, message: 'Invitación de usuario no encontrada' })

      const estadoActual = invitacionUsuario.estado?.nombre || ''
      if (estadoActual && estadoActual !== 'Pendiente') return res.status(400).json({ success: false, message: 'Ya respondió esta invitación' })

      const invitacion = invitacionUsuario.invitacion
      const notificacion = invitacion?.notificacion
      const evento = notificacion?.evento
      const usuario = invitacionUsuario.usuario
      const now = new Date()

      if (invitacion && invitacion.fechaLimite && new Date(invitacion.fechaLimite) < now) return res.status(400).json({ success: false, message: 'Invitación expirada' })

      if (evento && evento.fechaHora && new Date(evento.fechaHora) <= now) return res.status(400).json({ success: false, message: 'El evento ya comenzó' })

      if (evento) {
        const participantesCount = await db.EventoParticipante.count({ where: { evento_id: evento.evento_id } })
        const EVENT_MAX_CAPACITY = Number(process.env.EVENT_MAX_CAPACITY || 1000)
        if (accept && participantesCount >= EVENT_MAX_CAPACITY) return res.status(400).json({ success: false, message: 'El evento está lleno' })
      }

      if (accept && usuario) {
        const participanteRows = await db.Participante.findAll({ where: { usuario_id: usuario.usuario_id } })
        const participanteIds = participanteRows.map((p: any) => p.participante_id)
        let userEventCount = 0
        if (participanteIds.length) userEventCount = await db.EventoParticipante.count({ where: { participante_id: participanteIds } })
        const MAX_EVENTS_PER_USER = Number(process.env.MAX_EVENTS_PER_USER || 5)
        if (userEventCount >= MAX_EVENTS_PER_USER) return res.status(400).json({ success: false, message: 'Alcanzó el límite de eventos permitidos' })
      }

      const t = await db.sequelize.transaction()
      try {
        if (!accept) {
          const estadoRechazada = await db.EstadoInvitacion.findOne({ where: { nombre: 'Rechazada' } })
          if (estadoRechazada) invitacionUsuario.estado_invitacion_id = estadoRechazada.estado_id
          invitacionUsuario.confirmacion = true
          await invitacionUsuario.save({ transaction: t })
          await t.commit()
          return res.status(200).json({ success: true, message: 'Invitación rechazada' })
        }

        const rolAsistente = await db.Rol.findOne({ where: { nombre: 'ASISTENTE' } })
        let participante = await db.Participante.findOne({ where: { usuario_id: usuario.usuario_id, rol_id: rolAsistente ? rolAsistente.rol_id : 0 }, transaction: t })
        if (!participante) participante = await db.Participante.create({ usuario_id: usuario.usuario_id, rol_id: rolAsistente ? rolAsistente.rol_id : 1 }, { transaction: t })

        const existingLink = await db.EventoParticipante.findOne({ where: { evento_id: evento.evento_id, participante_id: participante.participante_id }, transaction: t })
        if (!existingLink) {
          await db.EventoParticipante.create({ evento_id: evento.evento_id, participante_id: participante.participante_id }, { transaction: t })
          await db.Evento.update({ nroParticipantes: (evento.nroParticipantes || 0) + 1 }, { where: { evento_id: evento.evento_id }, transaction: t })
        }

        const estadoAceptada = await db.EstadoInvitacion.findOne({ where: { nombre: 'Aceptada' } })
        if (estadoAceptada) invitacionUsuario.estado_invitacion_id = estadoAceptada.estado_id
        invitacionUsuario.confirmacion = true
        await invitacionUsuario.save({ transaction: t })

        await t.commit()
        return res.status(200).json({ success: true, message: 'Invitación aceptada' })
      } catch (txErr) {
        await t.rollback()
        console.error('Transaction error responding invitation:', txErr)
        return res.status(500).json({ success: false, message: 'Error procesando la respuesta' })
      }
    } catch (error) {
      console.error('Error responding invitation:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  })

  return [path, router]
}

export default ConfirmInvitationController
