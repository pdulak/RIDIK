'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Commands', 'uuid', { type: Sequelize.STRING });
        await queryInterface.addColumn('Commands', 'model', { type: Sequelize.STRING });
        await queryInterface.bulkUpdate('Commands', { model: 'gpt-3.5-turbo' });
        await queryInterface.bulkInsert('Commands', [
            {
                name: 'refactor',
                value: 'Please review the code provided in the {message}. Keep in mind that it\'s only a fragment, so some references may not be complete. Analyze the code in terms of logic, good practices, readability, naming conventions, and overall "clean code" practices. Be critical and provide a concise set of bullet points that will help an experienced developer fix the code if needed.',
                description: 'Review code fragment',
                model: 'gpt-3.5-turbo',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Commands', 'uuid');
        await queryInterface.removeColumn('Commands', 'model');
    }
};