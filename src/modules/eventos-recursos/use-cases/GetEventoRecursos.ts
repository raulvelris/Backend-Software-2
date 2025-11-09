import { IRecursoRepository } from '../../../domain/interfaces/IRecursoRepository';

interface Recurso {
    id: number;
    nombre: string;
    // Agrega aquí otros campos del modelo Recurso según sea necesario
    [key: string]: any;
}

export class GetEventoRecursosUseCase {
    constructor(
        private recursoRepository: IRecursoRepository
    ) {}

    async execute(eventoId: number): Promise<Recurso[]> {
        try {
            // Validar que el ID sea un número válido
            if (!Number.isInteger(eventoId) || eventoId <= 0) {
                throw new Error('ID de evento no válido');
            }

            // Obtener los recursos del evento usando el repositorio
            const recursos = await this.recursoRepository.findByEventoId(eventoId);

            // Mapear los recursos al formato deseado
            return recursos.map(recurso => ({
                id: recurso.id,
                nombre: recurso.nombre,
                // Agrega aquí otros campos según sea necesario
                ...recurso
            }));
        } catch (error) {
            console.error('Error en GetEventoRecursos:', error);
            // Relanzar el error para que el controlador lo maneje
            throw new Error(
                error instanceof Error 
                    ? error.message 
                    : 'Error desconocido al obtener recursos del evento'
            );
        }
    }
}
