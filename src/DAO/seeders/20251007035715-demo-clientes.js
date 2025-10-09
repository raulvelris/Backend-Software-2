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
      },
      {
        cliente_id: 4,
        nombre: 'Laura',
        apellido: 'Ramirez',
        usuario_id: 4
      },
      {
        cliente_id: 5,
        nombre: 'Diego',
        apellido: 'Fernandez',
        usuario_id: 5
      },
      {
        cliente_id: 6,
        nombre: 'Sofia',
        apellido: 'Martinez',
        usuario_id: 6
      },
      {
        cliente_id: 7,
        nombre: 'Miguel',
        apellido: 'Hernandez',
        usuario_id: 7
      },
      {
        cliente_id: 8,
        nombre: 'Valentina',
        apellido: 'Sanchez',
        usuario_id: 8
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cliente', null, {});
  }
};
