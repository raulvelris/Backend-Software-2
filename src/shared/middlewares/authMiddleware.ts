import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string;  // ID del usuario
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
   // Validación más estricta del header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Formato de token inválido. Usa: Bearer <token>' 
    });
  }

  // Validación del token
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token no proporcionado' 
    });
  }

  // Validación de la variable de entorno
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET no está definido en las variables de entorno');
    return res.status(500).json({ 
      success: false, 
      message: 'Error de configuración del servidor' 
    });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Solo incluir el ID si no necesitas el email
    (req as any).user = { 
      id: decoded.sub 
    };
    
    next();
  } catch (error) {
    const message = error instanceof jwt.TokenExpiredError
      ? 'Token expirado'
      : 'Token inválido';
    return res.status(401).json({ success: false, message });
  }
}
