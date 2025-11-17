import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Map para evitar procesar el mismo archivo varias veces por request
const processedFilesByRequest = new WeakMap<Request, Map<string, string>>()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../assets/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    let processedFiles = processedFilesByRequest.get(req)
    if (!processedFiles) {
      processedFiles = new Map<string, string>()
      processedFilesByRequest.set(req, processedFiles)
    }

    const fileKey = `${file.fieldname}-${file.originalname}-${file.size}`

    if (processedFiles.has(fileKey)) {
      const existingFilename = processedFiles.get(fileKey)!
      console.error(`[Multer DUPLICADO] Reutilizando nombre: ${existingFilename} para ${file.originalname}`)
      cb(null, existingFilename)
      return
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    const filename = `recurso-${uniqueSuffix}${ext}`

    processedFiles.set(fileKey, filename)

    console.error(`[Multer] Guardando archivo: ${filename} (${file.originalname})`)
    cb(null, filename)
  },
})

const allowedMimeTypes = [
  // Imágenes
  'image/jpeg',
  'image/png',
  // PDF
  'application/pdf',
  // Word
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Excel
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // PowerPoint
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true)
  }
  console.error(`[Multer] Tipo de archivo no permitido: ${file.mimetype}`)
  const error = new Error('Tipo de archivo no permitido')
  ;(error as any).code = 'LIMIT_FILE_TYPE'
  cb(error)
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
})

export function uploadEventoRecursoArchivo(req: Request, res: Response, next: NextFunction) {
  const requestId = `${req.method}-${req.url}-${Date.now()}-${Math.random()}`

  if ((req as any).multerProcessed) {
    console.error(`[DUPLICADO] Request ${requestId} ya procesado por multer, saltando...`)
    return next()
  }
  ;(req as any).multerProcessed = true
  ;(req as any).requestId = requestId

  console.error(`[Multer] Procesando request: ${requestId}`)

  upload.single('archivo')(req, res, (err) => {
    if (err) {
        console.error('Error en multer:', err)

        let message = 'Error al procesar el archivo'
        if ((err as any).code === 'LIMIT_FILE_SIZE') {
            message = 'El archivo excede el tamaño máximo de 10 MB'
        } else if ((err as any).code === 'LIMIT_FILE_TYPE') {
            message = 'Tipo de archivo no permitido. Solo se permiten JPG, PNG, PDF, Word, Excel y PowerPoint'
        }

        return res.status(400).json({
            success: false,
            message,
        })
    }

    const file = (req as any).file

    console.error(`[Multer] Request ${requestId} procesó ${file ? 1 : 0} archivo(s)`)
    next()
  })
}