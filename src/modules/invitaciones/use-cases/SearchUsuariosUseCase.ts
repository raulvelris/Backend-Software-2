import { IUsuarioRepository } from '../../../domain/interfaces/IUsuarioRepository';
import { SearchUsuariosDto, UsuarioSearchResultDto } from '../dtos/SearchUsuariosDto';
import { LIMITE_RESULTADOS_BUSQUEDA } from '../../../domain/value-objects/Constantes';

const db = require('../../../infrastructure/database/models');

export class SearchUsuariosUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(dto: SearchUsuariosDto): Promise<UsuarioSearchResultDto[]> {
    if (!dto.query || typeof dto.query !== 'string') {
      throw new Error('Query parameter is required');
    }

    // Verificar conexión a la base de datos
    try {
      await db.sequelize.authenticate();
      console.log('✅ Conexión a la base de datos establecida correctamente');
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos:', error);
      throw new Error('Database connection error');
    }

    // ✅ Usar repositorio en lugar de db directo
    const usuarios = await this.usuarioRepository.searchByQuery(
      dto.query,
      dto.limit || LIMITE_RESULTADOS_BUSQUEDA
    );

    // Mapear modelos de Sequelize a DTOs
    return usuarios.map((u: any) => ({
      usuario_id: u.usuario_id,
      correo: u.correo,
      nombre: u.cliente?.nombre,
      apellido: u.cliente?.apellido
    }));
  }
}
