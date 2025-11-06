import { Request, Response, NextFunction } from "express";
import { IRolRepository } from "domain/interfaces/IRolRepository";
import { IParticipanteRepository } from "domain/interfaces/IParticipanteRepository";
import { IEventoParticipanteRepository } from "domain/interfaces/IEventoParticipanteRepository";
import { TipoRol } from "../../domain/value-objects/TipoRol";

export class VerifyOrganizerOrCoorganizerInEvent {

    constructor(
        private rolRepository: IRolRepository,
        private participanteRepository: IParticipanteRepository,
        private eventoParticipanteRepository: IEventoParticipanteRepository
    ) {}

  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.id; // viene del JWT

          // Extraer el evento_id de la URL o del body
        const eventoId = Number(
        req.params?.evento_id || 
        (req.body && req.body.evento_id) || 
        (req.query && req.query.evento_id)
        );

        if (isNaN(eventoId)) {
        return res.status(400).json({
            success: false,
            message: "Se requiere un ID de evento válido en la URL o en el cuerpo de la solicitud."
        });
        }

        if (!userId) {
            return res.status(400).json({
            success: false,
            message: "Usuario no autenticado."
            });
        }

      // Verificar si el usuario es organizador o coorganizador del evento
      const esAutorizado = await this.esOrganizadorOCoorganizadorDelEvento(eventoId, userId);
      
      if (!esAutorizado) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para realizar esta acción. Se requiere ser organizador o coorganizador del evento."
        });
      }

      next();
    } catch (error) {
      console.error("Error en verifyOrganizerOrCoorganizerInEvent:", error);
      res.status(500).json({
        success: false,
        message: "Error interno al validar permisos."
      });
    }
  }

  private async esOrganizadorOCoorganizadorDelEvento(eventoId: number, userId: number): Promise<boolean> {

    // 1. Obtener ambos roles en paralelo
    const [rolOrganizador, rolCoorganizador] = await Promise.all([
      this.rolRepository.findByNombre(TipoRol.ORGANIZADOR),
      this.rolRepository.findByNombre(TipoRol.COORGANIZADOR)
    ]);

    // 2. Verificar si los roles existen
    if (!rolOrganizador || !rolCoorganizador) {
      return false;
    }

    // 3. Buscar ambos roles en paralelo
    const [participanteOrganizador, participanteCoorganizador] = await Promise.all([
      this.participanteRepository.findByUsuarioAndRol(userId, rolOrganizador.rol_id),
      this.participanteRepository.findByUsuarioAndRol(userId, rolCoorganizador.rol_id)
    ]);

    // 4. Verificar si tiene uno de los roles
    const tieneRol = participanteOrganizador || participanteCoorganizador;
    if (!tieneRol) {
      return false;
    }

    // 5. Buscar si dirige el evento
    const participanteId = participanteOrganizador?.participante_id || participanteCoorganizador?.participante_id;
    const tieneEventos = await this.eventoParticipanteRepository.findByEventoAndParticipante(eventoId, participanteId!);

    return !!tieneEventos;
  }
}