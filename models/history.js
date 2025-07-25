'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.Packet, {
        foreignKey: 'id_packet',
        as: 'packet',
      });
    }
  }
  History.init({
    id_packet: DataTypes.INTEGER,
    packet_name: DataTypes.STRING,
    status: DataTypes.STRING,
    createdAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};