const OPENAI_API_KEY = config.config.openaiApiKey;
const OPENAI_ORGANIZATION = config.config.openaiOrganizationID;
const OPENAI_URL = 'https://api.openai.com/'
const OPENAI_MODEL = 'gpt-3.5-turbo'

function getModels(destination) {
    const destinationElement = document.getElementById(destination);
    destinationElement.innerHTML = '';
    destinationElement.ariaBusy = 'true';

    fetch(`${OPENAI_URL}v1/models`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Organization': OPENAI_ORGANIZATION
        }
    })
        .then(response => response.json())
        .then(data => {
            destinationElement.innerHTML = JSON.stringify(data);
            destinationElement.ariaBusy = 'false';
        })
        .catch(error => console.error('Error:', error));
}

function testCompletion(destination) {
    const userContent = document.getElementById('openai-prompt').value;
    const destinationElement = document.getElementById(destination);
    const destinationDebug = document.getElementById(destination + '-debug');
    destinationElement.innerHTML = '';
    destinationElement.ariaBusy = 'true';

    fetch(`${OPENAI_URL}v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Organization': OPENAI_ORGANIZATION,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'model': OPENAI_MODEL,
            'messages': [{'role': 'user', 'content': userContent}]
        })
    })
        .then(response => response.json())
        .then(data => {
            destinationElement.innerHTML = data.choices[0].message.content.split("\n").join("<br />");
            destinationElement.ariaBusy = 'false';
            if (destinationDebug) {
                destinationDebug.innerHTML = JSON.stringify(data);
            }
        })
        .catch(error => console.error(error));
}

function testSpanish(destination) {
    const userContent = document.getElementById('openai-prompt').value;
    const destinationElement = document.getElementById(destination);
    const destinationDebug = document.getElementById(destination + '-debug');
    destinationElement.innerHTML = '';
    destinationElement.ariaBusy = 'true';

    fetch(`${OPENAI_URL}v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Organization': OPENAI_ORGANIZATION,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'model': OPENAI_MODEL,
            'messages': [
                {'role': 'user', 'content': userContent},
                {'role': 'system', 'content': '' +
                        'Jesteś nauczycielem hiszpańskiego. ' +
                        'Użytkownik to twój uczeń. Jest na poziomie A1. ' +
                        'Nie dodawaj pytania o to czy zrozumiał, ani powitania.'}
            ]
        })
    })
        .then(response => response.json())
        .then(data => {
            destinationElement.innerHTML = data.choices[0].message.content.split("\n").join("<br />")
            destinationElement.ariaBusy = 'false';
            if (destinationDebug) {
                destinationDebug.innerHTML = JSON.stringify(data);
            }
        })
        .catch(error => console.error(error));
}

async function moderationAPI(textToModerate) {
    try {
        const response = await fetch(`${OPENAI_URL}v1/moderations`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'OpenAI-Organization': OPENAI_ORGANIZATION,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'input': textToModerate
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log('moderationAPI data: ', data)
        return data;

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function openai_completion(user, system) {
    try {
        const messages = [
            {'role': 'user', 'content': user},
            {'role': 'system', 'content': system}
        ]
        console.log('openai_completion messages: ', messages)
        const response = await fetch(`${OPENAI_URL}v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'OpenAI-Organization': OPENAI_ORGANIZATION,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'model': OPENAI_MODEL,
                    'messages': messages
                })
            })

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        console.log('openai_completion data: ', data)
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}