'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [
      { rol_id: 1, nombre: 'Organizador' },
      { rol_id: 2, nombre: 'Asistente' },
      { rol_id: 3, nombre: 'Coorganizador' }
    ];

    // Usar updateOnDuplicate para evitar errores de duplicados
    await queryInterface.bulkInsert('Rol', roles, {
      updateOnDuplicate: ['nombre'],
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Comentado para evitar eliminación accidental en producción
    // await queryInterface.bulkDelete('Rol', null, {});
  }
};
