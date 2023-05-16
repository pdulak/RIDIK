const collectionFields = {
    name: document.getElementById('collection-name'),
    source: document.getElementById('collection-source'),
    type: document.getElementById('collection-type'),
    contents: document.getElementById('collection-contents'),
    chunks: document.getElementById('collection-chunks'),
};
const collectionSaveButton = document.getElementById('save-collection');

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

export const collectionManager = () => {
    document.getElementById('clear-collection').addEventListener('click', clearCollectionFields);
    document.getElementById('slice-collection').addEventListener('click', sliceCollection);
    collectionSaveButton.addEventListener('click', saveCollection);
}