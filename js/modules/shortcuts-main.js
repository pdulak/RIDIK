const { globalShortcut } = require('electron');
const { Dao } = require('./dao');
const dao = Dao();

async function registerMainShortcut(win) {
    globalKeyboardShortcut = 'CommandOrControl+Alt+i';
    if (await dao.checkConnection()) {
        const data = await dao.SysConfig.findOne({
            where: {
                name: "globalKeyboardShortcut"
            }
        });
        if (data && data !== '') {
            globalKeyboardShortcut = data.value;
        }
    }

    globalShortcut.register(globalKeyboardShortcut, () => {
        win.show();
        win.focus();
    })
}

function unregisterShortcuts() {
    globalShortcut.unregisterAll();
}

module.exports = {
    registerMainShortcut,
    unregisterShortcuts,
}