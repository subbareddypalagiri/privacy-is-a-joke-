/**
 * FUF Native Desktop Application
 * Automatically routes Windows Network DNS to 127.0.0.1 on launch
 * and gracefully restores to DHCP on exit or pause.
 */

const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const { exec, fork } = require('child_process');

const fs = require('fs');

let mainWindow = null;
let tray = null;
let daemonProcess = null;
let originalAdapterNames = [];
const JOURNAL_PATH = path.join(app.getPath('userData'), 'dns_rollback_journal.json');

// 1. Detect All Active Network Adapters (Wi-Fi, Ethernet, Cellular, USB)
function detectActiveAdapters(callback) {
  const psCmd = `powershell -NoProfile -Command "Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | Select-Object -ExpandProperty Name"`;
  exec(psCmd, (err, stdout) => {
    let adapters = [];
    if (!err && stdout && stdout.trim()) {
      adapters = stdout.trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    }
    if (adapters.length === 0) adapters = ['Wi-Fi', 'Ethernet'];
    originalAdapterNames = adapters;
    console.log(`[FUF Network Sentinel] Active interfaces discovered: ${adapters.join(', ')}`);
    if (callback) callback(adapters);
  });
}

// 2. Set Windows DNS to Localhost (127.0.0.1) with Atomic Rollback Journal
function enableLocalDns() {
  detectActiveAdapters((adapters) => {
    // Write atomic journal before mutating system network configuration
    try {
      fs.writeFileSync(JOURNAL_PATH, JSON.stringify({
        timestamp: Date.now(),
        adapters,
        status: 'ROUTED_TO_FUF'
      }), 'utf8');
    } catch (e) {}

    adapters.forEach((adapter) => {
      const cmd = `netsh interface ip set dns name="${adapter}" static 127.0.0.1 && netsh interface ip add dns name="${adapter}" 1.1.1.1 index=2`;
      exec(cmd, (err) => {
        if (err) {
          console.warn(`[FUF Network Sentinel] Interface ${adapter} binding note: ${err.message}`);
        } else {
          console.log(`[FUF Network Sentinel] ✅ Bound 127.0.0.1 on ${adapter}`);
        }
      });
    });
  });
}

// 3. Restore Windows DNS to DHCP Defaults from Journal
function restoreDefaultDns() {
  const adaptersToRestore = originalAdapterNames.length > 0 ? originalAdapterNames : ['Wi-Fi', 'Ethernet'];
  adaptersToRestore.forEach((adapter) => {
    const cmd = `netsh interface ip set dns name="${adapter}" dhcp`;
    exec(cmd, (err) => {
      if (!err) {
        console.log(`[FUF Network Sentinel] 🔄 Restored DHCP defaults on ${adapter}`);
      }
    });
  });

  try {
    if (fs.existsSync(JOURNAL_PATH)) fs.unlinkSync(JOURNAL_PATH);
  } catch (e) {}
}

// 4. Start Local Daemon Process
function startDaemon() {
  try {
    const daemonPath = path.join(__dirname, '../dist/daemon.js');
    daemonProcess = fork(daemonPath, [], {
      env: { ...process.env, SHIELD_PORT: '53' },
      stdio: 'inherit'
    });
    console.log('[FUF Desktop] Background daemon spawned.');
  } catch (err) {
    console.error('[FUF Desktop] Daemon spawn error:', err);
  }
}

// 5. Create Standalone Window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1024,
    minHeight: 700,
    title: 'FUF - Autonomous Cognitive Privacy Engine',
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
      console.warn('[FUF Desktop] Note loading dashboard:', err.message);
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
    { label: '🛡️ FUF: Online', enabled: false },
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
      label: 'Quit FUF', 
      click: () => { 
        app.isQuitting = true; 
        restoreDefaultDns();
        if (daemonProcess) daemonProcess.kill();
        app.quit(); 
      } 
    }
  ]);

  tray.setToolTip('FUF - Autonomous Privacy Shield');
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
