document.getElementById('moderationApiTask').addEventListener('click', async () => {
    const taskName = 'moderation';

    const token = await zadania_get_token(taskName)
    const data = await zadania_get_task_data(token)
    document.getElementById('moderationResult').innerHTML = JSON.stringify(data);
})