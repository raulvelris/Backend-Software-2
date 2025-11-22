import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

// Extender el tipo Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

interface JwtPayload extends jwt.JwtPayload {
  sub: string; // ID del usuario como string (puede ser convertido a número si es necesario)
  email?: string;
  role?: string;
}

export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  console.log('Iniciando verificación de autenticación...');
  
  // Obtener el token del encabezado de autorización
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    console.error('Error: Formato de token inválido');
    return res.status(401).json({
      success: false,
      message: 'Formato de token inválido. Usa: Bearer <token>',
    });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    console.error('Error: JWT_SECRET no está definido en las variables de entorno');
    return res.status(500).json({
      success: false,
      message: 'Error de configuración del servidor',
    });
  }

  if (!token) {
    console.error('Error: Token no proporcionado');
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado',
    });
  }
  
  try {
    console.log('Verificando token JWT...');
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    console.log('Token decodificado:', JSON.stringify(decoded, null, 2));

    if (typeof decoded.sub !== 'number' || isNaN(decoded.sub)) {
      console.error('Error: ID de usuario inválido en el token');
      return res.status(401).json({
        success: false,
        message: 'ID de usuario inválido en el token',
      });
    }

    // asignamos el usuario al request con el tipo correcto
    req.user = { id: decoded.sub };

    next();
  } catch (error) {
    const message =
      error instanceof jwt.TokenExpiredError
        ? 'Token expirado'
        : 'Token inválido'
    return res.status(401).json({ success: false, message })
  }
}