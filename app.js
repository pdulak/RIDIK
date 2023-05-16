import { initialize, openai_completion_chat } from "./js/modules/openai.js";
import { taskSolver } from "./js/tasksSolutions.js";
import { collectionManager } from "./js/collectionManager.js";

initialize(config.openaiApiKey, config.openaiOrganizationID);

const mainChatDiv = document.getElementById('main-chat');
const openaiPrompt = document.getElementById('openai-prompt');
let commands;
let sendToWebhook = false;
let webhookURL = null;
let displayWebhookResults = false;

const mainPrompt =
`As a knowledgeable and affable AI assistant, your primary role is to offer comprehensive support and guidance to the user. 
You should be prepared to assist with a wide range of inquiries and tasks that the user might present.

Strive to mirror the language used by the user in your responses. This might involve mirroring their level of formality, 
tone, or specific vocabulary, unless the user specifies otherwise. For instance, if a user requests responses 
in a specific format such as code or JSON, provide the information as requested without additional commentary.

In terms of tone, aim to be upbeat and approachable. Your responses should sound natural, be grammatically flawless, 
and convey a friendly demeanor. Ensure your responses are packed with useful and visual information, 
delivered in a logical and actionable manner. Strive to make the interaction both interesting and engaging, 
similar to a casual, enjoyable conversation between friends. Feel free to occasionally sprinkle your responses 
with colloquial expressions and idiomatic phrases for an extra touch of authenticity.

While providing comprehensive responses is important, remember to prioritize brevity and clarity as much as possible. 
When required, multi-paragraph responses are acceptable, but your default should be to provide concise, to-the-point answers.

Most importantly, ensure that every response is tailored to meet the user's specific needs, 
with an emphasis on clear and relevant information. 
Your ultimate goal is to make the user's experience as pleasant and productive as possible.
`;

const classificationPrompt = `Describe my intention from message below with JSON. Focus on the beginning of it. Always return JSON and nothing more. 
Types: action|query|memory
Example:
Write a newsletter. {"type":"action"}
Save a note. {"type":"action"}
Are you Alice? {"type":"query"}
What is the name of his sister? {"type":"query"}
Remember that Alexa is a dog. {"type":"memory"}
I need to finish something important for tomorrow. Add it to my list. {"type":"action"}

###message
`;


const memoPrompt =
`As an AI assistant, your task is to prepare a 'sentence' to be stored, 
identify tags focusing on entities and key points within the sentence, and determine a single keyword of 
utmost importance from the sentence. The responses should be strictly in JSON format and include only the items specified.

Your job is to extract a memo, 
generate relevant tags based on entities and key concepts, and select a crucial keyword from the sentence. 

For example, if the user says, "Remember that Berlin, London, and Amsterdam are the biggest cities in the European Union", 
your response should be: {"memo":"Berlin, London, and Amsterdam are the biggest cities in the European Union", "tags":"Berlin,London,Amsterdam,cities,European Union","keyword":"cities"}

Alternatively, if the user says, "Remember that my friend Adam has a wife named Eve", 
your response should be: {"memo":"Adam's wife name is Eve", "tags":"Adam,Eve,wife", "keyword":"Adam"}

Your primary objective is to accurately parse and categorize the user's intent to produce the 
most relevant and useful response in JSON format and nothing more.

###sentence
`;

const questionPrompt =
`As an AI assistant, your role is to identify tags and a single keyword from a question that the user asks. 
These tags should focus on the entities and key points of the question, and the keyword should be the most 
significant term in the query. The results should be provided exclusively in JSON format, as follows: {"tags":"{tags}", "keyword":"keyword"}

For example, if the user asks, "What is the capital of France?", your response should capture the key 
points and the most important keyword. In this case, your output might look like this: {"tags":"capital,France", "keyword":"France"}

If the user asks, "How many people live in New York City?", your response could be: {"tags":"people, live, New York City", "keyword":"New York City"}

Your primary task is to extract the relevant tags and the main keyword from the user's question 
and present them in a concise, clear, and useful manner in the requested JSON format.

###question
`;

