document.getElementById('takeFirstTask').addEventListener('click', async () => {
    const taskName = document.getElementById('taskName').value;

    const data = await zadania_get_token_and_task_data(taskName)
    const result = await zadania_send_answer(data.cookie)
    document.getElementById('taskResult').innerHTML = JSON.stringify(result)
})
