import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';

export class DesvincularController {
  private router: Router;
  private path: string = '/api';

  private desvincularUseCase = DependencyContainer.getDesvincularUseCase();

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
  // Endpoint para que un participante se desvincule del evento (nuevo nombre: desvincular-evento)
  this.router.post('/eventos/:evento_id/desvincular-evento', this.desvincular.bind(this));
  }

  private async desvincular(req: Request, res: Response): Promise<void> {
    try {
      const { evento_id } = req.params;
      const { usuario_id } = req.body;

      const result = await this.desvincularUseCase.execute({
        evento_id: Number(evento_id),
        usuario_id
      });

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Error en DesvincularController:', error);
      if (error.message === 'Evento no encontrado') {
        res.status(404).json({ success: false, message: error.message });
        return;
      }
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPath(): string {
    return this.path;
  }
}