const responsePrompt =
`As an AI assistant, your task is to provide informative responses to user queries based on the data provided. 
In the {database} section is a list of relevant database records for you to utilize in constructing your response. 
Your response should be based on this provided data or, if the data is insufficient or not available, on the best of your current knowledge.

For example, if a user asks, "What is the population of New York City?" 
and the system provides data such as "New York City population: 8.4 million", you should respond accordingly, 
e.g., "The population of New York City is approximately 8.4 million."

In the event that no data or insufficient data is provided, use your training to generate a response 
that aligns with your current knowledge up until the cutoff date. 

Remember, your ultimate aim is to provide accurate, clear, and helpful responses to all user queries, 
relying on the provided data when possible and your training when necessary.

###database
[[database]]

###question
[[question]]`;

const getCurrentCommand = () => {
    let commandContents = mainPrompt;

    const command = commands.find(command => command.name === document.getElementById("commands-selection").value);
    if (command) {
        commandContents = command.value;
        console.log('selected command: ', command);
        sendToWebhook = command.sendToWebhook;
        webhookURL = command.webhookURL;
        displayWebhookResults = command.displayWebhookResults;
    } else {
        sendToWebhook = false;
        webhookURL = null;
        displayWebhookResults = false;
    }
    return commandContents;
}


const getOpenAIPromptAndCleanIt = () => {
    const promptContents = document.getElementById("openai-prompt").value;
    document.getElementById("openai-prompt").value = "";
    document.getElementById('openai-prompt').style.height = 'auto';
    return promptContents;
}


const fillCommandIfEmpty = () => {
    const numberOfElements = mainChatDiv.children.length;
    if (numberOfElements === 0) {
        mainChatDiv.innerHTML = `
            <article class="user initial-message" data-role="user">${getCurrentCommand()}</article>
            <article class="assistant initial-message" data-role="assistant">OK</article>
        `;
    }
}

const addCurrentPromptToConversation = () => {
    const promptContents = getOpenAIPromptAndCleanIt();
    mainChatDiv.innerHTML += `
        <div class="user">
            <article data-role="user">${promptContents}</article>
        </div>`;
}


const pullMessagesFromMainChat = () => {
    fillCommandIfEmpty();
    addCurrentPromptToConversation();

    const chatMessages = Array.from(document.querySelectorAll("#main-chat article"));
    return chatMessages.map(message => {
        return {
            "role" : message.dataset.role,
            "content" : message.innerText
        }
    });
}

const prepareDestinationElement = () => {
    mainChatDiv.innerHTML += `
        <div class="assistant">
            <article class="assistant-current" data-role="assistant"></article>
        </div>
    `;

    return document.querySelector(".assistant-current");
}


const handleMemoSave = async (promptContents, response) => {
    const messages = [
        {"role": "user", "content": memoPrompt + promptContents},
    ]
    const result = await openai_completion_chat({ messages });
    try {
        const parsedMemo = JSON.parse(result?.choices[0]?.message?.content || null);
        response.isSomethingToRemember = true;
        // save to database
        window.daoFunctions.createFact({
            value: parsedMemo.memo,
            source: "chat",
            tags: parsedMemo.tags,
            key: parsedMemo.keyword,
        });
        return response;
    } catch (error) {
        console.log('error parsing JSON from memo prompt', error);
        return response;
    }
}


const handleFactsRecall = async (promptContents, response) => {
    const messages = [
        {"role": "user", "content": questionPrompt + promptContents},
    ];
    const result = await openai_completion_chat({ messages });
    try {
        const parsedQuestion = JSON.parse(result?.choices[0]?.message?.content || null);
        const allTags = parsedQuestion.tags.split(',')
        allTags.push(parsedQuestion.keyword);

        const factsArray = await window.daoFunctions.findFactsByKeywords(allTags);
        response.facts = factsArray.reduce((accumulator, current) => {
            return accumulator + current.dataValues.value + '\n';
        }, '');
        response.isQuestion = true;
        response.isInMyDatabase = response.facts.length > 0;

        return response;
    } catch (error) {
        console.log('error parsing JSON from question prompt', error);
        return response;
    }
}


