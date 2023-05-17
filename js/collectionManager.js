const collectionFields = {
    name: document.getElementById('collection-name'),
    source: document.getElementById('collection-source'),
    type: document.getElementById('collection-type'),
    contents: document.getElementById('collection-contents'),
    chunks: document.getElementById('collection-chunks'),
};
import { openai_embedding } from './modules/openai.js';
import { initialize, pineconeUpsert } from './modules/pinecone.js';
const collectionSaveButton = document.getElementById('save-collection');
const embeddingDiv = document.getElementById('embedding-elements');


const clearCollectionFields = () => {
    Object.keys(collectionFields).forEach((key) => {
        collectionFields[key].value = '';
    });
}

const sliceCollection = () => {
    const contents = collectionFields.contents.value;
    let lines = contents.split('\n');
    lines = lines.filter(line => !(line.trim() === ''));
    lines = lines.filter(line => (!line.includes(' > Location ') && !line.startsWith('Location ')) );
    const newText = lines.join('\n[chunk]\n'); // .replace(/\n\n/g, '\n[chunk]\n');
    collectionFields.chunks.value = newText;
}

const saveCollection = async () => {
    sliceCollection();
    const data = {
        name: collectionFields.name.value,
        source: collectionFields.source.value,
        type: collectionFields.type.value,
    };

    if (collectionFields.name.value.trim() === '') {
        // skip
    } else {
        const collection = await window.daoFunctions.saveCollectionItem(data);
        const theID = collection.dataValues.id;

        const chunksRaw = collectionFields.chunks.value.split('[chunk]');
        const chunks = chunksRaw.map(chunk => {
            return {
                collectionId: theID,
                type: 'chunk',
                value: chunk.trim(),
            }
        });

        window.daoFunctions.bulkCreateChunks(chunks);

        clearCollectionFields();
    }
}

const loadEmbedding = async () => {
    const chunksToEmbed = await window.daoFunctions.getChunksToEmbed();
    embeddingDiv.innerHTML = '';

    // for each element of chunksToEmbed create div with id and text
    chunksToEmbed.forEach(chunk => {
        const newDiv = document.createElement('div');
        newDiv.dataset.id = chunk.dataValues.id;
        newDiv.dataset.uuid = chunk.dataValues.uuid;
        newDiv.innerText = chunk.dataValues.value;
        newDiv.classList.add('ready-to-embed');
        embeddingDiv.appendChild(newDiv);
    });
}

const makeChunkDisappear = (chunkDiv) => {
    chunkDiv.classList.add('success');
    chunkDiv.ariaBusy = 'false';
    chunkDiv.style.transition = "opacity 600ms";
    chunkDiv.style.opacity = "0";
    setTimeout(() => {
        chunkDiv.style.display = "none";
    }, 600);
}

const embedAndHide = (chunkDiv) => {
    chunkDiv.classList.remove('ready-to-embed');
    chunkDiv.ariaBusy = 'true';

    openai_embedding(chunkDiv.innerText)
        .then(result => {
            const vectors = result.data[0].embedding;
            pineconeUpsert({
                vectors: [
                    {
                        id: chunkDiv.dataset.uuid,
                        values: vectors,
                        metadata: {
                            "type": "chunk",
                        }
                    }
                ],
                namespace: "chunks"
            }).then(pineResult => {
                if (pineResult.upsertedCount === 1) {
                    makeChunkDisappear(chunkDiv);
                    window.daoFunctions.setChunkAsEmbedded({
                        id: chunkDiv.dataset.id,
                        externalId: JSON.stringify(vectors)
                    });
                }
            });
        });
};

const executeEmbedding = async () => {
    const allReadyToEmbed = embeddingDiv.querySelectorAll('div.ready-to-embed');
    initialize(config.pineconeApiKey, config.pineconeUrl);

    allReadyToEmbed.forEach(chunkDiv => {
        embedAndHide(chunkDiv);
    });
}

export const collectionManager = () => {
    document.getElementById('clear-collection').addEventListener('click', clearCollectionFields);
    document.getElementById('slice-collection').addEventListener('click', sliceCollection);
    collectionSaveButton.addEventListener('click', saveCollection);

    document.getElementById('load-embedding').addEventListener('click', loadEmbedding);
    document.getElementById('execute-embedding').addEventListener('click', executeEmbedding);
}