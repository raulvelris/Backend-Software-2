import express, {Express, Request, Response, Router} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { InvitacionController } from "./modules/invitaciones/controllers/InvitacionController";

dotenv.config();

const app : Express = express()
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