import express, { Request, Response, Router } from 'express'
import { DependencyContainer } from '../../../shared/config/DependencyContainer'
import { authMiddleware } from '../../../shared/middlewares/authMiddleware'

export class AttendedEventsController {
  private router: Router
  private path: string = '/api'

  private listAttendedEventsUseCase = DependencyContainer.getListAttendedEventsUseCase()

  constructor() {
    this.router = express.Router()
    this.router.use(authMiddleware)
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/events/attended', this.list.bind(this))
  }

  private async list(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = Number(req.user?.id)
      if (!usuarioId || Number.isNaN(usuarioId)) {
        res.status(401).json({ success: false, message: 'No autenticado' })
        return
      }
      const result = await this.listAttendedEventsUseCase.execute(usuarioId)
      res.json(result)
    } catch (err: any) {
      console.error('[AttendedEventsController] Error listando asistidos:', err)
      res.status(500).json({ success: false, message: 'Error interno' })
    }
  }

  public getRouter(): Router { return this.router }
  public getPath(): string { return this.path }
}
