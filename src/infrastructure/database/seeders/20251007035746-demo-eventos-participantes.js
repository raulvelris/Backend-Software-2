'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('EventoParticipante', [
      {
        evento_id: 1,
        participante_id: 1 
      },
      {
        evento_id: 1,
        participante_id: 4 
      },
      {
        evento_id: 2,
        participante_id: 3 
      },
      {
        evento_id: 2,
        participante_id: 2 
      },
      {
        evento_id: 3,
        participante_id: 5 
      },
      {
        evento_id: 3,
        participante_id: 8 
      },
      {
        evento_id: 4,
        participante_id: 5 
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EventoParticipante', null, {});
  }
};
