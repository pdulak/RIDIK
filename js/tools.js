const mainURL = 'https://url-to-zadania-api/';
const APIKey = config.config.zadaniaApiKey;
let zadania_token;

document.getElementById('APIKey').value = (config.config.zadaniaApiKey?config.config.zadaniaApiKey:"")

async function zadania_get_token(taskName) {
    try {
        const response = await fetch(`${mainURL}token/${taskName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apikey: APIKey
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log('zadania_get_token data: ', data)
        zadania_token = data.token;
        return data.token;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function zadania_get_task_data(token = zadania_token) {
    try {
        const response = await fetch(`${mainURL}task/${token}`)
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log('zadania_get_task_data data: ', data)
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function zadania_get_token_and_task_data(taskName) {
    await zadania_get_token(taskName)
    return await zadania_get_task_data()
}

async function zadania_send_answer(answer, token = zadania_token) {
    try {
        const response = await fetch(`${mainURL}answer/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                answer: answer
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log('zadania_send_answer data: ', data)
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
