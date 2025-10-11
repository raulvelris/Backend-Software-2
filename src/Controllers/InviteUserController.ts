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
    
    // 1.Endpoint para buscar usuarios por email
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
                    required: true
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

    // 2. Endpoint para enviar invitación
    router.post("/invitaciones/send", async (req: Request, res: Response) => {
        try {
            const { evento_id, usuario_ids, fechaLimite } = req.body;

            // Validar datos requeridos
            if (!evento_id || !Array.isArray(usuario_ids) || usuario_ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "evento_id y usuario_ids son requeridos"
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

            // Obtener estado "Pendiente"
            const estadoPendiente = await db.EstadoInvitacion.findOne({
                where: { nombre: 'Pendiente' }
            });
            if (!estadoPendiente) {
                return res.status(500).json({
                    success: false,
                    message: "Estado 'Pendiente' not found in database"
                });
            }

            // CONTAR invitaciones pendientes existentes para este evento
            const pendientesActuales = await db.InvitacionUsuario.count({
                include: [{
                    model: db.Invitacion,
                    as: "invitacion",
                    required: true,
                    include: [{
                        model: db.Notificacion,
                        as: "notificacion",
                        required: true,
                        where: { evento_id }
                    }]
                }],
                where: { estado_invitacion_id: estadoPendiente.estado_id }
            }); // cambio: conteo previo al envío

            const LIMITE_PENDIENTES = 50; // cambio: límite fijo
            const cupoDisponible = LIMITE_PENDIENTES - pendientesActuales;

            // CAMBIO: Validación para que el grupo no exceda el cupo disponible
            if (usuario_ids.length > cupoDisponible) {
                return res.status(400).json({
                    success: false,
                    message: `No se pueden enviar ${usuario_ids.length} invitaciones. Solo quedan ${cupoDisponible} disponibles.`
                });
            }

            // Filtrar usuarios que NO tienen invitación para este evento
            const usuariosNoInvitados: number[] = [];
            const resultados: any[] = [];

            for (const usuario_id of usuario_ids) {
                const usuario = await db.Usuario.findByPk(usuario_id);
                if (!usuario) {
                    resultados.push({ usuario_id, status: 'User not found' });
                    continue;
                }

                const invitacionExistente = await db.InvitacionUsuario.findOne({
                    where: { usuario_id },
                    include: [{
                        model: db.Invitacion,
                        as: 'invitacion',
                        required: true,
                        include: [{
                            model: db.Notificacion,
                            as: 'notificacion',
                            required: true,
                            where: { evento_id }
                        }]
                    }]
                });

                if (invitacionExistente) {
                    resultados.push({ usuario_id, status: 'Already invited' });
                    continue;
                }

                usuariosNoInvitados.push(usuario_id);
            }

            // Si no hay usuarios nuevos, no crear Notificacion ni Invitacion
            if (usuariosNoInvitados.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: 'Todos los usuarios ya estaban invitados',
                    resultados
                });
            }

            // Crear Notificacion + Invitacion solo para los usuarios nuevos
            const nuevaNotificacion = await db.Notificacion.create({
                fechaHora: new Date(),
                evento_id
            });

            const nuevaInvitacion = await db.Invitacion.create({
                notificacion_id: nuevaNotificacion.notificacion_id,
                fechaLimite: fechaLimite || new Date(Date.now() + 7*24*60*60*1000)
            });

            // Crear InvitacionUsuario solo para los usuarios no invitados
            for (const usuario_id of usuariosNoInvitados) {
                const nuevaInvitacionUsuario = await db.InvitacionUsuario.create({
                    confirmacion: false,
                    estado_invitacion_id: estadoPendiente.estado_id,
                    invitacion_id: nuevaInvitacion.notificacion_id,
                    usuario_id
                });

                resultados.push({
                    usuario_id,
                    status: 'Invitation sent',
                    invitacion_usuario_id: nuevaInvitacionUsuario.invitacion_usuario_id
                });
            }

            res.status(201).json({
                success: true,
                notificacion_id: nuevaNotificacion.notificacion_id,
                resultados
            });

        } catch (error) {
            console.error("Error sending invitation:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    });

    // 3. Obtener invitados por evento
    router.get("/invitaciones/evento/:evento_id", async (req: Request, res: Response) => {
        try {
        const { evento_id } = req.params;

        const invitados = await db.InvitacionUsuario.findAll({
            include: [
            {
                model: db.Invitacion,
                as: "invitacion",
                required: true,
                include: [
                {
                    model: db.Notificacion,
                    as: "notificacion",
                    required: true,
                    where: { evento_id },
                    attributes: [],
                },
                ],
                attributes: [],
            },
            {
                model: db.Usuario,
                as: "usuario",
                attributes: ["usuario_id", "correo"],
                required: true,
                include: [
                {
                    model: db.Cliente,
                    as: "cliente",
                    attributes: ["nombre", "apellido"],
                    required: true
                },
                ],
            },
            ],
        });

        const resultado = invitados.map((i: any) => ({
            usuario_id: i.usuario.usuario_id,
            correo: i.usuario.correo,
            nombre: i.usuario.cliente?.nombre || "",
            apellido: i.usuario.cliente?.apellido || "",
        }));

        res.status(200).json({ success: true, invitados: resultado });
        } catch (error) {
        console.error("Error al obtener invitados:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener invitados",
        });
        }
    });

    // 4. Contar invitaciones pendientes por evento
    router.get("/invitaciones/count/:evento_id", async (req: Request, res: Response) => {
        try {
            const { evento_id } = req.params;
            console.log("📢 Evento actual:", evento_id);

            // Obtener estado "Pendiente"
            const estadoPendiente = await db.EstadoInvitacion.findOne({
                where: { nombre: 'Pendiente' }
            });
            if (!estadoPendiente) {
                return res.status(500).json({
                    success: false,
                    message: "Estado 'Pendiente' no encontrado"
                });
            }

            // Contar invitaciones pendientes
            const pendientes = await db.InvitacionUsuario.count({
                include: [{
                    model: db.Invitacion,
                    as: "invitacion",
                    required: true,
                    include: [{
                        model: db.Notificacion,
                        as: "notificacion",
                        required: true,
                        where: { evento_id }
                    }]
                }],
                where: { estado_invitacion_id: estadoPendiente.estado_id }
            });

            res.status(200).json({
                success: true,
                pendientes,
                limite: 50 // límite fijo
            });
        } catch (error) {
            console.error("Error al obtener conteo de invitaciones:", error);
            res.status(500).json({
                success: false,
                message: "Error al obtener conteo de invitaciones"
            });
        }
    });

    // NOTE: moved invitation response handling to ConfirmInvitationController

    return [path, router];
}; 

export default InviteUserController;