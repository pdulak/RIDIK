const { sequelize, Commands, SysConfig, Archive, Fact, Collection, Chunk, Task, TaskStep } = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {v4} = require("uuid");

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

    const saveCollectionItem = async (data) => {
        return await Collection.create(data);
    }

    const bulkCreateChunks = async (data) => {
        const adjustedData = data.map(obj => {
            return {
                ...obj,
                uuid: v4(),
            };
        });
        return await Chunk.bulkCreate(adjustedData);
    }

    const fillChunkWithUUID = () => {
        Chunk.findAll({
            where: {
                uuid: null
            }
        }).then(chunks => {
            chunks.forEach(chunk => {
                chunk.update({
                    uuid: v4(),
                });
            });
        });
    }

    const getChunksToEmbed = async () => {
        return await Chunk.findAll({
            where: {
                externalId: null
            }
        });
    }

    const setChunkAsEmbedded = async (data) => {
        return Chunk.findByPk(data.id).then(chunk => {
            chunk.update({
                externalId: data.externalId,
            });
        });
    }

    const findChunksByUUID = async (pineconeResults) => {
        return await Chunk.findAll({
            where: {
                uuid: {
                    [Op.or]: pineconeResults.map(result => ({
                        [Op.like]: result.id
                    }))
                }
            }
        });
    };

    const findOneUnprocessedTask = async () => {
        return await Task.findOne({
            where: {
                is_done: null
            }
        });
    }

    const createNewTask = async (data) => {
        return await Task.create(data);
    }

    return {
        checkConnection,
        saveOpenAIConversation,
        sequelize,
        SysConfig,
        Commands,
        Fact,
        findFactsBySingleKey,
        findFactsByKeywords,
        saveCollectionItem,
        bulkCreateChunks,
        getChunksToEmbed,
        setChunkAsEmbedded,
        findChunksByUUID,
        findOneUnprocessedTask,
        createNewTask,
    }
}

module.exports = {
    dao: Dao(),
}