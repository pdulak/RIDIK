const mainURL = 'https://url-to-zadania-api/';
document.getElementById('APIKey').value = (config.config.zadaniaApiKey?config.config.zadaniaApiKey:"")

document.getElementById('takeFirstTask').addEventListener('click', async () => {
    const APIKey = document.getElementById('APIKey').value;
    const taskName = document.getElementById('taskName').value;

    fetch(`${mainURL}token/${taskName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apikey: APIKey
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            document.getElementById('taskResult').innerHTML += '<h4>Token data:</h4>' + JSON.stringify(data) + '<hr>'

            if (data.code === 0) {
                pullTask(data.token)
            }
        })
        .catch(error => console.error(error));
})

function pullTask(token) {
    fetch(`${mainURL}task/${token}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            document.getElementById('taskResult').innerHTML += '<h4>Task data:</h4>' + JSON.stringify(data) + '<hr>'

            if (data.cookie) {
                sendAnswer(token, data.cookie)
            }
        })
        .catch(error => console.error(error));
}

function sendAnswer(token, answer) {
    fetch(`${mainURL}answer/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            answer: answer
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            document.getElementById('taskResult').innerHTML += '<h4>Answer data:</h4>' + JSON.stringify(data) + '<hr>'
        })
        .catch(error => console.error(error));
}