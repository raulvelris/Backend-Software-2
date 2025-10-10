'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Evento', [
      {
        evento_id: 1,
        titulo: 'Conferencia Tech 2024',
        descripcion: 'Una conferencia sobre las últimas tendencias en tecnología y desarrollo de software.',
        fechaHora: new Date('2024-02-15T10:00:00'),
        imagen: 'https://example.com/conferencia-tech.jpg',
        nroParticipantes: 0,
        estadoEvento: 1, // Programado
        privacidad: 1 // Público
      },
      {
        evento_id: 2,
        titulo: 'Workshop React',
        descripcion: 'Taller práctico para aprender React desde cero hasta nivel intermedio.',
        fechaHora: new Date('2024-02-20T14:00:00'),
        imagen: 'https://example.com/react-workshop.jpg',
        nroParticipantes: 0,
        estadoEvento: 1, // Programado
        privacidad: 2 // Privado
      },
      {
        evento_id: 3,
        titulo: 'Meetup Devs',
        descripcion: 'Encuentro mensual de desarrolladores para networking y charlas técnicas.',
        fechaHora: new Date('2024-02-25T18:00:00'),
        imagen: 'https://example.com/meetup-dev.jpg',
        nroParticipantes: 0,
        estadoEvento: 1, // Programado
        privacidad: 2 // Privado
      },
      {
        evento_id: 4,
        titulo: 'Hackathon 2024',
        descripcion: 'Competencia de programación de 48 horas para crear soluciones innovadoras.',
        fechaHora: new Date('2024-03-01T09:00:00'),
        imagen: 'https://example.com/hackathon.jpg',
        nroParticipantes: 0,
        estadoEvento: 1, // Programado
        privacidad: 1 // Público
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Evento', null, {});
  }
};
