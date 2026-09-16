/**
 * GhostShield Master Synchronous Kernel
 * Injected synchronously into the page MAIN world at document_start.
 */

export function runMasterKernel() {
  (function () {
    try {
      // 1. Anti-Tamper Native Disguise
      const origToString = Function.prototype.toString;
      const patchedFns = new WeakSet();

      function disguiseNative(fn: any, name: string) {
        try {
          Object.defineProperty(fn, 'name', { value: name, configurable: true, writable: false });
        } catch (e) {}
        patchedFns.add(fn);
        return fn;
      }

      try {
        const customToString = function toString(this: Function) {
          if (typeof this === 'function' && patchedFns.has(this)) {
            return `function ${this.name || ''}() { [native code] }`;
          }
          return origToString.call(this);
        };
        disguiseNative(customToString, 'toString');
        Object.defineProperty(Function.prototype, 'toString', {
          value: customToString,
          configurable: true,
          writable: true,
        });
      } catch (e) {}

      // 2. Check Banking Whitelist
      const hostname = (window.location.hostname || '').toLowerCase().trim();
      const trusted = [
        'onlinesbi.sbi', 'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'axisbank.com',
        'kotak.com', 'razorpay.com', 'paytm.com', 'phonepe.com', 'chase.com', 'paypal.com',
        'stripe.com', 'uidai.gov.in', 'incometax.gov.in', 'irctc.co.in'
      ];

      const isBank = trusted.some((d) => hostname === d || hostname.endsWith('.' + d));
      if (isBank) {
        console.log(`%c[GhostShield]%c Zone A (Bank Safe) active for ${hostname}`, 'color:#22c55e;font-weight:bold;', 'color:#38bdf8;');
        return;
      }

      console.log(`%c[GhostShield]%c Zone B (Armor Active) on ${hostname}`, 'color:#38bdf8;font-weight:bold;', 'color:#a855f7;');

      // 3. High-Impact Canvas Farbler
      const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
      const origToBlob = HTMLCanvasElement.prototype.toBlob;
      const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;

      // 3.1 toDataURL Farbler
      HTMLCanvasElement.prototype.toDataURL = disguiseNative(function (this: HTMLCanvasElement, ...args: any[]) {
        try {
          const ctx = this.getContext('2d');
          if (ctx && this.width > 0 && this.height > 0) {
            // Draw a subtle 2x2 colored noise rectangle at top left
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.08)`;
            ctx.fillRect(0, 0, 2, 2);
          }
        } catch (e) {}

        window.postMessage({ source: 'GHOST_SHIELD_KERNEL', type: 'LOG_EVENT', payload: { type: 'CANVAS_SCRAMBLE', domain: hostname, details: 'toDataURL signature randomized' } }, '*');
        return (origToDataURL as any).apply(this, args);
      }, 'toDataURL');

      // 3.2 toBlob Farbler
      HTMLCanvasElement.prototype.toBlob = disguiseNative(function (this: HTMLCanvasElement, callback: BlobCallback, ...args: any[]) {
        try {
          const ctx = this.getContext('2d');
          if (ctx && this.width > 0 && this.height > 0) {
            const r = Math.floor(Math.random() * 255);
            ctx.fillStyle = `rgba(${r}, 100, 200, 0.08)`;
            ctx.fillRect(0, 0, 2, 2);
          }
        } catch (e) {}
        return (origToBlob as any).call(this, callback, ...args);
      }, 'toBlob');

      // 3.3 getImageData Farbler
      CanvasRenderingContext2D.prototype.getImageData = disguiseNative(function (this: CanvasRenderingContext2D, sx: number, sy: number, sw: number, sh: number, settings?: any) {
        const imgData = origGetImageData.call(this, sx, sy, sw, sh, settings);
        if (imgData && imgData.data && imgData.data.length > 0) {
          const shift = Math.floor(Math.random() * 5) + 1;
          for (let i = 0; i < imgData.data.length; i += 32) {
            imgData.data[i] = (imgData.data[i] ^ shift) % 256;
          }
        }
        return imgData;
      }, 'getImageData');

      // 4. Hardware Normalizer
      try {
        Object.defineProperty(Navigator.prototype, 'hardwareConcurrency', {
          get: disguiseNative(function hardwareConcurrency() { return 8; }, 'get hardwareConcurrency'),
          configurable: true,
        });
      } catch (e) {}

      try {
        if ('deviceMemory' in Navigator.prototype) {
          Object.defineProperty(Navigator.prototype, 'deviceMemory', {
            get: disguiseNative(function deviceMemory() { return 8; }, 'get deviceMemory'),
            configurable: true,
          });
        }
      } catch (e) {}

      // 5. WebGL Shader Spoofing
      if (typeof WebGLRenderingContext !== 'undefined') {
        const origGetParam = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = disguiseNative(function (this: any, param: number) {
          if (param === 0x9245) return 'Intel Inc.';
          if (param === 0x9246) return 'Intel(R) Iris(R) Xe Graphics';
          return origGetParam.call(this, param);
        }, 'getParameter');
      }

    } catch (err) {
      console.debug('[GhostShield] Synchronous kernel note:', err);
    }
  })();
}
