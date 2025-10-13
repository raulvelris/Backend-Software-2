import nodemailer from 'nodemailer';

/**
 * Servicio de Email para envío de correos electrónicos
 * Utiliza Nodemailer con configuración SMTP
 */
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER || 'tu-email@gmail.com',
        pass: process.env.SMTP_PASS || 'tu-password-de-aplicacion'
      },
      connectionTimeout: 10000, // 10 segundos
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
  }

  /**
   * Envía email de activación de cuenta
   */
  async sendActivationEmail(email: string, activationToken: string, userName: string): Promise<{ success: boolean; messageId?: string }> {
    try {
      console.log('📧 Preparando email de activación para:', email);
      const activationUrl = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
      
      const mailOptions = {
        from: `"EventMaster" <${process.env.SMTP_USER || 'noreply@eventmaster.com'}>`,
        to: email,
        subject: '🎉 Activa tu cuenta en EventMaster',
        html: `
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
        `
      };

      console.log('📤 Enviando email de activación...');
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de activación enviado exitosamente:', info.messageId);
      return { success: true, messageId: info.messageId };
      
    } catch (error: any) {
      console.error('❌ Error enviando email de activación:', error.message || error);
      console.error('Detalles del error:', {
        code: error.code,
        command: error.command,
        response: error.response
      });
      throw new Error(`Error al enviar email de activación: ${error.message}`);
    }
  }

  /**
   * Envía email de bienvenida después de activación exitosa
   */
  async sendWelcomeEmail(email: string, userName: string): Promise<{ success: boolean; messageId?: string }> {
    try {
      const mailOptions = {
        from: `"EventMaster" <${process.env.SMTP_USER || 'noreply@eventmaster.com'}>`,
        to: email,
        subject: '🎉 ¡Cuenta activada exitosamente!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 ¡Cuenta Activada!</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">¡Hola ${userName}!</h2>
              
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                ¡Excelente! Tu cuenta en EventMaster ha sido activada exitosamente. 
                Ahora puedes comenzar a crear y gestionar tus eventos.
              </p>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="color: #155724; margin: 0; font-size: 14px;">
                  ✅ <strong>Tu cuenta está lista para usar</strong><br>
                  Ya puedes iniciar sesión y comenzar a crear eventos.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                   style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          font-weight: bold; 
                          display: inline-block;
                          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);">
                  🚀 Iniciar Sesión
                </a>
              </div>
            </div>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de bienvenida enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
      
    } catch (error) {
      console.error('❌ Error enviando email de bienvenida:', error);
      throw new Error('Error al enviar email de bienvenida');
    }
  }
}
