import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';
import { CrearRecursoDto } from '../dtos/CrearRecursoDto';
import { uploadEventoRecursoArchivo } from '../../../shared/middlewares/uploadEventoRecursoArchivo';

export class CompartirRecursosController {
    private router: Router;
    private path: string = '/api/eventos';

    // Use Cases
    private crearRecursoEnlaceUseCase = DependencyContainer.getCrearRecursoEnlaceUseCase();
    private crearRecursoArchivoUseCase = DependencyContainer.getCrearRecursoArchivoUseCase();
    private deleteRecursoUseCase = DependencyContainer.getDeleteRecursoUseCase();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    // Handler: Eliminar recurso
    private async eliminarRecurso(req: Request, res: Response): Promise<void> {
        try {
            const { eventoId, recursoId } = req.params;
            const evento_id = parseInt(eventoId!, 10);
            const recurso_id = parseInt(recursoId!, 10);

            if (isNaN(evento_id) || isNaN(recurso_id)) {
                res.status(400).json({ success: false, message: 'IDs no válidos' });
                return;
            }

            const result = await this.deleteRecursoUseCase.execute({ evento_id, recurso_id });
            res.status(200).json(result);
        } catch (error: any) {
            console.error('Error al eliminar recurso:', error);

            if (error.message?.includes('no encontrado') || error.message?.includes('no pertenece')) {
                res.status(404).json({ success: false, message: error.message });
                return;
            }

            if (error.message?.includes('requeridos')) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }

            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    private initializeRoutes(): void {
        this.router.post('/:id/recursos/enlace', this.crearRecursoEnlace.bind(this));
        this.router.post('/:id/recursos/archivo', uploadEventoRecursoArchivo, this.crearRecursoArchivo.bind(this));
        this.router.delete('/:eventoId/recursos/:recursoId', this.eliminarRecurso.bind(this));
    }

    // Handler: Crear recurso de tipo ENLACE (JSON normal, sin multer)
    private async crearRecursoEnlace(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const eventoId = parseInt(id!, 10);
            
            if (isNaN(eventoId)) {
                res.status(400).json({ success: false, message: 'ID de evento no válido' });
                return;
            }

            const body = req.body || {};
            const dto: CrearRecursoDto = {
                evento_id: eventoId,
                nombre: body.nombre,
                url: body.url,
                tipo_recurso: Number(body.tipo_recurso)
            };

            const result = await this.crearRecursoEnlaceUseCase.execute(dto);

            res.status(201).json(result);
        } catch (error: any) {
            console.error('Error al crear recurso (enlace):', error);
            
            if (error.message?.includes('no encontrado')) {
                res.status(404).json({ 
                    success: false, 
                    message: error.message
                });
                return;
            }
            
            if (error.message?.includes('no válido') || error.message?.includes('requeridos') || error.message?.includes('obligatorio')) {
                res.status(400).json({ 
                    success: false, 
                    message: error.message
                });
                return;
            }
            
            res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor'
            });
        }
    }

    // Handler: Crear recurso de tipo ARCHIVO (FormData + multer)
    private async crearRecursoArchivo(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const eventoId = parseInt(id!, 10);
            
            if (isNaN(eventoId)) {
                res.status(400).json({ success: false, message: 'ID de evento no válido' });
                return;
            }

            // Con upload.any(), los campos de texto están en req.body y los archivos en req.files
            const body = req.body || {};
            const nombre = body.nombre;
            const tipo_recurso = body.tipo_recurso;

            // Buscar el archivo en req.files (upload.any() devuelve un array)
            const archivoFile = (req as any).file;

            // Validar que haya un archivo
            if (!archivoFile) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Debe proporcionar un archivo' 
                });
                return;
            }

            // Generar URL relativa para acceder al archivo
            const url = `/assets/uploads/${archivoFile.filename}`;

            const dto: CrearRecursoDto = {
                evento_id: eventoId,
                nombre: nombre,
                url: url,
                tipo_recurso: Number(tipo_recurso)
            };

            const result = await this.crearRecursoArchivoUseCase.execute(dto);

            res.status(201).json(result);
        } catch (error: any) {
            console.error('Error al crear recurso (archivo):', error);
            
            if (error.message?.includes('no encontrado')) {
                res.status(404).json({ 
                    success: false, 
                    message: error.message
                });
                return;
            }
            
            if (error.message?.includes('no válido') || error.message?.includes('requeridos') || error.message?.includes('obligatorio')) {
                res.status(400).json({ 
                    success: false, 
                    message: error.message
                });
                return;
            }
            
            res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor'
            });
        }
    }

    // Getters
    public getRouter(): Router {
        return this.router;
    }
    
    public getPath(): string {
        return this.path;
    }
}
