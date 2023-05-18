'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskStep extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TaskStep.init({
    task_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    prompt: DataTypes.STRING,
    results: DataTypes.STRING,
    status: DataTypes.STRING,
    is_done: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'TaskStep',
  });
  return TaskStep;
};