/**
 * GhostShield Server-Side CAPI (Conversion API) Honey-Data Poisoner
 * Injects mathematically authentic synthetic click identifiers (fbclid, gclid, ttclid)
 * and fuzzed attribution graph tokens into client payloads, neutralizing server-to-server tracking.
 */

export interface HoneyAttributionPayload {
  syntheticFbclid: string;
  syntheticGclid: string;
  syntheticTtclid: string;
  fuzzedUserAgentToken: string;
  entropyTimestamp: number;
}

export class CapiHoneyPoisoner {
  /**
   * Generates a cryptographically structured, valid synthetic fbclid
   * Format: IwAR[Base64_Payload_60_chars]
   */
  public generateSyntheticFbclid(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let randStr = 'IwAR';
    for (let i = 0; i < 56; i++) {
      randStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randStr;
  }

  /**
   * Generates a realistic synthetic Google Click Identifier (gclid)
   * Format: CjwKCAi[Base64_Payload_40_chars]
   */
  public generateSyntheticGclid(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let randStr = 'CjwKCAi';
    for (let i = 0; i < 42; i++) {
      randStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randStr;
  }

  /**
   * Generates a synthetic TikTok Click Identifier (ttclid)
   */
  public generateSyntheticTtclid(): string {
    return 'TT-' + Math.random().toString(36).substring(2, 12).toUpperCase() + '-' + Date.now();
  }

  /**
   * Creates a full synthetic attribution bundle for poisoning server-side tracking
   */
  public createHoneyPayload(): HoneyAttributionPayload {
    return {
      syntheticFbclid: this.generateSyntheticFbclid(),
      syntheticGclid: this.generateSyntheticGclid(),
      syntheticTtclid: this.generateSyntheticTtclid(),
      fuzzedUserAgentToken: 'GS_NOISE_TOKEN_' + Math.random().toString(36).substring(2, 8),
      entropyTimestamp: Date.now() - Math.floor(Math.random() * 3600000),
    };
  }
}
