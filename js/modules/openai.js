const openaiConfig = {
    apiKey : "",
    organization : "",
    url : "https://api.openai.com/",
    model : "gpt-3.5-turbo",
}

export const initialize = (apiKey, organization) => {
    openaiConfig.apiKey = apiKey;
    openaiConfig.organization = organization;
}

export const getModels = (destination) => {
    const destinationElement = document.getElementById(destination);
    destinationElement.innerHTML = "";
    destinationElement.ariaBusy = "true";

    fetch(`${openaiConfig.url}v1/models`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${openaiConfig.apiKey}`,
            "OpenAI-Organization": openaiConfig.organization
        }
    })
        .then(response => response.json())
        .then(data => {
            destinationElement.innerHTML = JSON.stringify(data);
            destinationElement.ariaBusy = "false";
        })
        .catch(error => console.error("Error:", error));
}

export const testCompletion = async (destination) => {
    const userContent = document.getElementById("openai-prompt").value;
    const destinationElement = document.getElementById(destination);
    destinationElement.innerHTML = "";
    destinationElement.ariaBusy = "true";

    const data = await openai_completion(userContent);

    destinationElement.innerHTML = data.choices[0].message.content.split("\n").join("<br />");
    destinationElement.ariaBusy = "false";
}

export const testSpanish = async (destination) => {
    const userContent = document.getElementById("openai-prompt").value;
    const destinationElement = document.getElementById(destination);
    destinationElement.innerHTML = "";
    destinationElement.ariaBusy = "true";

    const data = await openai_completion(
        `Jesteś nauczycielem hiszpańskiego, nazywasz się Juan. 
                Użytkownik to twój uczeń. Jest na poziomie A1.
                Nie dodawaj pytania o to czy zrozumiał, ani powitania.
                Jeśli temat wymaga wyjaśnienia, wyjaśniaj po polsku, jeśli nie, odpowiadań wyłącznie po hiszpańsku.
                
                ###
                ${userContent}`);

    destinationElement.innerHTML = data.choices[0].message.content.split("\n").join("<br />")
    destinationElement.ariaBusy = "false";
}

export const moderationAPI = async (textToModerate) => {
    return await openai_json_call('v1/moderations', { "input": textToModerate });
}

export const openai_completion = async (user, system = "") => {
    const messages = [
        {"role": "user", "content": user},
        {"role": "system", "content": system}
    ];
    console.log("openai_completion messages: ", messages);
    return await openai_json_call('v1/chat/completions', {
        "model": openaiConfig.model,
        "messages": messages
    });
}

const openai_json_call = async (endpoint, dataToSend) => {
    const brain = document.getElementById('brain');
    if (brain) brain.ariaBusy = "true";

    try {
        const response = await fetch(`${openaiConfig.url}${endpoint}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openaiConfig.apiKey}`,
                "OpenAI-Organization": openaiConfig.organization,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status} on ${endpoint}`);
        }

        const data = await response.json();
        console.log(`${endpoint}: `, data);
        if (brain) brain.ariaBusy = false;
        return data;
    } catch (error) {
        console.error(`Error fetching ${endpoint} data:`, error);
        if (brain) brain.ariaBusy = false;
        return null;
    }
}

export const simpleCommandExecution = async (commandContents) => {
    const userContent = document.getElementById("openai-prompt").value;
    const destinationElement = document.getElementById("openai-results");
    destinationElement.innerHTML = "";
    destinationElement.ariaBusy = "true";

    const data = await openai_completion(commandContents + "\n\n" + userContent);

    destinationElement.innerHTML = data.choices[0].message.content.split("\n").join("<br />");
    destinationElement.ariaBusy = "false";
}