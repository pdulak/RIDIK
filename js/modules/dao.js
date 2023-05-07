const { sequelize, Commands, SysConfig } = require('../../models');

function Dao() {

    const checkConnection = async () => {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
            return true;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            return false;
        }
    }

    return {
        checkConnection,
        sequelize,
        SysConfig,
        Commands,
    }
}

module.exports = {
    Dao,
}