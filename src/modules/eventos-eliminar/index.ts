import { Router } from 'express';
import { DeleteEventoController } from './controllers/DeleteEventoController';
import { EventoRepository } from '../../infrastructure/repositories/EventoRepository';
import { UbicacionRepository } from '../../infrastructure/repositories/UbicacionRepository';
import { EventoParticipanteRepository } from '../../infrastructure/repositories/EventoParticipanteRepository';
import { DeleteEventoUseCase } from './use-cases/DeleteEventoUseCase';

export class DeleteEventoModule {
  private router: Router;
  private controller: DeleteEventoController;
  private path = '/api/eventos';

  constructor() {
    const eventoRepository = new EventoRepository();
    const ubicacionRepository = new UbicacionRepository();
    const eventoParticipanteRepository = new EventoParticipanteRepository();
    
    const deleteEventoUseCase = new DeleteEventoUseCase(
      eventoRepository,
      ubicacionRepository,
      eventoParticipanteRepository
    );
    
    this.controller = new DeleteEventoController(deleteEventoUseCase);
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.delete(
      '/:id',
      this.controller.delete.bind(this.controller)
    );
  }

  public getRouter(): Router {
    return this.router;
  }

  public getPath(): string {
    return this.path;
  }
}

// Exportar una instancia del módulo
export const deleteEventoModule = new DeleteEventoModule();
