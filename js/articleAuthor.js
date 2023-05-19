import { addMessage, addMessageInBackground, clearMessages, setModalBusy, setModalNotBusy } from "./modules/messagesModal.js";
import { openai_completion } from "./modules/openai.js";


const buildArticle = async (taskStep, task) => {
    const taskSteps = await window.daoFunctions.getTaskStepsForTask(task.dataValues.id);
    const hasArticlePart = taskSteps.some(taskStep => taskStep.dataValues.type === 'create_article_part');
    if (hasArticlePart) {
        // check if all article parts are done
        const articleParts = taskSteps.filter(taskStep => taskStep.dataValues.type === 'create_article_part');
        const allArticlePartsDone = articleParts.every(taskStep => taskStep.dataValues.is_done);
        if (allArticlePartsDone) {
            addMessage("all article parts done");
            const articleArray = articleParts.map(taskStep => {
                const theResult = JSON.parse(taskStep.dataValues.results);
                return theResult.choices[0].message.content;
            });
            const article = articleArray.join("\n\n");
            taskStep.dataValues.results = article;
            taskStep.dataValues.is_done = true;
            taskStep = await window.daoFunctions.updateTaskStep(taskStep.dataValues);
            task.dataValues.is_done = true;
            task.dataValues.status = "done";
            task = await window.daoFunctions.updateTask(task.dataValues);
            addMessage(`article: ${article}`);
        }
    }
}

const createArticlePart = async (taskStep) => {
    const theResult = await openai_completion(taskStep.dataValues.prompt);
    addMessage(`create article part result: ${JSON.stringify(theResult)}`);
    taskStep.dataValues.is_done = true;
    taskStep.dataValues.results = JSON.stringify(theResult);
    await window.daoFunctions.updateTaskStep(taskStep.dataValues);
    return taskStep;
};

const createContents = async (taskStep, task) => {
    const theResult = await openai_completion(taskStep.dataValues.prompt);
    addMessage(`create contents result: ${JSON.stringify(theResult)}`);
    const contents = theResult.choices[0].message.content.split("\n").filter(line => line.length > 0);
    addMessage(`contents: ${JSON.stringify(contents)}`);
    // create tasks for each part
    contents.forEach(async (content, index) => {
        // crete task step for each content
        const articlePart = await createArticlePartTaskStep({
            task_id: taskStep.dataValues.task_id,
            title: task.dataValues.data,
            contents: contents,
            thisPart: content,
        });
        addMessage(`new task step created: ${JSON.stringify(articlePart.dataValues.id)}`);
    });
    // create article build step
    const buildStep = await window.daoFunctions.createTaskStep({
        task_id: taskStep.dataValues.task_id,
        type: 'build_article',
        status: 'created',
    });
    addMessage(`build step created: ${JSON.stringify(buildStep.dataValues.id)}`);
    
    taskStep.dataValues.is_done = true;
    taskStep.dataValues.results = JSON.stringify(theResult);
    await window.daoFunctions.updateTaskStep(taskStep.dataValues);
    return taskStep;
};

const createArticlePartTaskStep = async ({ task_id, title, contents, thisPart }) => {
    const taskStep = await window.daoFunctions.createTaskStep({
        task_id: task_id,
        type: 'create_article_part',
        prompt: `You are an experienced article author. Your task is to write article about topic presented in "topic".
You prepared contents presented in "contents". Now you have to write two-three sentences in "section". 
Add nothing more, only two-three sentences related to "section"

### The topic:
${title}

### The contents:
${contents.join("\n")}}

### The section:
${thisPart}`,
        status: 'created',
    });
    addMessage(`new task step created: ${JSON.stringify(taskStep.dataValues)}`);
    return await processTaskStep(taskStep);
};

const processTaskStep = async (taskStep, task) => {
    addMessage(`processing: ${JSON.stringify(taskStep.dataValues)}`);
    if (taskStep.dataValues.type === 'create_contents') {
        const result = await createContents(taskStep, task);
    }
    if (taskStep.dataValues.type === 'create_article_part') {
        const result = await createArticlePart(taskStep, task);
    }
    if (taskStep.dataValues.type === 'build_article') {
        const result = await buildArticle(taskStep, task);
    }
    return taskStep;
}

const createContentsTaskStep = async (task) => {
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
    let maxSteps = 8;
    while (maxSteps > 0) {
        if (task.dataValues.status === "created") {
            addMessage(`processing task ${JSON.stringify(task.dataValues.data)}`);
            task.dataValues.status = 'processing';
            await window.daoFunctions.updateTask(task.dataValues);
        }
        if (task.dataValues.status === "processing") {
            addMessage(`looking for next step to take`);
            const taskSteps = await window.daoFunctions.getTaskStepsForTask(task.dataValues.id);
            addMessage(`steps: ${taskSteps.length}`);
            if (taskSteps.length === 0) {
                taskSteps[0] = await createContentsTaskStep(task);
            } else {
                const firstUnfinishedStep = taskSteps.find(taskStep => taskStep.dataValues.is_done === null);
                if (firstUnfinishedStep) {
                    addMessage('before task processing');
                    const result = await processTaskStep(firstUnfinishedStep, task);
                    addMessage('after task processing');
                }
            }
        }
        addMessage(`max steps left: ${maxSteps}`);
        maxSteps--;
    }
    addMessage(`task finished due to max steps reached`);
    return true;
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