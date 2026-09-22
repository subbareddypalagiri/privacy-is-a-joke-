/**
 * FUF Native Android VPN Bridge
 * Interfaces with Capacitor Native FufVpnPlugin on Android devices.
 * Enables 1-tap local loopback VPN interception on 4G/5G cellular data.
 */

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
      Plugins?: {
        FufVpn?: {
          isSupported: () => Promise<{ supported: boolean }>;
          isVpnActive: () => Promise<{ active: boolean }>;
          startVpn: () => Promise<{ success: boolean; active: boolean }>;
          stopVpn: () => Promise<{ success: boolean; active: boolean }>;
        };
      };
    };
  }
}

export class NativeVpnBridge {
  public static isNativeAndroid(): boolean {
    if (typeof window === 'undefined') return false;
    const cap = window.Capacitor;
    if (!cap) return false;
    if (cap.isNativePlatform && cap.isNativePlatform()) {
      return cap.getPlatform ? cap.getPlatform() === 'android' : true;
    }
    return false;
  }

  public static async isAvailable(): Promise<boolean> {
    if (!this.isNativeAndroid()) return false;
    try {
      const plugin = window.Capacitor?.Plugins?.FufVpn;
      if (!plugin) return false;
      const res = await plugin.isSupported();
      return Boolean(res.supported);
    } catch {
      return false;
    }
  }

  public static async isActive(): Promise<boolean> {
    if (!this.isNativeAndroid()) return false;
    try {
      const plugin = window.Capacitor?.Plugins?.FufVpn;
      if (!plugin) return false;
      const res = await plugin.isVpnActive();
      return Boolean(res.active);
    } catch {
      return false;
    }
  }

  public static async start(): Promise<{ success: boolean; active: boolean; error?: string }> {
    if (!this.isNativeAndroid()) {
      return { success: false, active: false, error: 'Not running inside Android native environment' };
    }
    try {
      const plugin = window.Capacitor?.Plugins?.FufVpn;
      if (!plugin) throw new Error('FufVpn plugin not registered');
      const res = await plugin.startVpn();
      return { success: res.success, active: res.active };
    } catch (e: any) {
      return { success: false, active: false, error: e.message || 'VPN permission denied' };
    }
  }

  public static async stop(): Promise<{ success: boolean; active: boolean }> {
    if (!this.isNativeAndroid()) {
      return { success: false, active: false };
    }
    try {
      const plugin = window.Capacitor?.Plugins?.FufVpn;
      if (!plugin) return { success: false, active: false };
      const res = await plugin.stopVpn();
      return { success: res.success, active: res.active };
    } catch {
      return { success: false, active: false };
    }
  }
}
