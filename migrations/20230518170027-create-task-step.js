'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TaskSteps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      task_id: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      prompt: {
        type: Sequelize.STRING
      },
      results: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      is_done: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TaskSteps');
  }
};