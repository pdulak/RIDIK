document.getElementById('takeFirstTask').addEventListener('click', async () => {
    const APIKey = document.getElementById('APIKey').value;
    const taskName = document.getElementById('taskName').value;

    const token = await zadania_get_token(taskName)
    const data = await zadania_get_task_data(token)
    sendAnswer(token, data.cookie)
})

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