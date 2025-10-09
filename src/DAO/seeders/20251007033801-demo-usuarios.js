'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Usuario', [
      {
        usuario_id: 1,
        clave: 'user123',
        correo: 'user1@eventos.com',
        isActive: true
      },
      {
        usuario_id: 2,
        clave: 'user123',
        correo: 'user2@eventos.com',
        isActive: true
      },
      {
        usuario_id: 3,
        clave: 'test123',
        correo: 'user3@eventos.com',
        isActive: true
      },
      {
        usuario_id: 4,
        clave: 'user4pass',
        correo: 'user4@eventos.com',
        isActive: true
      },
      {
        usuario_id: 5,
        clave: 'user5pass',
        correo: 'user5@eventos.com',
        isActive: true
      },
      {
        usuario_id: 6,
        clave: 'user6pass',
        correo: 'user6@eventos.com',
        isActive: true
      },
      {
        usuario_id: 7,
        clave: 'user7pass',
        correo: 'user7@eventos.com',
        isActive: true
      },
      {
        usuario_id: 8,
        clave: 'user8pass',
        correo: 'user8@eventos.com',
        isActive: true
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuario', null, {});
  }
};
