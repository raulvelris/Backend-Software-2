import { Request, Response, Router } from 'express';
import { GetEventoRecursosUseCase } from '../use-cases/GetEventoRecursos';
import { RecursoRepository } from '../../../infrastructure/repositories/RecursoRepository';

interface EventoParams {
    id: string;
}

export class EventoRecursosController {
    private path = '/api/eventos';
    private router = Router({ mergeParams: true });

    private recursoRepository: RecursoRepository;

    constructor() {
        this.recursoRepository = new RecursoRepository();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // GET /api/eventos/:id/recursos
        this.router.get<EventoParams>('/:id/recursos', this.getRecursosForEvento.bind(this));
    }

    

    private async getRecursosForEvento(
        req: Request<EventoParams>,
        res: Response
    ) {
        try {
            const { id } = req.params;
            const eventoId = parseInt(id, 10);
            
            if (isNaN(eventoId)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'ID de evento no válido' 
                });
            }

            // Aquí puedes agregar lógica adicional de autenticación/autorización si es necesario
            const getEventoRecursosUseCase = new GetEventoRecursosUseCase(this.recursoRepository);
            const recursos = await getEventoRecursosUseCase.execute(eventoId);
            
            return res.status(200).json({
                success: true,
                recursos: recursos
            });
            
        } catch (error) {
            console.error('Error al obtener recursos del evento:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Error al obtener recursos del evento',
                error: error instanceof Error ? error.message : 'Error desconocido'
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
