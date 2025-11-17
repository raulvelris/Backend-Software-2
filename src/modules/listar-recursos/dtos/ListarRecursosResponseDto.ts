export type ListarRecursosResponseDto = {
  success: boolean;
  recursos: Array<{
    id: number;
    nombre: string;
    url: string;
    tipo_recurso: {
      id: number;
      nombre: string;
    };
    evento_id: number;
  }>;
};