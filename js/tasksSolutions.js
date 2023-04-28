import {moderationAPI, initialize, openai_completion} from "./modules/openai.js";
import { tasksGetTokenAndTaskData, tasksSendAnswer } from "./modules/tasks.js";
import { addMessage, clearMessages, setModalBusy, setModalNotBusy } from "./modules/messagesModal.js";

initialize(config.openaiApiKey, config.openaiOrganizationID);

function startTask() {
    clearMessages();
    setModalBusy();
}

function endTask() {
    setModalNotBusy();
}

export const helloapi = async () => {
    startTask();
    const data = await tasksGetTokenAndTaskData("helloapi")
    const result = await tasksSendAnswer(data.cookie)
    addMessage(JSON.stringify(result));
    endTask();
}

export const moderation = async () => {
    startTask();

    const data = await tasksGetTokenAndTaskData("moderation");
    const sentencesToModerate = data.input;
    addMessage("Sentences: " + JSON.stringify(sentencesToModerate));

    const result = await moderationAPI(sentencesToModerate);
    const responseArray = result.results.map(element => element.flagged?1:0);
    addMessage("Moderation result: " + JSON.stringify(responseArray));

    const isOK = await tasksSendAnswer(responseArray)
    addMessage(JSON.stringify(isOK));

    endTask();
}

export const inprompt = async () => {
    startTask();

    const data = await tasksGetTokenAndTaskData("inprompt")
    addMessage("Question to answer: " + data.question);

    const result = await openai_completion("Twoje dane wejściowe to: \n" +
        data.question +
        "\n\n" +
        "Twoje zadanie: w podanym pytaniu znajdź imię i podaj tylko i wyłącznie imię bez znaków przestankowych w formacie {{imię}} nic więcej", "");

    const name = result.choices[0].message.content.replace(/\{\{(\w+)\}\}/g, "$1");
    addMessage("Name found: " + name);

    const smallerData = data.input.filter(element => (element.search(name) >= 0)).join(" ");
    addMessage("Person info: " + smallerData);

    const result2 = await openai_completion("Twoje dane wejściowe to: \n" +
        smallerData +
        "\n\n" +
        "Twoje zadanie: " + data.question + " Odpowiedz jak najkrócej, najlepiej jednym wyrazem", "")

    const answer = result2.choices[0].message.content;
    addMessage("Answer to send: " + answer);

    const isOK = await tasksSendAnswer(answer)
    addMessage(JSON.stringify(isOK));

    endTask();
}

export const blogger = async () => {
    startTask();

    const data = await tasksGetTokenAndTaskData("blogger");
    addMessage("Task data: " + JSON.stringify(data));

    const generalPrompt = "Jeste specjalistą od wypieku pizzy oraz jesteś doświadczonym pisarzem. " +
        "Piszesz wpis na blog dotyczący pizzy. Podany poniżej temat jest fragmentem tego wpisu, zatem to co " +
        "teraz napiszesz jest fragmentem większej całości. Całość składa się z następujących tematów: " +
        "\n\n" +
        data.blog.join("; ") +
        "\n\n" +
        "Napisz teraz tekst według polecenia, jak najbardziej trzymając się tego konkretnego polecenia: \n\n";

    const promises = data.blog.map(element => {
        return openai_completion(generalPrompt + element);
    });

    const results = await Promise.all(promises);
    const answer = results.map(element => element.choices[0].message.content);

    addMessage("answer: " + JSON.stringify(answer));

    const isOK = await tasksSendAnswer(answer)
    addMessage(JSON.stringify(isOK));

    endTask();
}