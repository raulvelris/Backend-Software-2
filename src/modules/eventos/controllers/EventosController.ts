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
    this.router.get("/events/attended/:usuario_id", this.listAttendedByUser.bind(this));
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
          ["fechaInicio", "dateStart"],
          ["fechaFin", "dateEnd"],
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
          fechaFin: { [db.Sequelize.Op.gte]: new Date() }, // Eventos no finalizados
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
        order: [["fechaInicio", "ASC"]],
        subQuery: false,
      });

      const payload = (eventos ?? []).map((ev: any) => ({
        id: ev.get("id"),
        name: ev.get("name"),
        dateStart: ev.get("dateStart"),
        dateEnd: ev.get("dateEnd"),
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

  private async listAttendedByUser(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = Number(req.params.usuario_id);
      if (!usuarioId || Number.isNaN(usuarioId)) {
        res.status(400).json({ success: false, message: "Invalid user id" });
        return;
      }

      const eventos = await db.Evento.findAll({
        attributes: [
          ["evento_id", "id"],
          ["titulo", "name"],
          ["fechaInicio", "dateStart"],
          ["fechaFin", "dateEnd"],
          ["imagen", "imageUrl"],
        ],
        include: [
          {
            model: db.Participante,
            as: "participantes",
            required: true,
            through: { attributes: [] },
            include: [
              {
                model: db.Usuario,
                as: "usuario",
                required: true,
                where: { usuario_id: usuarioId },
              },
            ],
          },
        ],
        order: [["fechaInicio", "ASC"]],
        subQuery: false,
      });

      const payload = (eventos ?? []).map((ev: any) => ({
        id: ev.get("id"),
        name: ev.get("name"),
        dateStart: ev.get("dateStart"),
        dateEnd: ev.get("dateEnd"),
        imageUrl: ev.get("imageUrl"),
      }));

      res.json({ success: true, eventos: payload });
    } catch (err) {
      console.error("[EventosController] Error listando asistidos:", err);
      res.status(500).json({ success: false, message: "Error interno" });
    }
  }
}
