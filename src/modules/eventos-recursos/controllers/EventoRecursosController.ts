import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { DependencyContainer } from '../../../shared/utils/DependencyContainer';
import { authMiddleware } from '../../../shared/middlewares/authMiddleware';
import { CrearRecursoDto } from '../dtos/CrearRecursoDto';

// Configurar multer para guardar archivos
// Usar un Map para rastrear archivos procesados por request
const processedFilesByRequest = new WeakMap<Request, Map<string, string>>();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../../../assets/uploads');
        // Crear directorio si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Obtener o crear el mapa de archivos procesados para este request
        let processedFiles = processedFilesByRequest.get(req);
        if (!processedFiles) {
            processedFiles = new Map<string, string>();
            processedFilesByRequest.set(req, processedFiles);
        }
        
        // Crear una clave única para este archivo en este request
        const fileKey = `${file.fieldname}-${file.originalname}-${file.size}`;
        
        // Si este archivo ya fue procesado, reutilizar el nombre (evita duplicados)
        if (processedFiles.has(fileKey)) {
            const existingFilename = processedFiles.get(fileKey)!;
            console.error(`[Multer DUPLICADO] Reutilizando nombre: ${existingFilename} para ${file.originalname}`);
            cb(null, existingFilename);
            return;
        }
        
        // Generar nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = `recurso-${uniqueSuffix}${ext}`;
        
        // Guardar el nombre generado para este archivo
        processedFiles.set(fileKey, filename);
        
        console.error(`[Multer] Guardando archivo: ${filename} (${file.originalname})`);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB límite
});

// Ya no necesitamos el middleware condicional, las rutas están separadas

export class EventoRecursosController {
    private router: Router;
    private path: string = '/api';

    // Use Cases
    private crearRecursoEnlaceUseCase = DependencyContainer.getCrearRecursoEnlaceUseCase();
    private crearRecursoArchivoUseCase = DependencyContainer.getCrearRecursoArchivoUseCase();

    constructor() {
        this.router = express.Router();
        
        // aplicar middleware a todas las rutas
        this.router.use(authMiddleware);
        
        // inicializar rutas
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // POST /api/eventos/:id/recursos - Para enlaces (JSON normal, sin multer)
        this.router.post('/:id/recursos', this.crearRecursoEnlace.bind(this));
        
        // POST /api/eventos/:id/recursos/archivo - Para archivos (FormData + multer)
        // Usar upload.any() directamente como middleware para aceptar el archivo y otros campos
        this.router.post('/:id/recursos/archivo', 
            (req, res, next) => {
                // Crear un identificador único para este request
                const requestId = `${req.method}-${req.url}-${Date.now()}-${Math.random()}`;
                
                // Verificar si ya se procesó este request (evitar duplicados)
                if ((req as any).multerProcessed) {
                    console.error(`[DUPLICADO] Request ${requestId} ya procesado por multer, saltando...`);
                    return next();
                }
                (req as any).multerProcessed = true;
                (req as any).requestId = requestId;
                
                console.error(`[Multer] Procesando request: ${requestId}`);
                
                upload.any()(req, res, (err) => {
                    if (err) {
                        console.error('Error en multer:', err);
                        return res.status(400).json({ 
                            success: false, 
                            message: 'Error al procesar el archivo: ' + err.message 
                        });
                    }
                    const files = (req.files as any[]) || [];
                    console.error(`[Multer] Request ${requestId} procesó ${files.length} archivo(s)`);
                    next();
                });
            },
            this.crearRecursoArchivo.bind(this)
        );
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
                tipo_recurso: Number(body.tipo_recurso || '1')
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
            const tipo_recurso = body.tipo_recurso || '2'; // Por defecto es archivo

            // Buscar el archivo en req.files (upload.any() devuelve un array)
            const files = (req.files as any[]) || [];
            const archivoFile = files.find((f: any) => f.fieldname === 'archivo');

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
