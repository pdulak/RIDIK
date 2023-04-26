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

export const testCompletion = (destination) => {
    const userContent = document.getElementById("openai-prompt").value;
    const destinationElement = document.getElementById(destination);
    const destinationDebug = document.getElementById(destination + "-debug");
    destinationElement.innerHTML = "";
    destinationElement.ariaBusy = "true";

    fetch(`${openaiConfig.url}v1/chat/completions`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${openaiConfig.apiKey}`,
            "OpenAI-Organization": openaiConfig.organization,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": openaiConfig.model,
            "messages": [{"role": "user", "content": userContent}]
        })
    })
        .then(response => response.json())
        .then(data => {
            destinationElement.innerHTML = data.choices[0].message.content.split("\n").join("<br />");
            destinationElement.ariaBusy = "false";
            if (destinationDebug) {
                destinationDebug.innerHTML = JSON.stringify(data);
            }
        })
        .catch(error => console.error(error));
}

export const testSpanish = (destination) => {
    const userContent = document.getElementById("openai-prompt").value;
    const destinationElement = document.getElementById(destination);
    const destinationDebug = document.getElementById(destination + "-debug");
    destinationElement.innerHTML = "";
    destinationElement.ariaBusy = "true";

    fetch(`${openaiConfig.url}v1/chat/completions`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${openaiConfig.apiKey}`,
            "OpenAI-Organization": openaiConfig.organization,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": openaiConfig.model,
            "messages": [
                {"role": "user", "content": userContent},
                {"role": "system", "content": "" +
                        "Jesteś nauczycielem hiszpańskiego. " +
                        "Użytkownik to twój uczeń. Jest na poziomie A1. " +
                        "Nie dodawaj pytania o to czy zrozumiał, ani powitania."}
            ]
        })
    })
        .then(response => response.json())
        .then(data => {
            destinationElement.innerHTML = data.choices[0].message.content.split("\n").join("<br />")
            destinationElement.ariaBusy = "false";
            if (destinationDebug) {
                destinationDebug.innerHTML = JSON.stringify(data);
            }
        })
        .catch(error => console.error(error));
}

export async function moderationAPI(textToModerate) {
    try {
        const response = await fetch(`${openaiConfig.url}v1/moderations`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openaiConfig.apiKey}`,
                "OpenAI-Organization": openaiConfig.organization,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "input": textToModerate
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log("moderationAPI data: ", data)
        return data;

    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

export async function openai_completion(user, system) {
    try {
        const messages = [
            {"role": "user", "content": user},
            {"role": "system", "content": system}
        ]
        console.log("openai_completion messages: ", messages)
        const response = await fetch(`${openaiConfig.url}v1/chat/completions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openaiConfig.apiKey}`,
                    "OpenAI-Organization": openaiConfig.organization,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": openaiConfig.model,
                    "messages": messages
                })
            })

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log("openai_completion data: ", data)
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}