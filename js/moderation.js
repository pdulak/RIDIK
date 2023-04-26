document.getElementById('moderationApiTask').addEventListener('click', async () => {
    let responseArray = [];
    const taskName = 'moderation';
    const data = await zadania_get_token_and_task_data(taskName)
    const sentencesToModerate = data.input;
    document.getElementById('moderationResult').innerHTML = JSON.stringify(sentencesToModerate);

    const result = await moderationAPI(sentencesToModerate);
    for (i=0; i<sentencesToModerate.length; i++) {
        responseArray[i] = result.results[i].flagged?1:0;
    }
    console.log(responseArray);

    const isOK = await zadania_send_answer(responseArray)
    document.getElementById('moderationResult').innerHTML += '<hr>' + JSON.stringify(isOK);
})