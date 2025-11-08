'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Cliente', 'foto_perfil', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'URL o base64 de la foto de perfil'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Cliente', 'foto_perfil');
  }
};
