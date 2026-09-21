/**
 * FUF Master Injection Kernel
 * Injected at document_start in the MAIN page world before any page scripts execute.
 */

import { initAntiTamper } from './anti_tamper';
import { DualZoneRouter } from './dual_zone_router';
import { initCanvasArmor } from './canvas_armor';
import { initAudioArmor } from './audio_armor';
import { initHardwareArmor } from './hardware_armor';

(function () {
  try {
    const hostname = window.location.hostname || '';
    const router = new DualZoneRouter();
    const zone = router.getZoneForHost(hostname);

    // Notify bridge about current active zone
    window.postMessage(
      {
        source: 'fuf_KERNEL',
        type: 'ZONE_DETECTED',
        payload: { hostname, zone },
      },
      '*'
    );

    if (zone === 'TRUSTED') {
      console.log(`%c[FUF]%c Zone A (High-Trust Banking) Active for ${hostname}. Clean Pass-through enabled.`, 'color:#22c55e;font-weight:bold;', 'color:#38bdf8;');
      return; // Do not apply synthetic farbling to trusted banking origins!
    }

    console.log(`%c[FUF]%c Zone B (Wild Web Armor) Active for ${hostname}. Synthetic Farbling Engaged.`, 'color:#38bdf8;font-weight:bold;', 'color:#a855f7;');

    // Helper logger to send event to content bridge
    const logEvent = (type: 'CANVAS_SCRAMBLE' | 'AUDIO_SCRAMBLE' | 'HARDWARE_MASK', details: string) => {
      window.postMessage(
        {
          source: 'fuf_KERNEL',
          type: 'LOG_EVENT',
          payload: {
            id: 'ev_' + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            type,
            domain: hostname,
            details,
          },
        },
        '*'
      );
    };

    // Initialize all armor layers
    initAntiTamper();
    initCanvasArmor((details) => logEvent('CANVAS_SCRAMBLE', details));
    initAudioArmor((details) => logEvent('AUDIO_SCRAMBLE', details));
    initHardwareArmor((details) => logEvent('HARDWARE_MASK', details));
  } catch (err) {
    console.debug('[FUF Kernel] Injection note:', err);
  }
})();
