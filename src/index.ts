import express, {Express, Request, Response, Router} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { InvitacionController } from "./modules/invitaciones/controllers/InvitacionController";
import { EventosController } from "./modules/eventos/controllers/EventosController";
import { AsistenciasController } from "./modules/asistencias/controllers/AsistenciasController";

dotenv.config();

const app = express()
app.use(cors({ origin: "*" }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(express.static("assets")) // Carpeta archivos estaticos

const port = process.env.PORT || 5000;

// Instanciar controlador usando POO
const invitacionController = new InvitacionController();
app.use(invitacionController.getPath(), invitacionController.getRouter())
const eventosController = new EventosController();
app.use(eventosController.getPath(), eventosController.getRouter())
const asistenciasController = new AsistenciasController();
app.use(asistenciasController.getPath(), asistenciasController.getRouter())

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