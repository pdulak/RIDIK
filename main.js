const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron")
const path = require("path")
const { Dao } = require("./js/modules/dao")
const { addToggleDevToolsToWindow } = require("./js/modules/devtools");
const { registerMainShortcut, unregisterShortcuts } = require("./js/modules/shortcuts-main");

let win
const dao = Dao()

async function createWindow () {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        // titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        },
        icon: path.join(__dirname, "images", "hat-1-64-64.png")
    })

    win.loadFile("index.html");
    addToggleDevToolsToWindow(win);
    registerMainShortcut(win);

    win.on('closed', () => {
        win = null;
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on('will-quit', () => {
    unregisterShortcuts();
})

ipcMain.handle("dark-mode:toggle", () => {
    if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = "light"
    } else {
        nativeTheme.themeSource = "dark"
    }
    return nativeTheme.shouldUseDarkColors
})

ipcMain.handle("dark-mode:system", () => {
    nativeTheme.themeSource = "system"
})

ipcMain.handle("daoFunctions:getCommands", async (event) => {
    const commands = await dao.Commands.findAll();
    event.sender.send('commandsReceived', commands);
});

ipcMain.handle("daoFunctions:saveOpenAIConversation", async (event, data) => {
    dao.saveOpenAIConversation(data);
});

