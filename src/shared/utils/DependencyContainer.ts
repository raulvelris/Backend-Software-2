// Dependency Injection Container
import { UsuarioRepository } from '../../infrastructure/repositories/UsuarioRepository';
import { EventoRepository } from '../../infrastructure/repositories/EventoRepository';
import { InvitacionRepository } from '../../infrastructure/repositories/InvitacionRepository';

import { SearchUsuariosUseCase } from '../../modules/invitaciones/use-cases/SearchUsuariosUseCase';
import { SendInvitacionUseCase } from '../../modules/invitaciones/use-cases/SendInvitacionUseCase';
import { GetNoElegiblesUseCase } from '../../modules/invitaciones/use-cases/GetNoElegiblesUseCase';
import { CountInvitacionesPendientesUseCase } from '../../modules/invitaciones/use-cases/CountInvitacionesPendientesUseCase';

export class DependencyContainer {
  // Repositorios (Singleton)
  private static usuarioRepository: UsuarioRepository;
  private static eventoRepository: EventoRepository;
  private static invitacionRepository: InvitacionRepository;

  // Use Cases
  private static searchUsuariosUseCase: SearchUsuariosUseCase;
  private static sendInvitacionUseCase: SendInvitacionUseCase;
  private static getNoElegiblesUseCase: GetNoElegiblesUseCase;
  private static countInvitacionesPendientesUseCase: CountInvitacionesPendientesUseCase;

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

  static getInvitacionRepository(): InvitacionRepository {
    if (!this.invitacionRepository) {
      this.invitacionRepository = new InvitacionRepository();
    }
    return this.invitacionRepository;
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
        this.getInvitacionRepository()
      );
    }
    return this.sendInvitacionUseCase;
  }

  static getGetNoElegiblesUseCase(): GetNoElegiblesUseCase {
    if (!this.getNoElegiblesUseCase) {
      this.getNoElegiblesUseCase = new GetNoElegiblesUseCase(
        this.getInvitacionRepository()
      );
    }
    return this.getNoElegiblesUseCase;
  }

  static getCountInvitacionesPendientesUseCase(): CountInvitacionesPendientesUseCase {
    if (!this.countInvitacionesPendientesUseCase) {
      this.countInvitacionesPendientesUseCase = new CountInvitacionesPendientesUseCase(
        this.getInvitacionRepository()
      );
    }
    return this.countInvitacionesPendientesUseCase;
  }
}
