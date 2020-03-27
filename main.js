// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow
let tray

app.dock.hide()

function quit() {
  mainWindow.destroy()
  app.quit()
}

function toggleWindow() {
  mainWindow.isVisible() ? hideWindow() : showWindow()
}

function hideWindow() {
  mainWindow.hide()
}

function showWindow() {
  const bounds = tray.getBounds()
  mainWindow.setSize(400, 142)
  mainWindow.setPosition(bounds.x - 200, bounds.y + bounds.height + 4)
  mainWindow.setVisibleOnAllWorkspaces(true)
  mainWindow.show()
  mainWindow.setVisibleOnAllWorkspaces(false)
}

const contextMenu = Menu.buildFromTemplate([
  { label: 'Show', click: toggleWindow },
  { label: 'Quit', click: quit }
])

function registerMediakeys(window) {
  globalShortcut.register('medianexttrack', function () {
    window.webContents.executeJavaScript("dzPlayer.control.nextSong();")
  })
  globalShortcut.register('mediaplaypause', function () {
    window.webContents.executeJavaScript("dzPlayer.control.togglePause();")
  })
  globalShortcut.register('mediaprevioustrack', function () {
    window.webContents.executeJavaScript("dzPlayer.control.prevSong();")
  })
  globalShortcut.register('mediastop', function () {
    window.webContents.executeJavaScript("dzPlayer.control.pause();")
  })
}

function filterRequest(window) {
  const filter = {
    urls: [
      "*://*.pubmatic.com/*",
      "*://*.g.doubleclick.net/*",
      "*://*.googleadservices.com/*",
      "*://*.googlesyndication.com/*",
      "*://*.smartadserver.com/*"
    ]
  }
  window.webContents.session.webRequest.onBeforeRequest(filter, function (details, callback) {
    callback({ cancel: true })
  })
}

function createTray() {
  tray = new Tray(path.join(__dirname, '/assets/deezer.png'))
  tray.setIgnoreDoubleClickEvents(true)
  tray.on('click', toggleWindow)
  tray.on('right-click', () => tray.popUpContextMenu(contextMenu))
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    }
  })

  mainWindow.webContents.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36")
  mainWindow.loadURL("https://www.deezer.com")
  
  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.webContents.insertCSS(fs.readFileSync(path.join(__dirname, 'deezer.css'), 'utf8'))
  })

  mainWindow.on("close", evt => {
    evt.preventDefault()
    mainWindow.hide()
  })

  mainWindow.on('blur', mainWindow.hide)

  // Open the DevTools.
   mainWindow.webContents.openDevTools()

  return mainWindow
}

app.on('ready', () => {
  createWindow()
  filterRequest(mainWindow)
  registerMediakeys(mainWindow)
  createTray()
})
