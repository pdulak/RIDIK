import { initialize, getModels, testCompletion, testSpanish } from "./js/modules/openai.js";
import {helloapi, moderation, inprompt} from "./js/tasksSolutions.js";

initialize(config.openaiApiKey, config.openaiOrganizationID);

document.getElementById("get-models").addEventListener("click", () => getModels("openai-results"));
document.getElementById("test-completion").addEventListener("click", () => testCompletion("openai-results"));
document.getElementById("test-spanish").addEventListener("click", () => testSpanish("openai-results"));
document.getElementById("takeFirstTask").addEventListener("click", helloapi);
document.getElementById("moderationApiTask").addEventListener("click", moderation);
document.getElementById("inpromptTask").addEventListener("click", inprompt);