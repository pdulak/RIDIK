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
    collectionSaveButton.disabled = false;
}

const sliceCollection = () => {
    const contents = collectionFields.contents.value;
    let lines = contents.split('\n');
    lines = lines.filter(line => !(line.trim() === ''));
    lines = lines.filter(line => (!line.includes(' > Location ') && !line.startsWith('Location ')) );
    const newText = lines.join('\n[chunk]\n'); // .replace(/\n\n/g, '\n[chunk]\n');
    collectionFields.chunks.value = newText;
}

const saveCollection = () => {
    const data = {
        name: collectionFields.name.value,
        source: collectionFields.source.value,
        type: collectionFields.type.value,
    };

    const chunksRaw = collectionFields.chunks.value.split('[chunk]');
    const chunks = chunksRaw.map(chunk => {
        return {
            collectionId: 1,
            type: 'chunk',
            value: chunk.trim(),
        }
    });

    console.log('data', data);
    console.log('chunks', chunks);

    collectionSaveButton.disabled = true;
}

export const collectionManager = () => {
    document.getElementById('clear-collection').addEventListener('click', clearCollectionFields);
    document.getElementById('slice-collection').addEventListener('click', sliceCollection);
    collectionSaveButton.addEventListener('click', saveCollection);
}