import { initialize, openai_completion_chat } from "./js/modules/openai.js";
import { taskSolver } from "./js/tasksSolutions.js";

initialize(config.openaiApiKey, config.openaiOrganizationID);

const mainChatDiv = document.getElementById('main-chat');
let commands;


const getCurrentCommand = () => {
    let commandContents = "You are a knowledgeable and friendly assistant, here to provide support and guidance to users. Your goal is to help answer questions and provide solutions in a concise and informative manner.";
    const command = commands.find(command => command.name === document.getElementById("commands-selection").value);
    if (command) {
        commandContents = command.value;
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
    const messages = chatMessages.map(message => {
        return {
            "role" : message.dataset.role,
            "content" : message.innerText
        }
    });

    return messages;
}

const prepareDestinationElement = () => {
    mainChatDiv.innerHTML += `
        <div class="assistant">
            <article class="assistant-current" data-role="assistant"></article>
        </div>
    `;

    return document.querySelector(".assistant-current");
}


const checkIfQuesitonOrSomethingToRemember = async () => {
    const promptContents = document.getElementById("openai-prompt").value;
    const response = {
        isQuestion : false,
        isSomethingToRemember : false,
        isInMyDatabase : false,
        subject : ''
    }

    const rememberPrompt = `You are a sophisticated AI classifier. Your task is to analyze user input to determine if the user's intention is to share information for you to remember or to ask a question. Based on the user's message, provide an appropriate response using the following guidelines:

If the message contains information to remember or specifically asks you to remember something, respond with:

R|{information to remember - whole sentence}|{primary subject - single word - noun}

If the message contains a question, respond with:

Q|{primary subject - single word - noun}

For all other messages, respond with:

NO

Ensure your responses are clear, concise, and accurately reflect the user's intent. Answer only using one of the examples above.`;

    const messages =  [
        {"role": "system", "content": rememberPrompt},
        {"role": "user", "content": promptContents},
    ]

    const result = await openai_completion_chat({ messages, temperature : 0.4 });
    const answer = result.choices[0].message.content;
    console.log("answer: ", answer);
    if (answer.startsWith("Q|")) {
        response.isQuestion = true;
        response.subject = answer.split("|")[1];
        // check if is in my database, return context if available
        return response;
    }
    if (answer.startsWith("R|")) {
        response.isSomethingToRemember = true;
        response.subject = answer.split("|")[2];
        // save to database
        return response;
    }

    response.isSomethingToRemember = true;
    return response;

}

const executeMainChatProcess = async () => {
    const rememberOrQuestion = await checkIfQuesitonOrSomethingToRemember();
    console.log("rememberOrQuestion: ", rememberOrQuestion);
    const messages = pullMessagesFromMainChat();
    const destinationElement = prepareDestinationElement();

    destinationElement.ariaBusy = "true";
    openai_completion_chat({ messages, destinationElement });
    destinationElement.classList.remove("assistant-current");
    destinationElement.ariaBusy = "false";
}

document.getElementById("perform-task").addEventListener("click", () => {
    const task = document.getElementById("tasks-list").value;
    taskSolver(task);
});
document.getElementById("run-command").addEventListener("click", executeMainChatProcess);
document.getElementById("reset-chat").addEventListener("click", () => {
    mainChatDiv.innerHTML = "";
});


// resize edit field if needed
const openaiPrompt = document.getElementById('openai-prompt');
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


// get commands from database

window.daoFunctions.getCommands();

const offCommandsReceived = window.electron.on("commandsReceived", (commandsReceived) => {
    commands = commandsReceived.map(command => command.dataValues);

    // get selectbox of ID = commandsSelection and fill options using commandsReceived
    document.getElementById("commands-selection").innerHTML =
        `<option value="">Helpful assistant</option>` +
    commands.map(
        command => `
            <option value="${command.name}">
                ${command.name} - ${command.description}
            </option>`).join("");
});


// move chat window always to the bottom

let chatHeight = mainChatDiv.scrollHeight;

const observer = new MutationObserver(function(mutationList, observer) {
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