'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Usuario', [
      {
        usuario_id: 1,
        clave: 'admin123',
        correo: 'admin@eventos.com',
        isActive: true
      },
      {
        usuario_id: 2,
        clave: 'user123',
        correo: 'usuario@eventos.com',
        isActive: true
      },
      {
        usuario_id: 3,
        clave: 'test123',
        correo: 'test@eventos.com',
        isActive: true
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuario', null, {});
  }
};
