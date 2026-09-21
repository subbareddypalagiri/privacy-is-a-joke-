/**
 * Anti-Tamper & Native Code Camouflage Module
 * Masks patched prototypes so bot-detection & anti-fingerprint detectors (like FingerprintJS)
 * see `function [name]() { [native code] }` when inspecting function signatures.
 */

const nativeToString = Function.prototype.toString;
const patchedFunctions = new WeakSet<Function>();

export function disguiseAsNative<T extends Function>(targetFn: T, originalName: string): T {
  try {
    Object.defineProperty(targetFn, 'name', {
      value: originalName,
      configurable: true,
      writable: false,
    });
  } catch (e) {
    // Ignore in non-configurable contexts
  }

  patchedFunctions.add(targetFn);
  return targetFn;
}

export function initAntiTamper() {
  try {
    const customToString = function toString(this: Function) {
      if (typeof this === 'function' && patchedFunctions.has(this)) {
        const name = this.name || '';
        return `function ${name}() { [native code] }`;
      }
      return nativeToString.call(this);
    };

    disguiseAsNative(customToString, 'toString');

    Object.defineProperty(Function.prototype, 'toString', {
      value: customToString,
      configurable: true,
      writable: true,
    });
  } catch (err) {
    console.debug('[FUF AntiTamper] Init warning:', err);
  }
}
