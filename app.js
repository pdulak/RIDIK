import { initialize, getModels, testCompletion, testSpanish } from "./js/modules/openai.js";
import { helloapi, moderation, inprompt, blogger } from "./js/tasksSolutions.js";

initialize(config.openaiApiKey, config.openaiOrganizationID);

let commands;

document.getElementById("get-models").addEventListener("click", () => getModels("openai-results"));
document.getElementById("test-completion").addEventListener("click", () => testCompletion("openai-results"));
document.getElementById("test-spanish").addEventListener("click", () => testSpanish("openai-results"));
document.getElementById("hello-api-task").addEventListener("click", helloapi);
document.getElementById("moderation-task").addEventListener("click", moderation);
document.getElementById("inprompt-task").addEventListener("click", inprompt);
document.getElementById("blogger-task").addEventListener("click", blogger);

// resize edit field if needed
const openaiPrompt = document.getElementById('openai-prompt');
openaiPrompt.addEventListener('input', () => {
    openaiPrompt.style.height = 'auto';
    openaiPrompt.style.height = `${openaiPrompt.scrollHeight}px`;
});

window.daoFunctions.getCommands();

const offCommandsReceived = window.electron.on("commandsReceived", (commandsReceived) => {
    commands = commandsReceived.map(command => command.dataValues);

    // get selectbox of ID = commandsSelection and fill options using commandsReceived
    document.getElementById("commands-selection").innerHTML =
        `<option value="">Helpful assistant</option>` +
    commands.map(
        command => `
            <option value="${command.name}">
                ${command.description}
            </option>`).join("");
});