import express, {Request, Response, Router} from "express"
const db = require("../DAO/models");

// Función para verificar la conexión a la base de datos
const checkDatabaseConnection = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
        return false;
    }
};

const InviteUserController = (): [String, Router] => {
    const path: string = "/api";
    const router = express.Router();
    
    // Endpoint para buscar usuarios por email
    router.get("/usuarios/search", async (req: Request, res: Response) => {
        try {
            const { query } = req.query;
            
            if (!query || typeof query !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: "Query parameter is required"
                });
            }

            // Verificar conexión a la base de datos
            const isConnected = await checkDatabaseConnection();
            if (!isConnected) {
                return res.status(500).json({
                    success: false,
                    message: "Database connection error"
                });
            }

            // Buscar usuarios por correo o nombre/apellido usando modelos (sin SQL crudo)
            const usuarios = await db.Usuario.findAll({
                include: [{
                    model: db.Cliente,
                    as: 'cliente',
                    attributes: ['nombre', 'apellido'],
                    required: false
                }],
                where: {
                    [db.Sequelize.Op.or]: [
                        { correo: { [db.Sequelize.Op.iLike ?? db.Sequelize.Op.like]: `%${query}%` } },
                        { '$cliente.nombre$': { [db.Sequelize.Op.iLike ?? db.Sequelize.Op.like]: `%${query}%` } },
                        { '$cliente.apellido$': { [db.Sequelize.Op.iLike ?? db.Sequelize.Op.like]: `%${query}%` } }
                    ]
                },
                attributes: ['usuario_id', 'correo'],
                limit: 10
            });

            res.json({
                success: true,
                usuarios: usuarios
            });

        } catch (error) {
            console.error("Error searching users:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    });

    // Endpoint para enviar invitación
    router.post("/invitaciones/send", async (req: Request, res: Response) => {
        try {
            const { evento_id, usuario_id, fechaLimite } = req.body;
            
            // Validar datos requeridos
            if (!evento_id || !usuario_id) {
                return res.status(400).json({
                    success: false,
                    message: "evento_id and usuario_id are required"
                });
            }

            // Verificar que el evento existe
            const evento = await db.Evento.findByPk(evento_id);
            if (!evento) {
                return res.status(404).json({
                    success: false,
                    message: "Event not found"
                });
            }

            // Verificar que el usuario existe
            const usuario = await db.Usuario.findByPk(usuario_id);
            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Verificar si ya existe una invitación para este usuario y evento
            const invitacionExistente = await db.InvitacionUsuario.findOne({
                include: [{
                    model: db.Invitacion,
                    where: { notificacion_id: { [db.Sequelize.Op.in]: 
                        await db.Notificacion.findAll({
                            where: { evento_id: evento_id },
                            attributes: ['notificacion_id']
                        }).then((notifs: any[]) => notifs.map(n => n.notificacion_id))
                    }}
                }],
                where: { usuario_id: usuario_id }
            });

            if (invitacionExistente) {
                return res.status(409).json({
                    success: false,
                    message: "Invitation already exists for this user and event"
                });
            }

            // Crear la notificación primero
            const nuevaNotificacion = await db.Notificacion.create({
                fechaHora: new Date(),
                evento_id: evento_id
            });

            // Crear la invitación
            const nuevaInvitacion = await db.Invitacion.create({
                notificacion_id: nuevaNotificacion.notificacion_id,
                fechaLimite: fechaLimite || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días por defecto
            });

            // Obtener el estado "pendiente" 
            const estadoPendiente = await db.EstadoInvitacion.findOne({
                where: { nombre: 'Pendiente' }
            });

            if (!estadoPendiente) {
                return res.status(500).json({
                    success: false,
                    message: "Estado 'Pendiente' not found in database"
                });
            }

            // Crear la invitación de usuario
            const nuevaInvitacionUsuario = await db.InvitacionUsuario.create({
                confirmacion: false,
                estado_invitacion_id: estadoPendiente.estado_id,
                invitacion_id: nuevaInvitacion.notificacion_id,
                usuario_id: usuario_id
            });

            res.status(201).json({
                success: true,
                message: "Invitation sent successfully",
                invitacion_id: nuevaInvitacionUsuario.invitacion_usuario_id
            });

        } catch (error) {
            console.error("Error sending invitation:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    });

    return [path, router];
}; 

export default InviteUserController;