'use strict';

const { v4 } = require("uuid");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Fact.init({
    value: DataTypes.STRING,
    source: DataTypes.STRING,
    tags: DataTypes.STRING,
    key: DataTypes.STRING,
    uuid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Fact',
    hooks: {
      beforeCreate: (message, options) => {
        message.uuid = v4();
      }
    },
  });
  return Fact;
};