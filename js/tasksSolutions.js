import {moderationAPI, initialize, openai_completion} from "./modules/openai.js";
import { tasksGetTokenAndTaskData, tasksSendAnswer } from "./modules/tasks.js";

initialize(config.openaiApiKey, config.openaiOrganizationID);

export const helloapi = async () => {
    const data = await tasksGetTokenAndTaskData("helloapi")
    const result = await tasksSendAnswer(data.cookie)
    document.getElementById("taskResult").innerHTML = JSON.stringify(result)
}

export const moderation = async () => {
    const data = await tasksGetTokenAndTaskData("moderation");
    const sentencesToModerate = data.input;
    document.getElementById("moderationResult").innerHTML = "<hr>Sentences: " + JSON.stringify(sentencesToModerate);

    const result = await moderationAPI(sentencesToModerate);
    const responseArray = result.results.map(element => element.flagged?1:0);
    document.getElementById("moderationResult").innerHTML += "<hr>Moderation result: " + JSON.stringify(responseArray);

    const isOK = await tasksSendAnswer(responseArray)
    document.getElementById("moderationResult").innerHTML += "<hr>" + JSON.stringify(isOK);
}

export const inprompt = async () => {
    const data = await tasksGetTokenAndTaskData("inprompt")
    document.getElementById("inpromptTaskResult").innerHTML = "Question to answer: " + data.question + "<hr>";
    const result = await openai_completion("Twoje dane wejściowe to: \n" +
        data.question +
        "\n\n" +
        "Twoje zadanie: w podanym pytaniu znajdź imię i podaj tylko i wyłącznie imię bez znaków przestankowych w formacie {{imię}} nic więcej", "");

    const name = result.choices[0].message.content.replace(/\{\{(\w+)\}\}/g, "$1");
    document.getElementById("inpromptTaskResult").innerHTML += "Name found: " + name + "<hr>";

    const smallerData = data.input.filter(element => (element.search(name) >= 0)).join(" ");
    document.getElementById("inpromptTaskResult").innerHTML += "Person info: " + smallerData + "<hr>"

    const result2 = await openai_completion("Twoje dane wejściowe to: \n" +
        smallerData +
        "\n\n" +
        "Twoje zadanie: " + data.question + " Odpowiedz jak najkrócej, najlepiej jednym wyrazem", "")

    const answer = result2.choices[0].message.content;
    document.getElementById("inpromptTaskResult").innerHTML += "Answer to send: " + answer + "<hr>"

    const isOK = await tasksSendAnswer(answer)
    document.getElementById("inpromptTaskResult").innerHTML += "<hr>" + JSON.stringify(isOK);
}