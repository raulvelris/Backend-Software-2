import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';
import { DeleteEventoUseCase } from '../use-cases/DeleteEventoUseCase';

export class DeleteEventoController {
  private router: Router;
  private path: string = '/api';
  private deleteEventoUseCase: DeleteEventoUseCase;

  constructor(deleteEventoUseCase: DeleteEventoUseCase) {
    this.router = express.Router();
    this.deleteEventoUseCase = deleteEventoUseCase;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.delete('/:id', this.delete.bind(this));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ 
          success: false,
          message: 'Se requiere el ID del evento' 
        });
        return;
      }

      const eventoId = parseInt(id, 10);
      if (isNaN(eventoId) || eventoId <= 0) {
        res.status(400).json({ 
          success: false,
          message: 'ID de evento no válido' 
        });
        return;
      }

      const result = await this.deleteEventoUseCase.execute(eventoId);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: unknown) {
      console.error('[DeleteEventoController] Error eliminando evento:', error);
      const message = error instanceof Error ? error.message : 'Error interno';
      res.status(500).json({ 
        success: false, 
        message: 'Error al procesar la solicitud',
        ...(process.env.NODE_ENV === 'development' && { details: message })
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
