// Dependency Injection Container
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { EventoRepository } from '../../infrastructure/repositories/EventoRepository';
import { EventoParticipanteRepository } from '../../infrastructure/repositories/EventoParticipanteRepository';
import { InvitacionRepository } from '../../infrastructure/repositories/InvitacionRepository';
import { InvitacionUsuarioRepository } from '../../infrastructure/repositories/InvitacionUsuarioRepository';
import { EstadoInvitacionRepository } from '../../infrastructure/repositories/EstadoInvitacionRepository';
import { ParticipanteRepository } from '../../infrastructure/repositories/ParticipanteRepository';
import { RolRepository } from '../../infrastructure/repositories/RolRepository';

import { SearchUsuariosUseCase } from '../../modules/invitaciones/use-cases/SearchUsuariosUseCase';
import { SendInvitacionUseCase } from '../../modules/invitaciones/use-cases/SendInvitacionUseCase';
import { GetNoElegiblesUseCase } from '../../modules/invitaciones/use-cases/GetNoElegiblesUseCase';
import { CountInvitacionesPendientesUseCase } from '../../modules/invitaciones/use-cases/CountInvitacionesPendientesUseCase';
import { GetParticipantesByEventoUseCase } from '../../modules/ver-participantes/use-cases/GetParticipantesByEventoUseCase';
import { RespondInvitacionUseCase } from '../../modules/confirmar-invitacion/use-cases/RespondInvitacionUseCase';

export class DependencyContainer {
  // Repositorios (Singleton)
  private static usuarioRepository: UsuarioRepository;
  private static eventoRepository: EventoRepository;
  private static eventoParticipanteRepository: EventoParticipanteRepository;
  private static invitacionRepository: InvitacionRepository;
  private static invitacionUsuarioRepository: InvitacionUsuarioRepository;
  private static estadoInvitacionRepository: EstadoInvitacionRepository;
  private static participanteRepository: ParticipanteRepository;
  private static rolRepository: RolRepository;

  // Use Cases - Invitaciones
  private static searchUsuariosUseCase: SearchUsuariosUseCase;
  private static sendInvitacionUseCase: SendInvitacionUseCase;
  private static getNoElegiblesUseCase: GetNoElegiblesUseCase;
  private static countInvitacionesPendientesUseCase: CountInvitacionesPendientesUseCase;

  // Use Cases - Ver Invitados
  private static getParticipantesByEventoUseCase: GetParticipantesByEventoUseCase;

  // Use Cases - Confirmar Invitación
  private static respondInvitacionUseCase: RespondInvitacionUseCase;

  // Getters para Repositorios
  static getUsuarioRepository(): UsuarioRepository {
    if (!this.usuarioRepository) {
      this.usuarioRepository = new UsuarioRepository();
    }
    return this.usuarioRepository;
  }

  static getEventoRepository(): EventoRepository {
    if (!this.eventoRepository) {
      this.eventoRepository = new EventoRepository();
    }
    return this.eventoRepository;
  }

  static getEventoParticipanteRepository(): EventoParticipanteRepository {
    if (!this.eventoParticipanteRepository) {
      this.eventoParticipanteRepository = new EventoParticipanteRepository();
    }
    return this.eventoParticipanteRepository;
  }

  static getInvitacionRepository(): InvitacionRepository {
    if (!this.invitacionRepository) {
      this.invitacionRepository = new InvitacionRepository();
    }
    return this.invitacionRepository;
  }

  static getInvitacionUsuarioRepository(): InvitacionUsuarioRepository {
    if (!this.invitacionUsuarioRepository) {
      this.invitacionUsuarioRepository = new InvitacionUsuarioRepository();
    }
    return this.invitacionUsuarioRepository;
  }

  static getEstadoInvitacionRepository(): EstadoInvitacionRepository {
    if (!this.estadoInvitacionRepository) {
      this.estadoInvitacionRepository = new EstadoInvitacionRepository();
    }
    return this.estadoInvitacionRepository;
  }

  static getParticipanteRepository(): ParticipanteRepository {
    if (!this.participanteRepository) {
      this.participanteRepository = new ParticipanteRepository();
    }
    return this.participanteRepository;
  }

  static getRolRepository(): RolRepository {
    if (!this.rolRepository) {
      this.rolRepository = new RolRepository();
    }
    return this.rolRepository;
  }

  // Getters para Use Cases
  static getSearchUsuariosUseCase(): SearchUsuariosUseCase {
    if (!this.searchUsuariosUseCase) {
      this.searchUsuariosUseCase = new SearchUsuariosUseCase(
        this.getUsuarioRepository()
      );
    }
    return this.searchUsuariosUseCase;
  }

  static getSendInvitacionUseCase(): SendInvitacionUseCase {
    if (!this.sendInvitacionUseCase) {
      this.sendInvitacionUseCase = new SendInvitacionUseCase(
        this.getUsuarioRepository(),
        this.getEventoRepository(),
        this.getEventoParticipanteRepository(),
        this.getInvitacionUsuarioRepository(),
        this.getEstadoInvitacionRepository()
      );
    }
    return this.sendInvitacionUseCase;
  }

  static getGetNoElegiblesUseCase(): GetNoElegiblesUseCase {
    if (!this.getNoElegiblesUseCase) {
      this.getNoElegiblesUseCase = new GetNoElegiblesUseCase(
        this.getInvitacionUsuarioRepository(),
        this.getEstadoInvitacionRepository()
      );
    }
    return this.getNoElegiblesUseCase;
  }

  static getCountInvitacionesPendientesUseCase(): CountInvitacionesPendientesUseCase {
    if (!this.countInvitacionesPendientesUseCase) {
      this.countInvitacionesPendientesUseCase = new CountInvitacionesPendientesUseCase(
        this.getInvitacionUsuarioRepository(),
        this.getEstadoInvitacionRepository()
      );
    }
    return this.countInvitacionesPendientesUseCase;
  }

  static getGetParticipantesByEventoUseCase(): GetParticipantesByEventoUseCase {
    if (!this.getParticipantesByEventoUseCase) {
      this.getParticipantesByEventoUseCase = new GetParticipantesByEventoUseCase(
        this.getEventoParticipanteRepository()
      );
    }
    return this.getParticipantesByEventoUseCase;
  }

  static getRespondInvitacionUseCase(): RespondInvitacionUseCase {
    if (!this.respondInvitacionUseCase) {
      this.respondInvitacionUseCase = new RespondInvitacionUseCase(
        this.getInvitacionUsuarioRepository(),
        this.getEstadoInvitacionRepository(),
        this.getParticipanteRepository(),
        this.getRolRepository(),
        this.getEventoParticipanteRepository(),
        this.getEventoRepository()
      );
    }
    return this.respondInvitacionUseCase;
  }
}
