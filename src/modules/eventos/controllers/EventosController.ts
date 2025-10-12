// src/modules/eventos/controllers/EventosController.ts
import express, { Request, Response, Router } from "express";
const db = require("../../../infrastructure/database/models");

export class EventosController {
  private router: Router;
  private path: string = "/api";

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/events/public", this.listPublic.bind(this));
  }

  private async listPublic(_req: Request, res: Response): Promise<void> {
    try {
      // Ajusta estos IDs a los de tu seed: 1 = Programado, 1 = Público
      const ID_ESTADO_PROGRAMADO = 1;
      const ID_PRIVACIDAD_PUBLICO = 1;

      const eventos = await db.Evento.findAll({
        attributes: [
          ["evento_id", "id"],
          ["titulo", "name"],
          ["fechaHora", "date"],
          ["imagen", "imageUrl"],
          [
            db.Sequelize.fn(
              "COUNT",
              db.Sequelize.col("participantes.EventoParticipante.participante_id")
            ),
            "attendeesCount",
          ],
        ],
        where: {
          estadoEvento: ID_ESTADO_PROGRAMADO,
          privacidad: ID_PRIVACIDAD_PUBLICO,
          fechaHora: { [db.Sequelize.Op.gte]: new Date() }, // Solo fechas >= hoy
        },
        include: [
          {
            model: db.Ubicacion,
            as: "ubicacion",
            attributes: [["direccion", "location"]],
            required: false,
          },
          {
            model: db.Participante,
            as: "participantes",
            attributes: [],
            required: false,
            through: { attributes: [] },
          },
        ],
        group: [
          "Evento.evento_id",
          "ubicacion.ubicacion_id",
          "ubicacion.direccion",
        ],
        order: [["fechaHora", "ASC"]],
        subQuery: false,
      });

      const payload = (eventos ?? []).map((ev: any) => ({
        id: ev.get("id"),
        name: ev.get("name"),
        date: ev.get("date"),
        imageUrl: ev.get("imageUrl"),
        attendeesCount: Number(ev.get("attendeesCount") ?? 0),
        location:
          ev?.ubicacion?.get?.("location") ??
          ev?.ubicacion?.direccion ??
          "Sin ubicación",
      }));

      res.json({ success: true, eventos: payload });
    } catch (err) {
      console.error("[EventosController] Error listando eventos:", err);
      res.status(500).json({ success: false, message: "Error interno" });
    }
  }

  public getRouter(): Router { return this.router; }
  public getPath(): string { return this.path; }
}
