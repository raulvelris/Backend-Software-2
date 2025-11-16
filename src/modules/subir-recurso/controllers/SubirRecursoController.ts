import express, { Request, Response, Router } from 'express';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';

export class SubirRecursoController {
  private router: Router;
  private path: string = '/api';

  private subirRecursoUseCase = DependencyContainer.getSubirRecursoUseCase();

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/eventos/:evento_id/recursos', this.subirRecurso.bind(this));
  }

  private async subirRecurso(req: Request, res: Response): Promise<Response | void> {
    try {
      console.log('📥 Recibida solicitud para crear recurso:', {
        params: req.params,
        body: req.body
      });

      const { evento_id } = req.params;
      const { nombre, url, tipo_recurso } = req.body as { 
        nombre: string; 
        url: string; 
        tipo_recurso: number | string;
      };

      // Validar datos de entrada
      if (!nombre || !url || tipo_recurso === undefined) {
        console.warn('❌ Faltan campos requeridos');
        return res.status(400).json({ 
          success: false, 
          message: 'Faltan campos requeridos: nombre, url o tipo_recurso' 
        });
      }

      const result = await this.subirRecursoUseCase.execute({
        evento_id: String(evento_id),
        nombre,
        url,
        tipo_recurso
      });

      console.log('✅ Recurso creado exitosamente:', result);
      return res.status(201).json({
        success: true,
        recurso_id: result.recurso_id,
        message: result.message || 'Recurso creado exitosamente'
      });
    } catch (error: any) {
      console.error('❌ Error en SubirRecursoController:', error);
      
      const errorMessage = error?.message || 'Error interno del servidor';
      let statusCode = 500;
      
      // Mapear mensajes de error a códigos de estado
      if (errorMessage.includes('no válido') || 
          errorMessage.includes('campos requeridos') ||
          errorMessage.includes('URL proporcionada no es válida')) {
        statusCode = 400; // Bad Request
      } else if (errorMessage.includes('no encontrado')) {
        statusCode = 404; // Not Found
      }
      
      return res.status(statusCode).json({ 
        success: false, 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
