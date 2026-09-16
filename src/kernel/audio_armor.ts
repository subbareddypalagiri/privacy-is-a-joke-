/**
 * AudioContext & Sound-Stack Farbling Engine
 * Scrambles audio oscillator fingerprinting (used by FingerprintJS and AdTech)
 * without affecting audio playback quality on YouTube, Spotify, or Netflix.
 */

import { disguiseAsNative } from './anti_tamper';

export function initAudioArmor(onScrambleLogged?: (details: string) => void) {
  try {
    const audioNoiseDelta = (Math.random() - 0.5) * 1e-7;

    // 1. Hook AudioBuffer.prototype.getChannelData
    if (typeof AudioBuffer !== 'undefined') {
      const originalGetChannelData = AudioBuffer.prototype.getChannelData;
      const patchedGetChannelData = function (this: AudioBuffer, channel: number): any {
        const buffer = originalGetChannelData.call(this, channel);
        // Add imperceptible mathematical jitter
        for (let i = 0; i < buffer.length; i += 100) {
          buffer[i] += audioNoiseDelta;
        }
        if (onScrambleLogged) {
          onScrambleLogged(`AudioBuffer channel data fuzzed (ch ${channel})`);
        }
        return buffer;
      };
      disguiseAsNative(patchedGetChannelData, 'getChannelData');
      AudioBuffer.prototype.getChannelData = patchedGetChannelData as any;
    }

    // 2. Hook AnalyserNode.prototype.getFloatFrequencyData
    if (typeof AnalyserNode !== 'undefined') {
      const originalGetFloatFrequencyData = AnalyserNode.prototype.getFloatFrequencyData;
      const patchedGetFloatFrequencyData = function (
        this: AnalyserNode,
        array: any
      ): void {
        originalGetFloatFrequencyData.call(this, array);
        for (let i = 0; i < array.length; i += 32) {
          array[i] += audioNoiseDelta * 10;
        }
        if (onScrambleLogged) {
          onScrambleLogged('AnalyserNode frequency spectrum randomized');
        }
      };
      disguiseAsNative(patchedGetFloatFrequencyData, 'getFloatFrequencyData');
      AnalyserNode.prototype.getFloatFrequencyData = patchedGetFloatFrequencyData as any;
    }

    // 3. Hook AnalyserNode.prototype.getByteTimeDomainData
    if (typeof AnalyserNode !== 'undefined') {
      const originalGetByteTimeDomainData = AnalyserNode.prototype.getByteTimeDomainData;
      const patchedGetByteTimeDomainData = function (
        this: AnalyserNode,
        array: any
      ): void {
        originalGetByteTimeDomainData.call(this, array);
        for (let i = 0; i < array.length; i += 64) {
          array[i] = (array[i] + 1) % 256;
        }
      };
      disguiseAsNative(patchedGetByteTimeDomainData, 'getByteTimeDomainData');
      AnalyserNode.prototype.getByteTimeDomainData = patchedGetByteTimeDomainData as any;
    }
  } catch (err) {
    console.debug('[GhostShield AudioArmor] Init notice:', err);
  }
}
