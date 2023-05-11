'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Archives', 'system', { type: Sequelize.STRING });
        await queryInterface.addColumn('Archives', 'endpoint', { type: Sequelize.STRING });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Archives', 'endpoint');
        await queryInterface.removeColumn('Archives', 'system');
    }
};