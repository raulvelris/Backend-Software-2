import { Router, Request, Response } from "express";
import crypto from "crypto";
// @ts-ignore - using CommonJS compiled models
import db from "../DAO/models";
import { sendActivationEmail } from "./Mailer";

function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

export default function AuthController(): [string, Router] {
  const router = Router();

  router.post("/register", async (req: Request, res: Response) => {
    try {
      const { correo, clave } = req.body || {};
      if (!correo || !clave) {
        return res.status(400).json({ message: "correo y clave son requeridos" });
      }

      const existing = await db.Usuario.findOne({ where: { correo } });
      if (existing) {
        return res.status(409).json({ message: "Correo ya registrado" });
      }

      const activationToken = generateToken(20);
      const activationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

      const user = await db.Usuario.create({
        correo,
        clave,
        isActive: false,
        activationToken,
        activationExpires
      });

      try {
        await sendActivationEmail(correo, activationToken);
      } catch (mailErr) {
        console.error("Error enviando correo de activación:", mailErr);
      }

      return res.status(201).json({
        message: "Usuario registrado. Revisa tu correo para activar la cuenta.",
        usuario_id: user.usuario_id
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al registrar" });
    }
  });

  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { correo, clave } = req.body || {};
      if (!correo || !clave) {
        return res.status(400).json({ message: "correo y clave son requeridos" });
      }

      const user = await db.Usuario.findOne({ where: { correo } });
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Cuenta no activada. Revisa tu correo." });
      }

      // En una implementación real, aquí verificarías la contraseña hasheada
      // Por ahora asumimos que la clave coincide directamente
      if (user.clave !== clave) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      // Generar token JWT (simplificado)
      const token = generateToken(32);

      return res.json({
        message: "Login exitoso",
        token,
        usuario: {
          usuario_id: user.usuario_id,
          correo: user.correo,
          isActive: user.isActive
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al hacer login" });
    }
  });

  router.get("/activate", async (req: Request, res: Response) => {
    try {
      const token = (req.query.token as string) || "";
      if (!token) {
        return res.status(400).json({ message: "token requerido" });
      }

      const user = await db.Usuario.findOne({ where: { activationToken: token } });
      if (!user) {
        return res.status(404).json({ message: "Token inválido" });
      }

      if (user.activationExpires && new Date(user.activationExpires).getTime() < Date.now()) {
        return res.status(410).json({ message: "Token expirado" });
      }

      await user.update({ isActive: true, activationToken: null, activationExpires: null });
      return res.json({ message: "Cuenta activada" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error al activar" });
    }
  });

  // Test endpoint para verificar configuración de email
  router.post("/test-email", async (req: Request, res: Response) => {
    try {
      const { email } = req.body || {};
      if (!email) {
        return res.status(400).json({ message: "email requerido" });
      }

      const { sendActivationEmail } = await import("./Mailer");
      const testToken = "test-token-123";
      await sendActivationEmail(email, testToken);
      
      return res.json({ 
        message: "Email de prueba enviado", 
        email,
        token: testToken 
      });
    } catch (err) {
      console.error("Error en test-email:", err);
      return res.status(500).json({ 
        message: "Error enviando email de prueba", 
        error: err instanceof Error ? err.message : "Error desconocido"
      });
    }
  });

  return ["/auth", router];
}


