import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';
import { UpdateEventoUseCase } from '../use-cases/UpdateEventoUseCase';

export class UpdateEventoController {
  private router: Router;
  private path: string = '/api/eventos/update';
  private updateEventoUseCase: UpdateEventoUseCase;
  
  constructor() {
    this.router = express.Router();
    this.updateEventoUseCase = DependencyContainer.getUpdateEventoUseCase();
    this.initializeRoutes();
  }

  public getPath(): string {
    return this.path;
  }

  public getRouter(): Router {
    return this.router;
  }

  private initializeRoutes(): void {
    this.router.put('/:id', this.update.bind(this));
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const eventData = req.body;
      
      // Validar que el ID exista y sea un número
      if (!id) {
        res.status(400).json({ success: false, message: 'ID de evento no proporcionado' });
        return;
      }
      
      const eventId = parseInt(id, 10);
      if (isNaN(eventId)) {
        res.status(400).json({ success: false, message: 'ID de evento no válido' });
        return;
      }

      // Validar datos del evento
      if (!eventData || Object.keys(eventData).length === 0) {
        res.status(400).json({ success: false, message: 'Datos del evento no proporcionados' });
        return;
      }

      // Llamar al caso de uso
      const result = await this.updateEventoUseCase.execute(eventId, eventData);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error en UpdateEventoController:', error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Error al actualizar el evento' 
      });
    }
  }
}

export default new UpdateEventoController();
