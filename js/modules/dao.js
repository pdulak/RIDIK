const { sequelize, Commands, SysConfig, Archive, Fact } = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
        }

        Archive.create({
            question: lastUserMessage?.content || null,
            fullContext: JSON.stringify(dataToSend),
            answer: answer,
            system: systemMessage?.content || null,
            endpoint: endpoint,
        })
    }

    const findFactsBySingleKey = async (subject) => {
        return Fact.findAll({
            where: {
                [Op.or]: [
                    { tags: { [Op.like]: '%' + subject + '%' } },
                    { key: { [Op.like]: '%' + subject + '%' } }
                ]
            }
        });
    };

    const findFactsByKeywords = async (keywords) => {
        return Fact.findAll({
            where: {
                [Op.or]: [
                    {
                        tags: {
                            [Op.or]: keywords.map(keyword => ({
                                [Op.like]: '%' + keyword.trim() + '%'
                            }))
                        }
                    },
                    {
                        key: {
                            [Op.or]: keywords.map(keyword => ({
                                [Op.like]: '%' + keyword.trim() + '%'
                            }))
                        }
                    }
                ]
            },
            order: [['createdAt', 'DESC']],
            limit: 25
        });
    };

    return {
        checkConnection,
        saveOpenAIConversation,
        sequelize,
        SysConfig,
        Commands,
        Fact,
        findFactsBySingleKey,
        findFactsByKeywords,
    }
}

module.exports = {
    dao: Dao(),
}