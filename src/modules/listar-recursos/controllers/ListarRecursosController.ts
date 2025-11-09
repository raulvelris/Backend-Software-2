import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';

export class ListarRecursosController {
  private router: Router;
  private path: string = '/api';

  private listarRecursosUseCase = DependencyContainer.getListarRecursosUseCase();

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/eventos/:evento_id/recursos', this.listarRecursos.bind(this));
  }

  private async listarRecursos(req: Request, res: Response): Promise<void> {
    try {
      const { evento_id } = req.params;
      
      const recursos = await this.listarRecursosUseCase.execute({
        evento_id: Number(evento_id)
      });

      res.status(200).json(recursos);
    } catch (error: any) {
      const msg = String(error?.message || 'Internal error');
      
      if (msg === 'Event not found') {
        res.status(404).json({ success: false, message: msg });
        return;
      }
      
      res.status(500).json({ success: false, message: 'Error al listar los recursos' });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
