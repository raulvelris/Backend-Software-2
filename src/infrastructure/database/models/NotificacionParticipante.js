'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NotificacionParticipante extends Model {
    static associate(models) {
      // NotificacionParticipante pertenece a una NotificacionAccion
      NotificacionParticipante.belongsTo(models.NotificacionAccion, {
        foreignKey: 'notificacion_accion_id',
        targetKey: 'notificacion_id',
        as: 'notificacion_accion' // el objetivo es la clave foranea
      });
      
      // NotificacionParticipante pertenece a un Participante
      NotificacionParticipante.belongsTo(models.Participante, {
        foreignKey: 'participante_id',
        as: 'participante'
      });
    }
  }
  
  NotificacionParticipante.init({
    notificacion_accion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'NotificacionAccion',
        key: 'notificacion_id'
      }
    },
    participante_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Participante',
        key: 'participante_id'
      }
    }
  }, {
    sequelize,
    modelName: 'NotificacionParticipante',
    tableName: 'NotificacionParticipante',
    timestamps: false
  });
  
  return NotificacionParticipante;
};