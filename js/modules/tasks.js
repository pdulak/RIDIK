const tasksConfig = {
    apiKey : (config.config.zadaniaApiKey?config.config.zadaniaApiKey:""),
    token : "",
    url : "https://url-to-zadania-api/"
}

export const tasksGetToken = async (taskName) => {
    try {
        const response = await fetch(`${tasksConfig.url}token/${taskName}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                apikey: tasksConfig.apiKey
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log("tasksGetToken data: ", data)
        tasksConfig.token = data.token;
        return data.token;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

export const tasksGetTaskData = async (token = tasksConfig.token) => {
    try {
        const response = await fetch(`${tasksConfig.url}task/${token}`)
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log("tasksGetTaskData data: ", data)
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

export const tasksGetTokenAndTaskData = async (taskName) => {
    await tasksGetToken(taskName)
    return await tasksGetTaskData()
}

export const tasksSendAnswer = async (answer, token = tasksConfig.token) => {
    try {
        const response = await fetch(`${tasksConfig.url}answer/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                answer: answer
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log("tasksSendAnswer data: ", data)
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}