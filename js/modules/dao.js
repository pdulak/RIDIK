const { sequelize, Commands, SysConfig, Archive, Fact } = require('../../models');

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

    const saveOpenAIConversation = ({ dataToSend, answer }) => {
        const lastUserMessage = dataToSend.messages.reduceRight((prev, message) => {
            if (!prev && message.role === "user") {
                return message;
            }
            return prev;
        }, null);

        Archive.create({
            question: lastUserMessage.content,
            fullContext: JSON.stringify(dataToSend),
            answer: answer,
        })
    }

    return {
        checkConnection,
        saveOpenAIConversation,
        sequelize,
        SysConfig,
        Commands,
        Archive,
        Fact,
    }
}

module.exports = {
    Dao,
}