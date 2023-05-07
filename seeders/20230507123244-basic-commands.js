'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Commands', [
      {
        name: 'pydev',
        value: 'Act as senior Python developer. Provide code with minimal explanations.',
        description: 'Senior Python developer, no explanations',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'jsdev',
        value: 'Act as senior JavaScript developer. Provide code with minimal explanations.',
        description: 'Senior JavaScript developer, no explanations',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'cfdev',
        value: 'Act as senior ColdFusion developer. Provide code with minimal explanations.',
        description: 'Senior ColdFusion developer, no explanations',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'estutor',
        value: 'Jesteś nauczycielem Hiszpańskiego. Twój student właśnie rozpoczął naukę. Stosuj proste krótkie wyjaśnienia i proste przykłady.',
        description: 'Spanish Tutor - po polsku',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Commands', null, {});
  }
};
