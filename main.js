const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron")
const path = require("path")

function createWindow () {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        // titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        }
    })

    win.loadFile("index.html")
    addToggleDevToolsToWindow(win);
}

function addToggleDevToolsToWindow(win) {
    win.webContents.on("before-input-event", (e, input) => {
        if (input.type === "keyDown" && input.key === "F12") {
            win.webContents.toggleDevTools();

            win.webContents.on("devtools-opened", () => {
                // Can"t use mainWindow.webContents.devToolsWebContents.on("before-input-event") - it just doesn"t intercept any events.
                win.webContents.devToolsWebContents.executeJavaScript(`
                            new Promise((resolve)=> {
                              addEventListener("keydown", (event) => {
                                if (event.key === "F12") {
                                  resolve();
                                }
                              }, { once: true });
                            })
                          `)
                    .then(() => {
                        win.webContents.toggleDevTools();
                    });
            });
        }
    });
}

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
