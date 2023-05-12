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

module.exports = {
    addToggleDevToolsToWindow,
}