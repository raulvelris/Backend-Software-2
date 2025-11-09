'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TipoRecurso', [
      {
        nombre: 'Enlace'
      },
      {
        nombre: 'Archivo'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TipoRecurso', null, {});
  }
};
