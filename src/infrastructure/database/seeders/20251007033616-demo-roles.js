'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Rol', [
      { 
        rol_id: 1, 
        nombre: 'Organizador' 
      },
      { 
        rol_id: 2, 
        nombre: 'Asistente' 
      },
      { 
        rol_id: 3, 
        nombre: 'Coorganizador' 
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Rol', null, {});
  }
};
