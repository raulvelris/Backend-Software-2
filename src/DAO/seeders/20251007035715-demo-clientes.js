'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cliente', [
      {
        cliente_id: 1,
        nombre: 'Juan',
        apellido: 'Perez',
        usuario_id: 1
      },
      {
        cliente_id: 2,
        nombre: 'Maria',
        apellido: 'Gonzalez',
        usuario_id: 2
      },
      {
        cliente_id: 3,
        nombre: 'Carlos',
        apellido: 'Lopez',
        usuario_id: 3
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cliente', null, {});
  }
};
