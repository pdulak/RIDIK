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

    const saveOpenAIConversation = ({ dataToSend, answer, endpoint }) => {
        let lastUserMessage = null;
        let systemMessage = null;
        if (dataToSend && dataToSend.messages) {
            lastUserMessage = dataToSend.messages.reduceRight((prev, message) => {
                if (!prev && message.role === "user") {
                    return message;
                }
                return prev;
            }, null);
            systemMessage = dataToSend.messages.find(message => message.role === "system");
        };

        Archive.create({
            question: lastUserMessage?.content || null,
            fullContext: JSON.stringify(dataToSend),
            answer: answer,
            system: systemMessage?.content || null,
            endpoint: endpoint,
        })
    }

    return {
        checkConnection,
        saveOpenAIConversation,
        sequelize,
        SysConfig,
        Commands
    }
}

module.exports = {
    Dao,
}