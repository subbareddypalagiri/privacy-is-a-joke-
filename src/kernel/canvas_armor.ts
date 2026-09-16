/**
 * GhostShield Industrial-Grade Full-Spectrum Farbling Kernel
 * Solves the transparent-pixel PNG quantization issue by targeting non-zero alpha pixels.
 * 100% flips cryptographic hash (Avalanche Effect) while remaining 100% invisible to human eyes.
 */

import { disguiseAsNative } from './anti_tamper';

export function initCanvasArmor(onScrambleLogged?: (details: string) => void) {
  try {
    const sessionNoise = Math.random() * 0.08 + 0.01;
    const noiseByte = (Math.floor(sessionNoise * 1000) % 5) + 1; // 1 to 5

    const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
    const origPutImageData = CanvasRenderingContext2D.prototype.putImageData;
    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    const origToBlob = HTMLCanvasElement.prototype.toBlob;
    const origFillText = CanvasRenderingContext2D.prototype.fillText;

    // Helper: Modify opaque pixels before export
    const fuzzOpaquePixels = (canvas: HTMLCanvasElement) => {
      try {
        const ctx = canvas.getContext('2d');
        if (ctx && canvas.width > 0 && canvas.height > 0) {
          const imgData = (origGetImageData as any).call(ctx, 0, 0, canvas.width, canvas.height);
          if (imgData && imgData.data) {
            let modified = false;
            // Scan for non-transparent pixels (text, shapes, rectangles)
            for (let i = 0; i < imgData.data.length; i += 4) {
              if (imgData.data[i + 3] > 10) { // Opaque or semi-opaque pixel
                imgData.data[i] = (imgData.data[i] + noiseByte) % 256;
                imgData.data[i + 1] = (imgData.data[i + 1] + noiseByte) % 256;
                modified = true;
                break; // 1 opaque pixel shift is mathematically guaranteed to alter MD5/CRC32!
              }
            }
            if (modified) {
              (origPutImageData as any).call(ctx, imgData, 0, 0);
            }
          }
        }
      } catch (e) {}
    };

    // 1. Hook CanvasRenderingContext2D.prototype.fillText
    const patchedFillText = function (
      this: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      maxWidth?: number
    ): void {
      const jitter = (sessionNoise * 0.01);
      if (maxWidth !== undefined) {
        origFillText.call(this, text, x + jitter, y, maxWidth);
      } else {
        origFillText.call(this, text, x + jitter, y);
      }
      if (onScrambleLogged) onScrambleLogged(`Canvas fillText fuzzed ("${text.slice(0, 15)}...")`);
    };
    disguiseAsNative(patchedFillText, 'fillText');
    CanvasRenderingContext2D.prototype.fillText = patchedFillText;

    // 2. Hook CanvasRenderingContext2D.prototype.getImageData
    const patchedGetImageData = function (
      this: CanvasRenderingContext2D,
      sx: number,
      sy: number,
      sw: number,
      sh: number,
      settings?: ImageDataSettings
    ): ImageData {
      const imgData = origGetImageData.call(this, sx, sy, sw, sh, settings);
      if (imgData && imgData.data) {
        for (let i = 0; i < imgData.data.length; i += 4) {
          if (imgData.data[i + 3] > 10) {
            imgData.data[i] = (imgData.data[i] + noiseByte) % 256;
            break;
          }
        }
      }
      if (onScrambleLogged) onScrambleLogged(`Canvas2D getImageData fuzzed (${sw}x${sh}px)`);
      return imgData;
    };
    disguiseAsNative(patchedGetImageData, 'getImageData');
    CanvasRenderingContext2D.prototype.getImageData = patchedGetImageData;

    // 3. Hook HTMLCanvasElement.prototype.toDataURL
    const patchedToDataURL = function (this: HTMLCanvasElement, ...args: any[]): string {
      fuzzOpaquePixels(this);
      const res = (origToDataURL as any).apply(this, args);
      if (onScrambleLogged) onScrambleLogged(`Canvas toDataURL farbled (${args[0] || 'image/png'})`);
      return res;
    };
    disguiseAsNative(patchedToDataURL, 'toDataURL');
    HTMLCanvasElement.prototype.toDataURL = patchedToDataURL;

    // 4. Hook HTMLCanvasElement.prototype.toBlob
    const patchedToBlob = function (this: HTMLCanvasElement, callback: BlobCallback, ...args: any[]): void {
      fuzzOpaquePixels(this);
      return (origToBlob as any).call(this, callback, ...args);
    };
    disguiseAsNative(patchedToBlob, 'toBlob');
    HTMLCanvasElement.prototype.toBlob = patchedToBlob;

    // 5. Hook WebGL GPU Parameter unmasking
    const spoofGL = (proto: any) => {
      if (!proto) return;
      const origParam = proto.getParameter;
      proto.getParameter = disguiseAsNative(function (this: any, param: number): any {
        if (param === 0x9245) return 'Intel Inc.';
        if (param === 0x9246) return 'Intel(R) Iris(R) Xe Graphics';
        return origParam.call(this, param);
      }, 'getParameter');
    };

    if (typeof WebGLRenderingContext !== 'undefined') spoofGL(WebGLRenderingContext.prototype);
    if (typeof WebGL2RenderingContext !== 'undefined') spoofGL(WebGL2RenderingContext.prototype);

  } catch (err) {
    console.debug('[GhostShield CanvasArmor] Init warning:', err);
  }
}
