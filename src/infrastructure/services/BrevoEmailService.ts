import * as nodemailer from 'nodemailer';
import * as brevo from '@getbrevo/brevo';
import { IEmailService } from '../../domain/interfaces/IEmailService';

// Initialize the Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || 'your_brevo_api_key_here');

export class BrevoEmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuración del transporte SMTP para Brevo
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER || '9ab63b001@smtp-brevo.com',
        pass: process.env.SMTP_PASS || '6RrIaCYwdQyKZV9z'
      },
      connectionTimeout: 10000, // 10 segundos de timeout
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    // Verificar la configuración del transporte
    this.transporter.verify((error) => {
      if (error) {
        console.error('❌ Error al verificar la configuración SMTP:', error);
      } else {
        console.log('✅ Configuración SMTP verificada correctamente');
      }
    });
  }

  async sendActivationEmail(email: string, activationToken: string, userName: string) {
    console.log('🔍 Iniciando envío de email de activación...');
    console.log('📝 Datos de entrada:', { 
      email, 
      userName,
      tokenLength: activationToken?.length || 0,
      frontendUrl: process.env.FRONTEND_URL || 'No definido'
    });

    try {
      if (!email || !activationToken) {
        throw new Error('Email o token de activación no proporcionado');
      }

      console.log('📧 Preparando email de activación vía Brevo API para:', email);
      
      const activationUrl = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
      console.log('🔗 URL de activación generada:', activationUrl);
      
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      const senderEmail = process.env.EMAIL_FROM || 'paolorezza1013@gmail.com';
      
      sendSmtpEmail.to = [{ email }];
      sendSmtpEmail.sender = {
        email: senderEmail,
        name: 'EventMaster'
      };
      sendSmtpEmail.subject = '🎉 Activa tu cuenta en EventMaster';
      
      console.log('📩 Configuración del correo:', {
        to: email,
        from: senderEmail,
        subject: sendSmtpEmail.subject
      });

      // Plantilla HTML del correo
      sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 ¡Bienvenido a EventMaster!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hola ${userName},</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Gracias por registrarte en EventMaster. Para completar tu registro y comenzar a crear y gestionar eventos, 
              necesitas activar tu cuenta haciendo clic en el siguiente enlace:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${activationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                🚀 Activar Mi Cuenta
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              <strong>¿No funciona el botón?</strong><br>
              Copia y pega este enlace en tu navegador:<br>
              <a href="${activationUrl}" style="color: #667eea; word-break: break-all;">${activationUrl}</a>
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                ⏰ <strong>Importante:</strong> Este enlace expira en 24 horas por seguridad.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Si no te registraste en EventMaster, puedes ignorar este email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 EventMaster. Todos los derechos reservados.</p>
          </div>
        </div>
      `;

      console.log('📤 Enviando email de activación vía SMTP...');
      
      const mailOptions = {
        from: `"EventMaster" <${process.env.EMAIL_FROM || '20222730@aloe.ulima.edu.pe'}>`,
        to: email,
        subject: '🎉 Activa tu cuenta en EventMaster',
        html: sendSmtpEmail.htmlContent
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email de activación enviado exitosamente');
      console.log('📨 Detalles del envío:', {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        pending: info.pending,
        response: info.response
      });
      
      return { success: true, messageId: info.messageId };
      
    } catch (error: any) {
      console.error('❌❌❌ ERROR CRÍTICO AL ENVIAR EMAIL ❌❌❌');
      console.error('📛 Tipo de error:', error.name || 'Error desconocido');
      console.error('📝 Mensaje:', error.message || 'Sin mensaje de error');
      
      if (error.response) {
        console.error('📊 Respuesta del servidor:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data || 'Sin datos adicionales'
        });
      }
      
      console.error('🔍 Stack trace:', error.stack || 'No hay stack trace disponible');
      console.error('📅 Hora del error:', new Date().toISOString());
      
      throw new Error(`Error al enviar email de activación: ${error.message || 'Error desconocido'}`);
    }
  }

  // Implementa otros métodos de la interfaz IEmailService si es necesario
  async sendWelcomeEmail(email: string, userName: string) {
    console.log('🔍 Iniciando envío de email de bienvenida...');
    console.log('📝 Datos de entrada:', { email, userName });

    try {
      if (!email) {
        throw new Error('Email no proporcionado');
      }

      console.log('📧 Preparando email de bienvenida para:', email);
      
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      const senderEmail = process.env.EMAIL_FROM || 'paolorezza1013@gmail.com';
      
      sendSmtpEmail.to = [{ email }];
      sendSmtpEmail.sender = {
        email: senderEmail,
        name: 'EventMaster'
      };
      sendSmtpEmail.subject = '🎉 ¡Bienvenido a EventMaster!';
      
      sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">¡Bienvenido a EventMaster, ${userName}!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">¡Estamos encantados de tenerte con nosotros!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Tu cuenta ha sido activada exitosamente. Ahora puedes comenzar a explorar todas las funcionalidades de EventMaster.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://tudominio.com'}" 
                 style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);">
                🚀 Comenzar a usar EventMaster
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 EventMaster. Todos los derechos reservados.</p>
          </div>
        </div>
      `;

      console.log('📤 Enviando email de bienvenida vía SMTP...');
      
      const mailOptions = {
        from: `"EventMaster" <${process.env.EMAIL_FROM || '20222730@aloe.ulima.edu.pe'}>`,
        to: email,
        subject: '🎉 ¡Bienvenido a EventMaster!',
        html: sendSmtpEmail.htmlContent
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email de bienvenida enviado exitosamente');
      console.log('📨 Detalles del envío:', {
        messageId: info.messageId,
        accepted: info.accepted,
        response: info.response
      });
      
      return { 
        success: true, 
        messageId: info.messageId 
      };
      
    } catch (error: any) {
      console.error('❌❌❌ ERROR AL ENVIAR EMAIL DE BIENVENIDA ❌❌❌');
      console.error('📛 Tipo de error:', error.name || 'Error desconocido');
      console.error('📝 Mensaje:', error.message || 'Sin mensaje de error');
      
      if (error.response) {
        console.error('📊 Respuesta del servidor:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data || 'Sin datos adicionales'
        });
      }
      
      console.error('🔍 Stack trace:', error.stack || 'No hay stack trace disponible');
      console.error('📅 Hora del error:', new Date().toISOString());
      
      // Aunque falle el correo de bienvenida, no queremos que falle el flujo completo
      return { 
        success: false, 
        error: error.message || 'Error al enviar email de bienvenida',
        timestamp: new Date().toISOString()
      };
    }
  }
}
