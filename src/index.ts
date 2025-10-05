import express, {Express, Request, Response, Router} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app : Express = express()
app.use(cors({ origin: "*" }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(express.static("assets")) // Carpeta archivos estaticos
