const popup = document.getElementById('messages-modal');
const popupContent = document.getElementById('messages-modal-content');
const modalClose = document.getElementById('messages-modal-close');
const showMessages = document.getElementById('show-messages');

modalClose.addEventListener('click', () => {
    popup.removeAttribute('open');
});

showMessages.addEventListener('click', () => {
    popup.setAttribute('open', 'true');
});

export const addMessage = (message) => {
    const messageElement = document.createElement('p');
    const currentDate = new Date().toISOString();

    messageElement.textContent = currentDate + ": " + message;
    popupContent.appendChild(messageElement);

    // Show the popup when a new message is added
    popup.setAttribute('open', 'true');
}
