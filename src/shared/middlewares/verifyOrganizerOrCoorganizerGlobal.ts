import { Request, Response, NextFunction } from "express";
import { IRolRepository } from "../../domain/interfaces/IRolRepository";
import { IParticipanteRepository } from "../../domain/interfaces/IParticipanteRepository";
import { IEventoParticipanteRepository } from "../../domain/interfaces/IEventoParticipanteRepository";
import { TipoRol } from "../../domain/value-objects/TipoRol";

export class VerifyOrganizerOrCoorganizerGlobal {

  constructor(
    private rolRepository: IRolRepository,
    private participanteRepository: IParticipanteRepository,
    private eventoParticipanteRepository: IEventoParticipanteRepository
  ) {}
  
  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // viene del JWT

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Usuario no autenticado."
        });
      }

      // Verificar si el usuario es organizador o coorganizador de algún evento
      const esAutorizado = await this.esOrganizadorOCoorganizador(userId);
      
      if (!esAutorizado) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para realizar esta acción. Se requiere ser organizador o coorganizador de al menos un evento."
        });
      }

      next();
    } catch (error) {
      console.error("Error en verifyOrganizerOrCoorganizerGlobal:", error);
      res.status(500).json({
        success: false,
        message: "Error interno al validar permisos."
      });
    }
  }

  private async esOrganizadorOCoorganizador(userId: number): Promise<boolean> {

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

    // 5. Buscar si dirige al menos un evento
    const participanteId = participanteOrganizador?.participante_id || participanteCoorganizador?.participante_id;
    const tieneEvento = await this.eventoParticipanteRepository.findByParticipante(participanteId!);

    return !!tieneEvento; // Devuelve true si tiene uno, false si no
  }
}



