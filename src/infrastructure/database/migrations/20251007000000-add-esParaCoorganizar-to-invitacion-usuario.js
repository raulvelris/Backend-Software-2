'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar si la columna ya existe
    const table = await queryInterface.describeTable('InvitacionUsuario');
    if (!table.esParaCoorganizar) {
      await queryInterface.addColumn('InvitacionUsuario', 'esParaCoorganizar', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      });
      console.log('✅ Columna esParaCoorganizar agregada a InvitacionUsuario');
    } else {
      console.log('ℹ️ La columna esParaCoorganizar ya existe en InvitacionUsuario');
    }
  },

  async down(queryInterface, Sequelize) {
    // Comentado para evitar eliminación accidental en producción
    // await queryInterface.removeColumn('InvitacionUsuario', 'esParaCoorganizar');
  }
};
