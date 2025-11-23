import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/config/DependencyContainer'
import { authMiddleware } from '../../../shared/middlewares/authMiddleware'

export class DeleteRecursoController {
  private router: Router
  private path: string = '/api/eventos'

  private deleteRecursoUseCase = DependencyContainer.getDeleteRecursoUseCase()

  constructor() {
    this.router = express.Router()
    this.router.use(authMiddleware)
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.delete(
      '/:eventoId/recursos/:recursoId',
      this.deleteRecurso.bind(this)
    )
  }

  private async deleteRecurso(req: Request, res: Response): Promise<void> {
    try {
      const { eventoId, recursoId } = req.params
      const evento_id = parseInt(eventoId ?? '', 10)
      const recurso_id = parseInt(recursoId ?? '', 10)

      if (isNaN(evento_id) || isNaN(recurso_id)) {
        res.status(400).json({ success: false, message: 'IDs no válidos' })
        return
      }

      const usuario_id = Number(req.user?.id)
      if (Number.isNaN(usuario_id) || !usuario_id) {
        res.status(400).json({ success: false, message: 'Usuario no autenticado o inválido' })
        return
      }

      const result = await this.deleteRecursoUseCase.execute({ evento_id, recurso_id, usuario_id })
      res.status(200).json(result)
    } catch (error: any) {
      console.error('Error al eliminar recurso:', error)

      if (error.message?.includes('no encontrado') || error.message?.includes('no pertenece')) {
        res.status(404).json({ success: false, message: error.message })
        return
      }

      if (error.message?.includes('requeridos')) {
        res.status(400).json({ success: false, message: error.message })
        return
      }

      res.status(500).json({ success: false, message: 'Error interno del servidor' })
    }
  }

  public getRouter(): Router {
    return this.router
  }

  public getPath(): string {
    return this.path
  }
}
