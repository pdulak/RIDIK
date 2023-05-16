'use strict';
const {
  Model
} = require('sequelize');
const {v4} = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Chunk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chunk.init({
    collectionId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    value: DataTypes.STRING,
    externalId: DataTypes.STRING,
    uuid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chunk',
    hooks: {
      beforeCreate: (message, options) => {
        message.uuid = v4();
      }
    },
  });
  return Chunk;
};