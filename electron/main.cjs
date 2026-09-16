/**
 * GhostShield Native Desktop Application
 * Automatically routes Windows Network DNS to 127.0.0.1 on launch
 * and gracefully restores to DHCP on exit or pause.
 */

const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const { exec, fork } = require('child_process');

let mainWindow = null;
let tray = null;
let daemonProcess = null;
let originalAdapterName = 'Wi-Fi';

// 1. Detect Active Network Adapter
function detectActiveAdapter(callback) {
  exec('powershell -Command "Get-NetAdapter | Where-Object { $_.Status -eq \'Up\' } | Select-Object -ExpandProperty Name -First 1"', (err, stdout) => {
    if (!err && stdout && stdout.trim()) {
      originalAdapterName = stdout.trim();
      console.log(`[GhostShield Network] Active adapter detected: ${originalAdapterName}`);
    }
    if (callback) callback(originalAdapterName);
  });
}

// 2. Set Windows DNS to Localhost (127.0.0.1)
function enableLocalDns() {
  detectActiveAdapter((adapter) => {
    const cmd = `netsh interface ip set dns name="${adapter}" static 127.0.0.1 && netsh interface ip add dns name="${adapter}" 1.1.1.1 index=2`;
    exec(cmd, (err) => {
      if (err) {
        console.warn(`[GhostShield Network] Note: Running netsh may require admin privilege. (${err.message})`);
      } else {
        console.log(`[GhostShield Network] ✅ Windows DNS successfully routed to 127.0.0.1 on ${adapter}`);
      }
    });
  });
}

// 3. Restore Windows DNS to DHCP Defaults
function restoreDefaultDns() {
  const cmd = `netsh interface ip set dns name="${originalAdapterName}" dhcp`;
  exec(cmd, (err) => {
    if (!err) {
      console.log(`[GhostShield Network] 🔄 Windows DNS restored to DHCP defaults on ${originalAdapterName}`);
    }
  });
}

// 4. Start Local Daemon Process
function startDaemon() {
  try {
    const daemonPath = path.join(__dirname, '../dist/daemon.js');
    daemonProcess = fork(daemonPath, [], {
      env: { ...process.env, SHIELD_PORT: '53' },
      stdio: 'inherit'
    });
    console.log('[GhostShield Desktop] Background daemon spawned.');
  } catch (err) {
    console.error('[GhostShield Desktop] Daemon spawn error:', err);
  }
}

// 5. Create Standalone Window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1024,
    minHeight: 700,
    title: 'GhostShield - Autonomous Cognitive Privacy Engine',
    backgroundColor: '#FAF7F2',
    icon: path.join(__dirname, '../public/icons/icon128.png'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const localDashboard = path.join(__dirname, '../dist/dashboard.html');
  const devServerUrl = 'http://localhost:5173/dashboard.html';

  // Always attempt local dashboard file first, fallback to dev server if needed
  mainWindow.loadFile(localDashboard).catch(() => {
    mainWindow.loadURL(devServerUrl).catch((err) => {
      console.warn('[GhostShield Desktop] Note loading dashboard:', err.message);
    });
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

// 6. System Tray Integration
function createTray() {
  const iconPath = path.join(__dirname, '../public/icons/icon16.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    { label: '🛡️ GhostShield: Online', enabled: false },
    { type: 'separator' },
    { label: 'Open Control Center', click: () => { mainWindow.show(); mainWindow.focus(); } },
    { 
      label: 'Pause Protection (Restore DNS)', 
      click: () => { 
        restoreDefaultDns(); 
      } 
    },
    { 
      label: 'Resume Protection (Enable DNS)', 
      click: () => { 
        enableLocalDns(); 
      } 
    },
    { type: 'separator' },
    { 
      label: 'Quit GhostShield', 
      click: () => { 
        app.isQuitting = true; 
        restoreDefaultDns();
        if (daemonProcess) daemonProcess.kill();
        app.quit(); 
      } 
    }
  ]);

  tray.setToolTip('GhostShield - Autonomous Privacy Shield');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

app.whenReady().then(() => {
  startDaemon();
  enableLocalDns();
  createWindow();
  try { createTray(); } catch(e) {}

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  restoreDefaultDns();
  if (daemonProcess) daemonProcess.kill();
});

app.on('window-all-closed', () => {
  // Keep alive in system tray
});
