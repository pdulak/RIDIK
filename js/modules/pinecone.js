const pineconeConfig = {
    apiKey : "",
    url : "",
}

export const initialize = (apiKey, url) => {
    pineconeConfig.apiKey = apiKey;
    pineconeConfig.url = url;
}

export const pineconeUpsert = async (data) => {
    const response = await fetch(`${pineconeConfig.url}vectors/upsert`, {
        method: "POST",
        headers: {
            "Api-Key": pineconeConfig.apiKey,
            "accept": "application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    return json;
}