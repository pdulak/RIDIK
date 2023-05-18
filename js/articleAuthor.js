import { addMessage, addMessageInBackground, clearMessages, setModalBusy, setModalNotBusy } from "./modules/messagesModal.js";

const newArticle = async () => {
    const theTopic = document.getElementById('article-topic').value;

    if (theTopic && theTopic != '') {
        const newTask = await window.daoFunctions.createNewTask({ type: 'article', data: theTopic, status: 'created' });
        addMessage(`new task created: ${JSON.stringify(newTask)}`);
        // process task
    }

}

const initialize = async () => {
    document.getElementById('generate-article').addEventListener('click', newArticle);
    setModalBusy();
    addMessageInBackground("articleAuthor initialize");
    const task = await window.daoFunctions.findOneUnprocessedTask();
    if (task) {
        addMessage(`unfinished task found ${JSON.stringify(task.dataValues)}`);
        // process task
    }
    setModalNotBusy();
}

export const articleAuthor = () => {
    initialize();
}