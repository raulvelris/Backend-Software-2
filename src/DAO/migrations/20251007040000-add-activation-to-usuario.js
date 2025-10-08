'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuario', 'activationToken', {
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true
    });
    await queryInterface.addColumn('Usuario', 'activationExpires', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.changeColumn('Usuario', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Usuario', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
    await queryInterface.removeColumn('Usuario', 'activationExpires');
    await queryInterface.removeColumn('Usuario', 'activationToken');
  }
};


