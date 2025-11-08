'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NotificacionAccion extends Model {
    static associate(models) {
      // Una NotificacionAccion pertenece a una Notificacion
      NotificacionAccion.belongsTo(models.Notificacion, {
        foreignKey: 'notificacion_id',
        as: 'notificacion'
      });
      
      // Una NotificacionAccion puede tener muchos Participantes (a través de NotificacionParticipante)
      NotificacionAccion.belongsToMany(models.Participante, {
        through: models.NotificacionParticipante,
        foreignKey: 'participante_id',
        as: 'participantes'
      });
    }
  }
  
  NotificacionAccion.init({
    notificacion_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Notificacion',
        key: 'notificacion_id'
      }
    },
    mensaje: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'NotificacionAccion',
    tableName: 'NotificacionAccion',
    timestamps: false
  });
  
  return NotificacionAccion;
};
