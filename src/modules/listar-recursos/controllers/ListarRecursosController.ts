import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/config/DependencyContainer';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';

export class ListarRecursosController {
  private router: Router;
  private path: string = '/api';

  private listarRecursosUseCase = DependencyContainer.getListarRecursosUseCase();

  constructor() {
    this.router = express.Router();
    this.router.use(authMiddleware)
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /api/eventos/:id/recursos
    this.router.get('/eventos/:id/recursos', this.getRecursosForEvento.bind(this));
  }

  // Handler: Obtener recursos del evento
  private async getRecursosForEvento(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const eventoId = parseInt(id!, 10);
      
      if (isNaN(eventoId)) {
        res.status(400).json({ 
          success: false, 
          message: 'ID de evento no válido' 
        });
        return;
      }

      const recursos = await this.listarRecursosUseCase.execute({ evento_id: eventoId });
      
      res.status(200).json(recursos);
      
    } catch (error: any) {
      console.error('Error al obtener recursos del evento:', error);
      
      if (error.message === 'Event not found') {
        res.status(404).json({ 
          success: false, 
          message: 'Evento no encontrado'
        });
        return;
      }
      
      res.status(500).json({ 
        success: false, 
        message: 'Error al obtener recursos del evento'
      });
    }
  }

  // Método público para obtener el router configurado
  public getRouter(): Router {
    return this.router;
  }

  public getPath(): string {
    return this.path;
  }
}
