'use strict';

const { v4 } = require("uuid");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Archive extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Archive.init({
    question: DataTypes.STRING,
    fullContext: DataTypes.STRING,
    answer: DataTypes.STRING,
    uuid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Archive',
    hooks: {
      beforeCreate: (message, options) => {
        message.uuid = v4();
      }
    },
  });
  return Archive;
};