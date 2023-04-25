const OPENAI_API_KEY = config.config.openaiApiKey;
const OPENAI_ORGANIZATION = config.config.openaiOrganizationID;
const OPENAI_URL = 'https://api.openai.com/'
const OPENAI_MODEL = 'gpt-3.5-turbo'

function getModels(destination) {
    fetch(`${OPENAI_URL}v1/models`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Organization': OPENAI_ORGANIZATION
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById(destination).innerHTML = JSON.stringify(data);
        })
        .catch(error => console.error('Error:', error));
}

function testCompletion(destination) {
    const userContent = document.getElementById('openai-prompt').value;
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
            console.log(data)
            document.getElementById(destination).innerHTML = JSON.stringify(data)
        })
        .catch(error => console.error(error));
}
