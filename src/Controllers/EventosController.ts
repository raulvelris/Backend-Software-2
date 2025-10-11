import express, { Request, Response, Router } from "express";
const db = require("../DAO/models");

const EventosController = (): [string, Router] => {
  const path: string = "/api";
  const router = express.Router();

  // GET /api/eventos  → lista los eventos públicos para la tarjeta del FRONT
  router.get("/eventos", async (_req: Request, res: Response) => {
    try {
      const eventos = await db.Evento.findAll({
        attributes: [
          ["evento_id", "id"],
          ["titulo", "name"],
          ["fechaHora", "date"],

          // Número de asistentes (en tabla puente EventoParticipante)
          [
            db.Sequelize.literal(
              `(SELECT COUNT(*)::int FROM "EventoParticipante" ep WHERE ep.evento_id = "Evento".evento_id)`
            ),
            "attendeesCount",
          ],

          // Ubicación (columna real: direccion)
          [
            db.Sequelize.literal(
              `(SELECT COALESCE(u."direccion", '')
                 FROM "Ubicacion" u
                WHERE u.evento_id = "Evento".evento_id
                LIMIT 1)`
            ),
            "location",
          ],

          // Imagen (columna real en Evento: imagen)
          ["imagen", "imageUrl"],
        ],
        order: [["fechaHora", "ASC"]],
      });

      res.json({ success: true, eventos });
    } catch (err) {
      console.error("Error listando eventos:", err);
      res.status(500).json({ success: false, message: "Error interno" });
    }
  });

  return [path, router];
};

export default EventosController;
