import { initialize, openai_completion_chat } from "./js/modules/openai.js";
import { taskSolver } from "./js/tasksSolutions.js";

initialize(config.openaiApiKey, config.openaiOrganizationID);

const mainChatDiv = document.getElementById('main-chat');
let commands;


const getCurrentCommand = () => {
    let commandContents = "You are a helpful assistant. Respond in a language in which user asked the question.";
    const command = commands.find(command => command.name === document.getElementById("commands-selection").value);
    if (command) {
        commandContents = command.value;
    }
    return commandContents;
}


const handleCommand = () => {
    const promptContents = document.getElementById("openai-prompt").value;
    document.getElementById("openai-prompt").value = "";
    document.getElementById('openai-prompt').style.height = 'auto';
    const numberOfElements = mainChatDiv.children.length;
    if (numberOfElements === 0) {
        mainChatDiv.innerHTML = `
            <article class="user initial-message" data-role="user">${getCurrentCommand()}</article>
            <article class="assistant initial-message" data-role="assistant">OK</article>
        `;
    }
    mainChatDiv.innerHTML += `
        <div class="user">
            <article data-role="user">${promptContents}</article>
        </div>`;

    const chatMessages = Array.from(document.querySelectorAll("#main-chat article"));
    const messages = chatMessages.map(message => {
        return {
            "role" : message.dataset.role,
            "content" : message.innerText
        }
    });

    mainChatDiv.innerHTML += `
        <div class="assistant">
            <article class="assistant-current" data-role="assistant"></article>
        </div>
    `;
    const destinationElement = document.querySelector(".assistant-current");
    destinationElement.ariaBusy = "true";
    openai_completion_chat(messages, destinationElement);
    destinationElement.classList.remove("assistant-current");
    destinationElement.ariaBusy = "false";
}

document.getElementById("perform-task").addEventListener("click", () => {
    const task = document.getElementById("tasks-list").value;
    taskSolver(task);
});
document.getElementById("run-command").addEventListener("click", handleCommand);
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
        handleCommand();
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