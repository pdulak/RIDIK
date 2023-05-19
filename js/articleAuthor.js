import { addMessage, addMessageInBackground, clearMessages, setModalBusy, setModalNotBusy } from "./modules/messagesModal.js";
import { openai_completion } from "./modules/openai.js";

const createArticlePart = async ({ task_id, title, parts, thisPart }) => {
    const taskStep = await window.daoFunctions.createTaskStep({
        task_id: task_id,
        type: 'create_article_part',
        prompt: `You are an experienced article author. Your task is to write article about topic presented in "topic".
You prepared contents presented in "contents". Now you have to write two-three sentences in "section". 
Add nothing more, only two-three sentences related to "section"

### The topic:
${title}

### The contents:
${parts.join("\n")}}

### The section:
${thisPart}`,
        status: 'created',
    });
    addMessage(`new task step created: ${JSON.stringify(taskStep.dataValues)}`);
    await processTaskStep(taskStep);
};

const processTaskStep = async (taskStep, task) => {
    addMessage(`processing: ${JSON.stringify(taskStep.dataValues)}`);
    if (taskStep.dataValues.type === 'create_contents') {
        const theResult = await openai_completion(taskStep.dataValues.prompt);
        addMessage(`create contents result: ${JSON.stringify(theResult)}`);
        const contents = theResult.choices[0].message.content.split("\n").filter(line => line.length > 0);
        addMessage(`contents: ${JSON.stringify(contents)}`);
        contents.forEach(async (content, index) => {
            // crete task step for each content
            const articlePart = await createArticlePart({
                task_id: taskStep.dataValues.task_id,
                title: task.dataValues.data,
                parts: contents,
                thisPart: content,
            });
            addMessage(`new task step created: ${JSON.stringify(articlePart.dataValues)}`);
        });
        taskStep.dataValues.is_done = true;
        taskStep.dataValues.results = JSON.stringify(theResult);
        await window.daoFunctions.updateTaskStep(taskStep.dataValues);
    }
    if (taskStep.dataValues.type === 'create_article_part') {
        const theResult = await openai_completion(taskStep.dataValues.prompt);
        addMessage(`create article part result: ${JSON.stringify(theResult)}`);
        taskStep.dataValues.is_done = true;
        taskStep.dataValues.results = JSON.stringify(theResult);
        await window.daoFunctions.updateTaskStep(taskStep.dataValues);
    }
}

const createContents = async (task) => {
    const taskStep = await window.daoFunctions.createTaskStep({
        task_id: task.dataValues.id,
        type: 'create_contents',
        prompt: `You are an experienced article author. Your task is to write article about topic presented in "topic".
Your first task is to create a three-five points that will act as contents of your article. Write them down as a numbered list. 
Add nothing more, only numbered list of points with contents of your article.

### The topic:
        ${task.dataValues.data}`,
        status: 'created',
    });
    addMessage(`new task step created: ${JSON.stringify(taskStep.dataValues)}`);
    await processTaskStep(taskStep, task);
}

const processTask = async (task) => {
    let maxSteps = 1;
    while (maxSteps > 0) {
        if (task.dataValues.status === "created") {
            addMessage(`processing task ${JSON.stringify(task.dataValues)}`);
            task.dataValues.status = 'processing';
            await window.daoFunctions.updateTask(task.dataValues);
        }
        if (task.dataValues.status === "processing") {
            addMessage(`looking for next step to take`);
            const taskSteps = await window.daoFunctions.getTaskStepsForTask(task.dataValues.id);
            addMessage(`steps: ${JSON.stringify(taskSteps)}`);
            if (taskSteps.length === 0) {
               taskSteps[0] = await createContents(task);
            }
            taskSteps.forEach(async (taskStep) => {
                if (taskStep.dataValues.is_done === null) {
                    await processTaskStep(taskStep, task);
                }
            });
        }
        maxSteps--;
    }
    addMessage(`task ${JSON.stringify(task.dataValues)} finished due to max steps reached`);
}

const newArticle = async () => {
    const theTopic = document.getElementById('article-topic').value;

    if (theTopic && theTopic != '') {
        const newTask = await window.daoFunctions.createNewTask({ type: 'article', data: theTopic, status: 'created' });
        addMessage(`new task created: ${JSON.stringify(newTask.dataValues)}`);
        processTask(newTask);
    }

}

const initialize = async () => {
    document.getElementById('generate-article').addEventListener('click', newArticle);
    setModalBusy();
    addMessageInBackground("articleAuthor initialize");
    const task = await window.daoFunctions.findOneUnprocessedTask();
    if (task) {
        addMessage(`unfinished task found ${JSON.stringify(task.dataValues)}`);
        processTask(task);
    }
    setModalNotBusy();
}

export const articleAuthor = () => {
    initialize();
}