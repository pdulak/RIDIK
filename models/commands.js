'use strict';

const { v4 } = require("uuid");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commands extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Commands.init({
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    description: DataTypes.STRING,
    uuid: DataTypes.STRING,
    model: DataTypes.STRING,
    webhookURL: DataTypes.STRING,
    sendToWebhook: DataTypes.BOOLEAN,
    displayWebhookResults: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Commands',
    hooks: {
      beforeCreate: (message, options) => {
        message.uuid = v4();
      }
    },
  });
  return Commands;
};