const checkIfQuestionOrSomethingToRemember = async () => {
    const promptContents = document.getElementById("openai-prompt").value;
    const response = {
        isQuestion : false,
        isSomethingToRemember : false,
        isInMyDatabase : false,
        facts: null,
    }

    let messages =  [
        // {"role": "system", "content": rememberPrompt},
        {"role": "user", "content": classificationPrompt + promptContents},
    ]

    let result = await openai_completion_chat({ messages, temperature : 0.4 });
    //check if answer is JSON
    try {
        const parsedAnswer = JSON.parse(result?.choices[0]?.message?.content || null);
        if (parsedAnswer.type === 'memory') {
            return handleMemoSave(promptContents, response);
        }
        if (parsedAnswer.type === 'query') {
            return handleFactsRecall(promptContents, response);
        }
    } catch (error) {
        console.log('error parsing JSON from classification prompt', error);
        return response;
    }

    return response;
}

const handleWebhookCommunication = async (openAIresponse, destinationElement) => {
    try {
        console.log('sending webhook: ', openAIresponse);
        JSON.parse(openAIresponse);
        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: openAIresponse
        })
            .then(async response => {
                if (response.ok) {
                    const responseText = await response.text();
                    destinationElement.innerHTML = responseText;
                } else {
                    console.log('Error sending webhook request.');
                }
            })
            .catch(error => {
                console.error('An error occurred while sending the webhook request:', error);
            });
    } catch (error) {
        console.log('error parsing JSON for webhook', error);
    }
}

const executeMainChatProcess = async () => {
    const rememberOrQuestion = await checkIfQuestionOrSomethingToRemember();
    const messages = pullMessagesFromMainChat();
    const destinationElement = prepareDestinationElement();
    destinationElement.ariaBusy = "true";

    if (rememberOrQuestion.isSomethingToRemember) {
        destinationElement.innerText = "OK, I will remember that.";
    } else if (rememberOrQuestion.isQuestion && rememberOrQuestion.isInMyDatabase) {
        // adjust last element of messages - introduce data from the database
        messages[messages.length - 1].content = responsePrompt
            .replace('[[database]]', rememberOrQuestion.facts)
            .replace('[[question]]', messages[messages.length - 1].content);
        openai_completion_chat({ messages, destinationElement });
    } else if (sendToWebhook) {
        destinationElement.innerText = "Let me do that for you...";
        const openAIPromise = await openai_completion_chat({ messages });
        const openAIResponse = await openAIPromise.choices[0].message.content;
        handleWebhookCommunication(openAIResponse, destinationElement);
    } else {
        openai_completion_chat({ messages, destinationElement });
    }

    destinationElement.classList.remove("assistant-current");
    destinationElement.ariaBusy = "false";
}

const setCommandsFromDatabase = async () => {
    const commandsReceived = await window.daoFunctions.getCommands();
    commands = commandsReceived.map(command => command.dataValues);

    document.getElementById("commands-selection").innerHTML =
        `<option value="">Helpful assistant</option>` +
        commands.map(
            command => `
        <option value="${command.name}">
            ${command.name} - ${command.description}
        </option>`).join("");
}

const scrollChatToBottom = () => {
    // move chat window always to the bottom
    let chatHeight = mainChatDiv.scrollHeight;

    const observer = new MutationObserver(function() {
        const newChatHeight = mainChatDiv.scrollHeight;
        if (newChatHeight !== chatHeight) {
            mainChatDiv.scrollTop = mainChatDiv.scrollHeight;
        }
        chatHeight = newChatHeight;
    });

    observer.observe(mainChatDiv, {
        attributes: false,
        childList: true,
        subtree: true }
    );
}

const prepareOpenAIPrompt = () => {
    document.getElementById("run-command").addEventListener("click", executeMainChatProcess);
    document.getElementById("reset-chat").addEventListener("click", () => {
        mainChatDiv.innerHTML = "";
    });

    // resize edit field if needed
    openaiPrompt.addEventListener('input', () => {
        openaiPrompt.style.height = 'auto';
        openaiPrompt.style.height = `${openaiPrompt.scrollHeight}px`;
    });

    openaiPrompt.addEventListener("keydown", function(event) {
        if (event.code === 'Enter' && event.ctrlKey) {
            executeMainChatProcess();
        }
    });

    openaiPrompt.focus();
}

const initializeApp = async () => {
    document.getElementById("perform-task").addEventListener("click", () => {
        const task = document.getElementById("tasks-list").value;
        taskSolver(task);
    });

    prepareOpenAIPrompt();
    setCommandsFromDatabase();
    scrollChatToBottom();
    collectionManager();
}

initializeApp();