'use strict';
const {
  Model
} = require('sequelize');
const {v4} = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Collection.init({
    name: DataTypes.STRING,
    source: DataTypes.STRING,
    type: DataTypes.STRING,
    uuid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Collection',
    hooks: {
      beforeCreate: (message, options) => {
        message.uuid = v4();
      }
    },
  });
  return Collection;
};