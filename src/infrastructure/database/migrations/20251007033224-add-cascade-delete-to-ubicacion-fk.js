'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero eliminamos la restricción de clave foránea existente
    await queryInterface.sequelize.query(`
      ALTER TABLE "Ubicacion" 
      DROP CONSTRAINT IF EXISTS "Ubicacion_evento_id_fkey"
    `);

    // Luego volvemos a crear la restricción con ON DELETE CASCADE
    await queryInterface.sequelize.query(`
      ALTER TABLE "Ubicacion" 
      ADD CONSTRAINT "Ubicacion_evento_id_fkey" 
      FOREIGN KEY ("evento_id") 
      REFERENCES "Evento" ("evento_id") 
      ON DELETE CASCADE
    `);
  },

  async down(queryInterface, Sequelize) {
    // En caso de rollback, volvemos a la restricción original sin CASCADE
    await queryInterface.sequelize.query(`
      ALTER TABLE "Ubicacion" 
      DROP CONSTRAINT IF EXISTS "Ubicacion_evento_id_fkey"
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Ubicacion" 
      ADD CONSTRAINT "Ubicacion_evento_id_fkey" 
      FOREIGN KEY ("evento_id") 
      REFERENCES "Evento" ("evento_id")
    `);
  }
};
