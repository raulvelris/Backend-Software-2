import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';

export class EliminarRecursoController {
  private router: Router;
  private path: string = '/api';

  private eliminarRecursoUseCase = DependencyContainer.getEliminarRecursoUseCase();

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.delete('/recursos/:recurso_id', this.eliminarRecurso.bind(this));
  }

  private async eliminarRecurso(req: Request, res: Response): Promise<void> {
    try {
      const { recurso_id } = req.params;
      
      await this.eliminarRecursoUseCase.execute({
        recurso_id: Number(recurso_id)
      });

      res.status(200).json({ success: true });
    } catch (error: any) {
      const msg = String(error?.message || 'Internal error');
      
      if (msg === 'Recurso no encontrado') {
        res.status(404).json({ success: false, message: msg });
        return;
      }
      
      res.status(500).json({ success: false, message: 'Error al eliminar el recurso' });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
