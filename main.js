const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('path')

function createWindow () {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        frame: false,
        // titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')
}

ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
    } else {
        nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
})

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})