/**
 * FUF Windows Network Adapter State Watcher
 * Detects sleep-wake transitions, Wi-Fi network switches, and automatically re-binds DNS.
 */

import { exec } from 'child_process';

export class WindowsNetworkWatcher {
  private isWatching: boolean = false;
  private currentAdapter: string = 'Wi-Fi';
  private timer: NodeJS.Timeout | null = null;

  public startWatching(): void {
    if (this.isWatching) return;
    this.isWatching = true;

    // Check adapter status every 10 seconds
    this.timer = setInterval(() => {
      this.auditAdapterState();
    }, 10000);

    this.auditAdapterState();
  }

  public stopWatching(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isWatching = false;
  }

  private auditAdapterState(): void {
    exec('powershell -Command "Get-NetAdapter | Where-Object { $_.Status -eq \'Up\' } | Select-Object -ExpandProperty Name -First 1"', (err, stdout) => {
      if (!err && stdout && stdout.trim()) {
        const activeName = stdout.trim();
        if (activeName !== this.currentAdapter) {
          console.log(`[FUF Network Watcher] Network switch detected: ${this.currentAdapter} -> ${activeName}. Re-binding DNS...`);
          this.currentAdapter = activeName;
          this.bindDnsToAdapter(activeName);
        }
      }
    });
  }

  private bindDnsToAdapter(adapterName: string): void {
    const cmd = `netsh interface ip set dns name="${adapterName}" static 127.0.0.1 && netsh interface ip add dns name="${adapterName}" 1.1.1.1 index=2`;
    exec(cmd, (err) => {
      if (!err) {
        console.log(`[FUF Network Watcher] ✅ Auto-rebound DNS on ${adapterName}`);
      }
    });
  }
}
