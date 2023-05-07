const { contextBridge, ipcRenderer } = require("electron")
const path = require("path")
const fs = require("fs")
const configRootPath = path.resolve(__dirname,"config.json");
const config = JSON.parse(fs.readFileSync(configRootPath, { encoding: "utf-8" }));

contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld("darkMode", {
    toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
    system: () => ipcRenderer.invoke("dark-mode:system")
})

contextBridge.exposeInMainWorld("config", config);

contextBridge.exposeInMainWorld("daoFunctions", {
    getCommands: () => ipcRenderer.invoke("daoFunctions:getCommands")
});

contextBridge.exposeInMainWorld("electron", {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, listener) => {
        const wrappedListener = (event, ...args) => listener(...args);
        ipcRenderer.on(channel, wrappedListener);
        return () => ipcRenderer.removeListener(channel, wrappedListener);
    }
});