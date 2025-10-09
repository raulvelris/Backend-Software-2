'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Crear notificaciones
    await queryInterface.bulkInsert('Notificacion', [
      {
        notificacion_id: 1,
        fechaHora: new Date('2024-01-15T10:00:00'),
        evento_id: 1
      },
      {
        notificacion_id: 2,
        fechaHora: new Date('2024-01-20T14:00:00'),
        evento_id: 2
      },
      {
        notificacion_id: 3,
        fechaHora: new Date('2024-01-25T18:00:00'),
        evento_id: 3
      }
    ], {});

    // Crear invitaciones
    await queryInterface.bulkInsert('Invitacion', [
      {
        notificacion_id: 1,
        fechaLimite: new Date('2024-02-10T23:59:59')
      },
      {
        notificacion_id: 2,
        fechaLimite: new Date('2024-02-15T23:59:59')
      },
      {
        notificacion_id: 3,
        fechaLimite: new Date('2024-02-20T23:59:59')
      }
    ], {});

    // Crear invitaciones de usuario
    await queryInterface.bulkInsert('InvitacionUsuario', [
      {
        invitacion_usuario_id: 1,
        confirmacion: false,
        estado_invitacion_id: 1, // pendiente
        invitacion_id: 1,
        usuario_id: 2 // Invitación a María para evento 1
      },
      {
        invitacion_usuario_id: 2,
        confirmacion: true,
        estado_invitacion_id: 2, // aceptada
        invitacion_id: 2,
        usuario_id: 3 // Invitación a Carlos para evento 2 (aceptada)
      },
      {
        invitacion_usuario_id: 3,
        confirmacion: false,
        estado_invitacion_id: 3, // rechazada
        invitacion_id: 3,
        usuario_id: 2 // Invitación a María para evento 3 (rechazada)
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('InvitacionUsuario', null, {});
    await queryInterface.bulkDelete('Invitacion', null, {});
    await queryInterface.bulkDelete('Notificacion', null, {});
  }
};
