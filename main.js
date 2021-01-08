// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu, globalShortcut, screen } = require('electron')
const path = require('path')
const fs = require('fs')

let mainWindow
let tray

const isLinux = process.platform == 'linux'
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
const size = {
  collapsed: {
    width: 400,
    height: 142
  },
  expanded: {
    width: 800,
    height: 600
  }
}

app.dock && app.dock.hide()

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
  mainWindow.setBounds(size.collapsed)
  const { x, y } = windowPosition()
  mainWindow.setPosition(x, y)
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
    width: size.expanded.width,
    height: size.expanded.height,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    }
  })

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = userAgent
    callback({ cancel: false, requestHeaders: details.requestHeaders })
  });

  mainWindow.webContents.setUserAgent(userAgent)
  mainWindow.loadURL("https://www.deezer.com")

  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.webContents.insertCSS(fs.readFileSync(path.join(__dirname, 'deezer.css'), 'utf8'))
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  return mainWindow
}

function setWindowAutoHide() {
  mainWindow.on('blur', hideWindow)
  mainWindow.on("close", function (event) {
    event.preventDefault()
    hideWindow()
  })
}

function windowPosition() {
  const screenBounds = screen.getPrimaryDisplay().size
  const trayBounds = getTrayBounds(tray)

  const x = trayBounds.x - size.collapsed.width / 2
  const y = trayBounds.y > screenBounds.height / 2 ?
    trayBounds.y - size.collapsed.height :
    trayBounds.y + trayBounds.height / 2

  return { x, y }
}

function getTrayBounds(tray) {
  if(isLinux) {
    // https://github.com/electron/electron/issues/15003
    const { x, y } = screen.getCursorScreenPoint()
    return { width: 0, height: 0, x, y }
  } else {
    return tray.getBounds()
  }
}

function fixLinuxTray(tray) {
  // https://github.com/electron/electron/issues/14941
  tray.setContextMenu(contextMenu)
}

app.on('ready', () => {
  createWindow()
  setWindowAutoHide()
  filterRequest(mainWindow)
  registerMediakeys(mainWindow)
  createTray()
  if (isLinux) {
    fixLinuxTray(tray)
  }
})
