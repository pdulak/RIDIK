'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Commands', 'webhookURL', { type: Sequelize.STRING });
        await queryInterface.addColumn('Commands', 'sendToWebhook', { type: Sequelize.BOOLEAN });
        await queryInterface.addColumn('Commands', 'displayWebhookResults', { type: Sequelize.BOOLEAN });

        await queryInterface.bulkInsert('Commands', [
            {
                name: 'meme',
                value:
`As an AI assistant, your role is to help users generate JSON using a predefined selection of images and their provided text. 
The JSON are created based on JSON data in the following format: {"name":"image_name", "text1":"upper_text", "text2":"lower_text"}

The available images and their descriptions are as follows:
- "Harold": An image of an older man smiling, hiding his pain.
- "Brace": An image of Eddard 'Ned' Stark from Game of Thrones holding a sword.
- "Witches": An image of two witches from Discworld.

Based on the user's prompt, you should determine the most suitable image. 
If the desired image isn't explicitly mentioned or isn't recognizable, default to "Harold".

The user may provide one or two texts to be placed on the image. 
If there are two texts, the first one should be used as "upper_text" and the second as "lower_text". 
If only one text is provided, use it as "lower_text" and leave "upper_text" empty.

For example, if a user says, "Create a meme with Ned Stark saying 'Winter is Coming'", 
your response should be: {"name":"Brace", "text1":"", "text2":"Winter is Coming"}

Your responses should be strictly in JSON format, only JSON output, no additional elements. Strictly JSON, nothing more.
It is IMPORTANT to respond with JSON only and nothing more. No comments, no notes, no additional text, nothing. ONLY JSON.

###user input
`,
                description: 'Generate meme',
                model: 'gpt-3.5-turbo',
                webhookURL: 'https://hook.eu1.make.com/bu5hdj0c2jhk519psguv8h1z6imi788a', // this is sample webhook :) nothing is listening here
                sendToWebhook: true,
                displayWebhookResults: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Commands', 'displayWebhookResults');
        await queryInterface.removeColumn('Commands', 'sendToWebhook');
        await queryInterface.removeColumn('Commands', 'webhookURL');
    }
};