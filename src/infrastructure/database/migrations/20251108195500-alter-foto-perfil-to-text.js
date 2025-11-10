'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Cliente', 'foto_perfil', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'URL o base64 de la foto de perfil (puede exceder 255 chars)'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Cliente', 'foto_perfil', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'URL o base64 de la foto de perfil'
    });
  }
};
