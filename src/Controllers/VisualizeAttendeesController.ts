import express, { Request, Response, Router } from 'express'
const db = require('../DAO/models')

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

const VisualizeAttendeesController = (): [string, Router] => {
  const path = '/api'
  const router = express.Router()

  // GET confirmed participants for an event
  router.get('/eventos/:evento_id/participantes', async (req: Request, res: Response) => {
    try {
      const isConnected = await checkDatabaseConnection()
      if (!isConnected) return res.status(500).json({ success: false, message: 'Database connection error' })

      const { evento_id } = req.params

      // Buscar registros en EventoParticipante y traer datos de Participante -> Usuario -> Cliente
      const links = await db.EventoParticipante.findAll({
        where: { evento_id },
        include: [
          {
            model: db.Participante,
            as: 'participante',
            include: [
              {
                model: db.Usuario,
                as: 'usuario',
                include: [{ model: db.Cliente, as: 'cliente' }]
              },
              { model: db.Rol, as: 'rol' }
            ]
          }
        ]
      })

      const participantes = links.map((l: any) => ({
        participante_id: l.participante.participante_id,
        usuario_id: l.participante.usuario.usuario_id,
        correo: l.participante.usuario.correo,
        nombre: l.participante.usuario.cliente?.nombre || '',
        apellido: l.participante.usuario.cliente?.apellido || '',
        rol: l.participante.rol?.nombre || ''
      }))

      return res.status(200).json({ success: true, participantes })
    } catch (error) {
      console.error('Error fetching participants by event:', error)
      return res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  })

  return [path, router]
}

export default VisualizeAttendeesController
