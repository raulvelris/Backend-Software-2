'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Ubicacion', [
      {
        ubicacion_id: 1,
        direccion: 'Centro de Convenciones Ciudad, Av. Principal 123',
        latitud: -12.0464,
        longitud: -77.0428,
        evento_id: 1
      },
      {
        ubicacion_id: 2,
        direccion: 'Universidad Tecnológica, Campus Norte',
        latitud: -12.0564,
        longitud: -77.0528,
        evento_id: 2
      },
      {
        ubicacion_id: 3,
        direccion: 'Café Tech Hub, Plaza San Martín',
        latitud: -12.0664,
        longitud: -77.0628,
        evento_id: 3
      },
      {
        ubicacion_id: 4,
        direccion: 'Parque Tecnológico, Zona Industrial',
        latitud: -12.0764,
        longitud: -77.0728,
        evento_id: 4
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Ubicacion', null, {});
  }
};
