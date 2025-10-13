import express, {Express, Request, Response, Router} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { InvitacionController } from "./modules/invitaciones/controllers/InvitacionController";
import { VerParticipantesController } from "./modules/ver-participantes/controllers/VerParticipantesController";
import { ConfirmarInvitacionController } from "./modules/confirmar-invitacion/controllers/ConfirmarInvitacionController";
import { VerDetalleController } from "./modules/ver-detalle/controllers/VerDetalleController";
import { ConfirmarPublicoController } from "./modules/confirmar-publico/controllers/ConfirmarPublicoController";
import { VerInvitacionesPrivadasController } from "./modules/ver-invitaciones-privadas/controllers/VerInvitacionesPrivadasController";
import { RegistrarseController } from "./modules/registrarse/controllers/RegistrarseController";
import { ActivarCuentaController } from "./modules/activar-cuenta/controllers/ActivarCuentaController";
import { CreateEventoController } from "./modules/eventos-crear/controllers/CreateEventoController";
import { PublicEventsController } from "./modules/eventos-publicos/controllers/PublicEventsController";
import { ManagedEventsController } from "./modules/eventos-gestionados/controllers/ManagedEventsController";
import { AttendedEventsController } from "./modules/eventos-asistidos/controllers/AttendedEventsController";
import { AuthController } from "./modules/iniciar-sesion/controllers/AuthController";

dotenv.config();

const app = express()
app.use(cors({ origin: "*" }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(express.static("assets")) // Carpeta archivos estaticos

const port = process.env.PORT || 5000;

// Instanciar controladores usando POO
const registrarseController = new RegistrarseController();
app.use(registrarseController.getPath(), registrarseController.getRouter())

const activarCuentaController = new ActivarCuentaController();
app.use(activarCuentaController.getPath(), activarCuentaController.getRouter())

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

const verInvitacionesPrivadasController = new VerInvitacionesPrivadasController();
app.use(verInvitacionesPrivadasController.getPath(), verInvitacionesPrivadasController.getRouter());

const authController = new AuthController();
app.use(authController.getPath(), authController.getRouter());


app.listen(port, () => {
    console.log(`[Server]: Servidor ejecutandose en puerto ${port}`)
})

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});








