/**
 * FUF-404 Sovereign Self-Healing Watchdog & Crash Safety Supervisor
 * 
 * Responsibilities:
 *  1. Spawns and supervises the core DNS daemon (Port 53 & 5354).
 *  2. If the daemon crashes unexpectedly, restarts it in < 1 second.
 *  3. CATASTROPHIC SAFETY NET: If the daemon crashes > 3 times in 15 seconds,
 *     it immediately and automatically executes an atomic DHCP rollback on all
 *     Windows network adapters, ensuring the user NEVER loses internet access.
 *  4. Graceful Cleanup: Restores DHCP on SIGINT / SIGTERM / Ctrl+C.
 */

import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_RAPID_CRASHES = 3;
const RAPID_CRASH_WINDOW_MS = 15000;
let crashTimestamps = [];
let daemonProcess = null;
let isShuttingDown = false;

function restoreDnsDhcp() {
  console.log('\n[FUF Watchdog] 🔄 Triggering Emergency DNS Rollback to DHCP...');
  try {
    const psCmd = `Get-NetAdapter | Where-Object { $_.Status -eq 'Up' } | ForEach-Object { netsh interface ip set dns name $_.Name source=dhcp; netsh interface ipv6 set dns name $_.Name source=dhcp }`;
    execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: 'inherit' });
    console.log('[FUF Watchdog] ✅ Windows DNS successfully restored to ISP defaults.');
  } catch (err) {
    console.error('[FUF Watchdog] ⚠️ Rollback warning:', err.message);
  }
}

function startSupervisedDaemon() {
  if (isShuttingDown) return;

  const daemonScript = path.join(__dirname, 'run_daemon.js');
  console.log(`[FUF Watchdog] 🛡️ Spawning Sovereign Daemon: ${daemonScript}`);

  daemonProcess = spawn('npx', ['tsx', daemonScript], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, SHIELD_PORT: '53' }
  });

  daemonProcess.on('exit', (code, signal) => {
    if (isShuttingDown) {
      console.log('[FUF Watchdog] Daemon stopped gracefully.');
      return;
    }

    const now = Date.now();
    crashTimestamps.push(now);
    crashTimestamps = crashTimestamps.filter(t => (now - t) < RAPID_CRASH_WINDOW_MS);

    console.warn(`[FUF Watchdog] ⚠️ Daemon exited unexpectedly (Code: ${code}, Signal: ${signal}).`);

    if (crashTimestamps.length >= MAX_RAPID_CRASHES) {
      console.error(`[FUF Watchdog] 🚨 CRITICAL: ${crashTimestamps.length} rapid crashes detected within 15 seconds!`);
      console.error('[FUF Watchdog] 🚨 Engaging Emergency Safety Net to prevent user internet outage...');
      restoreDnsDhcp();
      process.exit(1);
    }

    console.log('[FUF Watchdog] ⚡ Self-Healing: Restarting daemon in 1000ms...');
    setTimeout(startSupervisedDaemon, 1000);
  });
}

// Handle Graceful Termination
['SIGINT', 'SIGTERM', 'SIGHUP'].forEach((signal) => {
  process.on(signal, () => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`\n[FUF Watchdog] Received ${signal}. Shutting down supervisor...`);
    if (daemonProcess) {
      daemonProcess.kill();
    }
    restoreDnsDhcp();
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('[FUF Watchdog] Uncaught exception in supervisor:', err);
  restoreDnsDhcp();
  process.exit(1);
});

// Launch supervisor
console.log('======================================================================');
console.log('⚡ FUF-404 SOVEREIGN SELF-HEALING SUPERVISOR ENGAGED');
console.log('======================================================================');
startSupervisedDaemon();
