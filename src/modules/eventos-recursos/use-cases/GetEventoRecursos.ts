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
            return recursos.map(recurso => {
                const recursoData = recurso.get ? recurso.get({ plain: true }) : recurso;
                return {
                    id: recursoData.recurso_id,
                    nombre: recursoData.nombre,
                    url: recursoData.url,
                    tipo_recurso: {
                        id: recursoData.tipo_recurso,
                        nombre: recursoData.tipo?.nombre || 'Desconocido'
                    },
                    evento_id: recursoData.evento_id
                };
            });
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
