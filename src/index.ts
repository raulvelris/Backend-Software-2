import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { InvitacionController } from "./modules/envio-invitaciones/controllers/InvitacionController";
import { VerParticipantesController } from "./modules/ver-participantes/controllers/VerParticipantesController";
import { ConfirmarInvitacionController } from "./modules/confirmar-invitacion/controllers/ConfirmarInvitacionController";
import { VerDetalleController } from "./modules/ver-detalle/controllers/VerDetalleController";
import { ConfirmarPublicoController } from "./modules/confirmar-publico/controllers/ConfirmarPublicoController";
import { VerInvitacionesPrivadasController } from "./modules/ver-invitaciones-privadas/controllers/VerInvitacionesPrivadasController";
import { VerNotificacionesAccionController } from "./modules/ver-notificaciones-accion/controllers/VerNotificacionesAccionController";
import { RegistrarseController } from "./modules/registrarse/controllers/RegistrarseController";
import { ActivarCuentaController } from "./modules/activar-cuenta/controllers/ActivarCuentaController";
import { CreateEventoController } from "./modules/eventos-crear/controllers/CreateEventoController";
import { PublicEventsController } from "./modules/eventos-publicos/controllers/PublicEventsController";
import { ManagedEventsController } from "./modules/eventos-gestionados/controllers/ManagedEventsController";
import { AttendedEventsController } from "./modules/eventos-asistidos/controllers/AttendedEventsController";
import { AuthController } from "./modules/iniciar-sesion/controllers/AuthController";
import { EventoRecursosController } from "./modules/eventos-recursos/controllers/EventoRecursosController";
import { ListarRecursosController } from "./modules/listar-recursos/controllers/ListarRecursosController";
import { SubirRecursoController } from "./modules/subir-recurso/controllers/SubirRecursoController";
import { ProfileController } from "./modules/gestion-perfil/controllers/ProfileController";
import { DeleteEventoController } from "./modules/eventos-eliminar/controllers/DeleteEventoController";
import { VerCoordenadasController } from "./modules/evento-coordenada/controllers/VerCoordenadasController";

const db = require("./infrastructure/database/models");

dotenv.config();

const app = express()

// Configurar CORS para permitir el frontend
const allowedOrigins = [
    'https://evento-maestro.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

console.log('🔐 CORS configurado para los siguientes orígenes:', allowedOrigins);

app.use(cors({ 
    origin: (origin, callback) => {
        // Permitir requests sin origin (como Postman, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('❌ Origen bloqueado por CORS:', origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-JSON'],
    maxAge: 86400 // 24 horas
}));

// Body parser solo para JSON y urlencoded, NO para multipart/form-data (eso lo maneja multer)
// IMPORTANTE: El bodyParser debe estar ANTES de las rutas para que funcione correctamente
// Pero debe saltar multipart/form-data para que multer lo procese
// Usar un middleware condicional para asegurar que multipart/form-data no se procese
app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    
    // Si es multipart/form-data, NO usar bodyParser en absoluto
    if (contentType.includes('multipart/form-data')) {
        return next();
    }
    
    // Si no es multipart, usar bodyParser normalmente
    bodyParser.json({ limit: '3mb' })(req, res, () => {
        bodyParser.urlencoded({ extended: true, limit: '3mb' })(req, res, next);
    });
});
app.use(express.static("assets")) // Carpeta archivos estaticos

const port = process.env.PORT || 5000;

// Instanciar controladores usando POO
const registrarseController = new RegistrarseController();
app.use(registrarseController.getPath(), registrarseController.getRouter())

const activarCuentaController = new ActivarCuentaController();
app.use(activarCuentaController.getPath(), activarCuentaController.getRouter())

const authController = new AuthController();
app.use(authController.getPath(), authController.getRouter());

const profileController = new ProfileController();
app.use(profileController.getPath(), profileController.getRouter());

const invitacionController = new InvitacionController();
app.use(invitacionController.getPath(), invitacionController.getRouter())

const verDetalleController = new VerDetalleController();
app.use(verDetalleController.getPath(), verDetalleController.getRouter())

const confirmarPublicoController = new ConfirmarPublicoController();
app.use(confirmarPublicoController.getPath(), confirmarPublicoController.getRouter())

const verParticipantesController = new VerParticipantesController();
app.use(verParticipantesController.getPath(), verParticipantesController.getRouter())

const confirmarInvitacionController = new ConfirmarInvitacionController();
app.use(confirmarInvitacionController.getPath(), confirmarInvitacionController.getRouter())

const createEventoController = new CreateEventoController();
app.use(createEventoController.getPath(), createEventoController.getRouter());

const publicEventsController = new PublicEventsController();
app.use(publicEventsController.getPath(), publicEventsController.getRouter());

const managedEventsController = new ManagedEventsController();
app.use(managedEventsController.getPath(), managedEventsController.getRouter());

const attendedEventsController = new AttendedEventsController();
app.use(attendedEventsController.getPath(), attendedEventsController.getRouter());

// Agregar controlador para listar recursos de eventos (GET)
const listarRecursosController = new ListarRecursosController();
app.use(listarRecursosController.getPath(), listarRecursosController.getRouter());
console.log('✅ ListarRecursosController registrado en /api');

// Agregar controlador para crear recursos de eventos (POST)
const eventoRecursosController = new EventoRecursosController();
app.use('/api/eventos', eventoRecursosController.getRouter());
console.log('✅ EventoRecursosController registrado en /api/eventos');

// Nota: SubirRecursoController está duplicado - EventoRecursosController ya maneja POST
// const subirRecursoController = new SubirRecursoController();
// app.use(subirRecursoController.getPath(), subirRecursoController.getRouter());

const verInvitacionesPrivadasController = new VerInvitacionesPrivadasController();
app.use(verInvitacionesPrivadasController.getPath(), verInvitacionesPrivadasController.getRouter());

const verNotificacionesAccionController = new VerNotificacionesAccionController();
app.use(verNotificacionesAccionController.getPath(), verNotificacionesAccionController.getRouter());

const deleteEventoController = new DeleteEventoController();
app.use(deleteEventoController.getPath(), deleteEventoController.getRouter());

const verCoordenadasController = new VerCoordenadasController();
app.use(verCoordenadasController.getPath(), verCoordenadasController.getRouter());

// Conectar a la base de datos y sincronizar
const startServer = async () => {
    try {
        console.log('🔄 Iniciando conexión a la base de datos...');
        console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
        console.log('🔧 DATABASE_URL presente:', !!process.env.DATABASE_URL);
        
        // Autenticar conexión
        await db.sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente');
        
        // Sincronizar modelos (crear tablas si no existen)
        await db.sequelize.sync({ alter: false });
        console.log('✅ Modelos sincronizados con la base de datos');
        
        // Iniciar servidor
        app.listen(port, () => {
            console.log(`✅ [Server]: Servidor ejecutandose en puerto ${port}`)
        });
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
        console.error('❌ Detalles del error:', JSON.stringify(error, null, 2));
        process.exit(1);
    }
};

console.log('🚀 Iniciando aplicación...');
startServer();

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});














