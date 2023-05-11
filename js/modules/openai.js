const openaiConfig = {
    apiKey : "",
    organization : "",
    url : "https://api.openai.com/",
    model : "gpt-3.5-turbo",
}

const escape = document.createElement('textarea');

const escapeHTML = (html) => {
    escape.textContent = html;
    return escape.innerHTML;
}

const unescapeHTML = (html) => {
    escape.innerHTML = html;
    return escape.textContent;
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

export const moderationAPI = async (textToModerate) => {
    return await openai_json_call('v1/moderations', { "input": textToModerate });
}

export const openai_completion = async (user, system = "", destinationElement = null) => {
    const messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ];
    console.log("openai_completion messages: ", messages);
    return await openai_json_call('v1/chat/completions', {
        "model": openaiConfig.model,
        "messages": messages,
        stream: (destinationElement?true:false),
    }, destinationElement);
}


export const openai_completion_chat = async ({ messages, destinationElement = null, temperature = 1} ) => {
    console.log("openai_completion_chat messages: ", messages);
    return await openai_json_call('v1/chat/completions', {
        "model": openaiConfig.model,
        "messages": messages,
        "temperature": temperature,
        stream: (destinationElement?true:false),
    }, destinationElement);
}


const openai_json_call = async (endpoint, dataToSend, destinationElement = null) => {
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

        if (destinationElement) {
            let answer = '';
            destinationElement.innerText = "";
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                const lines = decoder.decode(value).split('\n').filter(line => line.trim() !== '');
                for (const line of lines) {
                    const message = line.replace(/^data: /, '');
                    if (message === '[DONE]') {
                        break;
                    }
                    try {
                        const parsed = JSON.parse(message);
                        const content = (parsed.choices[0].delta.content) ?? '';
                        answer += content;
                        destinationElement.innerText = answer;
                    } catch (error) {
                        console.error('Could not JSON parse stream message', message, error);
                    }
                }
            }

            if (brain) brain.ariaBusy = false;
            window.daoFunctions.saveOpenAIConversation({ dataToSend, answer, endpoint });
            return "";

        } else {
            const result = await response.json();
            let answer = '';
            if (
                result &&
                result.choices &&
                result.choices[0] &&
                result.choices[0].message &&
                result.choices[0].message.content
            ) {
                answer = result.choices[0].message.content;
            } else {
                answer = JSON.stringify(result);
            }
            window.daoFunctions.saveOpenAIConversation({ dataToSend, answer, endpoint });
            if (brain) brain.ariaBusy = false;
            return result;
        }
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

    destinationElement.innerHTML = escapeHTML(data.choices[0].message.content).split("\n").join("<br />");
    destinationElement.ariaBusy = "false";
}

export const simpleCommandWithStreaming = async (commandContents, destinationElement) => {
    const userContent = document.getElementById("openai-prompt").value;
    destinationElement.ariaBusy = "true";
    const data = await openai_completion(commandContents + "\n\n" + userContent, "", destinationElement);
    destinationElement.ariaBusy = "false";
}