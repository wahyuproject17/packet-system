'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Packet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Packet.hasMany(models.History, {
        foreignKey: 'id_packet',
        as: 'histories',
      });
    }
  }
  Packet.init({
    packet_name: DataTypes.STRING,
    receipt_number: DataTypes.STRING,
    destination: DataTypes.STRING,
    status: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Packet',
  });
  return Packet;
};