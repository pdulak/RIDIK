'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SysConfigs', [{
      name: 'globalKeyboardShortcut',
      value: 'CommandOrControl+Alt+i',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('SysConfigs', null, {});
  }
};
