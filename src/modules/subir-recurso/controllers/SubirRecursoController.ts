import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';

export class SubirRecursoController {
  private router: Router;
  private path: string = '/api';

  private subirRecursoUseCase = DependencyContainer.getSubirRecursoUseCase();

  // Configuración de multer para manejar archivos en memoria
  private upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB máximo
    }
  });

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  // Middleware condicional para aplicar multer solo si es multipart/form-data
  private conditionalMulter = (req: Request, res: Response, next: any) => {
    const contentType = req.headers['content-type'] || '';
    
    // Si el Content-Type es multipart/form-data Y tiene boundary, usar multer
    if (contentType.includes('multipart/form-data')) {
      if (contentType.includes('boundary=')) {
        return this.upload.any()(req, res, next);
      } else {
        // Si dice multipart/form-data pero no tiene boundary, hay un error en el cliente
        console.error('❌ Error: Content-Type multipart/form-data sin boundary');
        return res.status(400).json({
          success: false,
          message: 'Error: El Content-Type multipart/form-data requiere un boundary. Asegúrate de no establecer manualmente este header al enviar FormData.'
        });
      }
    }
    
    // Si no, continuar sin multer (para JSON)
    next();
  };

  private initializeRoutes(): void {
    // Usar middleware condicional que aplica multer solo cuando sea necesario
    this.router.post('/eventos/:evento_id/recursos', this.conditionalMulter, this.subirRecurso.bind(this));
  }

  private async subirRecurso(req: Request, res: Response): Promise<Response | void> {
    try {
      console.log('📥 Recibida solicitud para crear recurso:', {
        params: req.params,
        body: req.body,
        files: req.files,
        contentType: req.headers['content-type']
      });

      const { evento_id } = req.params;
      
      // Extraer datos del body (multer los parsea automáticamente)
      const nombre = req.body.nombre || '';
      const url = req.body.url || '';
      const tipo_recurso = req.body.tipo_recurso;

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
