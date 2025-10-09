'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Participante', [
      {
        participante_id: 1,
        usuario_id: 1,
        rol_id: 1 // Organizador
      },
      {
        participante_id: 2,
        usuario_id: 2,
        rol_id: 2 // Asistente
      },
      {
        participante_id: 3,
        usuario_id: 3,
        rol_id: 2 // Asistente
      },
      {
        participante_id: 4,
        usuario_id: 1,
        rol_id: 2 // Juan también es asistente en otros eventos
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Participante', null, {});
  }
};
