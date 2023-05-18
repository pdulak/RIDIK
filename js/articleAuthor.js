import { addMessage, addMessageInBackground, clearMessages, setModalBusy, setModalNotBusy } from "./modules/messagesModal.js";

const initialize = () => {
    setModalBusy();
    addMessageInBackground("articleAuthor initialize");
    setModalNotBusy();
}

export const articleAuthor = () => {
    initialize();
}