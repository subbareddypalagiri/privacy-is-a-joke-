/**
 * Hardware & Telemetry Normalizer
 * Normalizes hardwareConcurrency, deviceMemory, and Battery status
 * to blend into the statistical median of the global population.
 */

import { disguiseAsNative } from './anti_tamper';

export function initHardwareArmor(onMaskLogged?: (details: string) => void) {
  try {
    // 1. Normalize hardwareConcurrency (CPU Cores) to standard 8
    try {
      const getCores = function hardwareConcurrency() {
        if (onMaskLogged) onMaskLogged('hardwareConcurrency masked to 8 cores');
        return 8;
      };
      disguiseAsNative(getCores, 'get hardwareConcurrency');

      Object.defineProperty(Navigator.prototype, 'hardwareConcurrency', {
        get: getCores,
        configurable: true,
      });
    } catch (e) {}

    // 2. Normalize deviceMemory (RAM in GB) to standard 8
    try {
      if ('deviceMemory' in Navigator.prototype) {
        const getMemory = function deviceMemory() {
          if (onMaskLogged) onMaskLogged('deviceMemory masked to 8 GB');
          return 8;
        };
        disguiseAsNative(getMemory, 'get deviceMemory');

        Object.defineProperty(Navigator.prototype, 'deviceMemory', {
          get: getMemory,
          configurable: true,
        });
      }
    } catch (e) {}

    // 3. Mask Battery API (Used for precise short-term session tracking)
    if ('getBattery' in navigator) {
      const fakeBattery = {
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 1.0,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      };

      const patchedGetBattery = function getBattery() {
        if (onMaskLogged) onMaskLogged('Battery API masked (100% AC Powered)');
        return Promise.resolve(fakeBattery);
      };
      disguiseAsNative(patchedGetBattery, 'getBattery');

      try {
        Object.defineProperty(Navigator.prototype, 'getBattery', {
          value: patchedGetBattery,
          configurable: true,
          writable: true,
        });
      } catch (e) {}
    }
  } catch (err) {
    console.debug('[FUF HardwareArmor] Init notice:', err);
  }
}
