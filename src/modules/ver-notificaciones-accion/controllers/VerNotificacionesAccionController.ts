import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/utils/DependencyContainer'

export class VerNotificacionesAccionController {
  private router: Router
  private path: string = '/api'

  private getNotificacionesAccionUseCase = DependencyContainer.getGetNotificacionesAccionUseCase()

  constructor() {
    this.router = express.Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/usuarios/:usuario_id/notificaciones-accion', this.getNotificaciones.bind(this))
  }

  private async getNotificaciones(req: Request, res: Response): Promise<void> {
    try {
      const { usuario_id } = req.params
      const result = await this.getNotificacionesAccionUseCase.execute({ usuario_id: Number(usuario_id) })
      res.status(200).json(result)
    } catch (error: any) {
      if (error?.message === 'usuario_id es requerido') {
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
