document.getElementById('inpromptTask').addEventListener('click', async () => {
    const taskName = 'inprompt';
    const data = await zadania_get_token_and_task_data(taskName)
    document.getElementById('inpromptTaskResult').innerHTML = JSON.stringify(data.question) + '<hr>' + JSON.stringify(data);

    const result = await openai_completion("Twoje dane wejściowe to: \n" +
        data.question +
        "\n\n" +
        "Twoje zadanie: w podanym pytaniu znajdź imię i podaj tylko i wyłącznie imię bez znaków przestankowych w formacie {{imię}} nic więcej", "")

    const name = result.choices[0].message.content.replace(/\{\{(\w+)\}\}/g, '$1');

    document.getElementById('inpromptTaskResult').innerHTML = name + "<hr>"

    let smallerData = "";
    for (i=0; i<data.input.length; i++) {
        if (data.input[i].search(name) >= 0) {
            smallerData += "\n" + data.input[i]
        }
    }

    document.getElementById('inpromptTaskResult').innerHTML += smallerData + "<hr>"

    const result2 = await openai_completion("Twoje dane wejściowe to: \n" +
        smallerData +
        "\n\n" +
        "Twoje zadanie: " + data.question + " Odpowiedz jak najkrócej, najlepiej jednym wyrazem", "")

    const answer = result2.choices[0].message.content;

    document.getElementById('inpromptTaskResult').innerHTML += answer + "<hr>"

    const isOK = await zadania_send_answer(answer)
    document.getElementById('inpromptTaskResult').innerHTML += '<hr>' + JSON.stringify(isOK);
})