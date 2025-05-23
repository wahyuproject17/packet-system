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
    }
  }
  History.init({
    id_packet: DataTypes.INTEGER,
    entry_date: DataTypes.DATE,
    exit_date: DataTypes.DATE,
    courier_photo: DataTypes.STRING,
    user_photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};