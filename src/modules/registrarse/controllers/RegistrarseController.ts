import express, { Request, Response, Router } from "express";
import { DependencyContainer } from "../../../shared/utils/DependencyContainer";

export class RegistrarseController {
  private router: Router;
  private path: string = "/api/auth";

  private registrarUsuarioUseCase = DependencyContainer.getRegistrarUsuarioUseCase();

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/register", this.registrarUsuario.bind(this));
  }

  private async registrarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { correo, clave, nombre, apellido } = req.body;

      const result = await this.registrarUsuarioUseCase.execute({
        correo,
        clave,
        nombre,
        apellido
      });

      res.status(201).json(result);
    } catch (error: any) {
      console.error("Error al registrar usuario:", error);

      if (
        error.message.includes('requeridos') ||
        error.message.includes('inválido') ||
        error.message.includes('debe tener') ||
        error.message.includes('no puede exceder')
      ) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }

      if (error.message.includes('ya está registrado')) {
        res.status(409).json({
          success: false,
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPath(): string {
    return this.path;
  }
}
