const { logger } = require("../../utils/logger");

const socket = io();

const userNameInput = document.querySelector('#userName')

const chatBox = document.querySelector('#chatBox');

chatBox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {

        const user = userNameInput.value

        logger.info(user,chatBox.value)

        if (chatBox.value.trim().length > 0) {

            socket.emit('message', {
                user,
                message: chatBox.value,
            });
            chatBox.value = '';
        }
    }
});

socket.on('messageLogs', data => {

    let messageLogs = document.querySelector('#messageLogs');
    let messages = '';

    data.forEach(elementMensajes => {

        messages += `${elementMensajes.user} dice: ${elementMensajes.message}<br>`;

    });

    messageLogs.innerHTML = messages;
});
