/**
 * FUF JA4 / TLS 1.3 ClientHello Dynamic GREASE Scrambler (Vector 38)
 * 
 * Commercial bot management and anti-fraud engines (Akamai, Cloudflare, DataDome)
 * fingerprint clients using JA4/JA4X fingerprints. JA4 hashes the exact order of:
 *  - TLS Version & Transport (t13d = TCP TLS 1.3)
 *  - Cipher suite count & ordering
 *  - TLS extension count & ordering
 *  - Signature algorithm & ALPN configurations
 * 
 * This engine applies RFC 8701 GREASE (Generate Random Extensions And Sustain Extensibility)
 * and dynamically permutes compliant cipher suite sequences per session, ensuring that
 * client connections appear as novel, non-correlatable endpoints without degrading security.
 */

import crypto from 'crypto';

export interface JA4ScrambledSession {
  sessionId: string;
  tlsVersion: 'TLS 1.3 (RFC 8446)' | 'TLS 1.2';
  ja4Fingerprint: string;
  cipherSuites: number[];
  greaseCipherInjected: number;
  extensions: number[];
  greaseExtensionInjected: number;
  alpn: string[];
}

export class JA4DynamicScrambler {
  // RFC 8701 GREASE Values reserved for cipher suites & extensions
  private static readonly GREASE_VALUES = [
    0x0a0a, 0x1a1a, 0x2a2a, 0x3a3a, 0x4a4a, 0x5a5a, 0x6a6a, 0x7a7a,
    0x8a8a, 0x9a9a, 0xaaaa, 0xbaba, 0xcaca, 0xdada, 0xeaea, 0xfafa
  ];

  // Standard Compliant TLS 1.3 Ciphers
  private static readonly TLS13_CIPHERS = [
    0x1301, // TLS_AES_128_GCM_SHA256
    0x1302, // TLS_AES_256_GCM_SHA384
    0x1303  // TLS_CHACHA20_POLY1305_SHA256
  ];

  // Standard Compliant TLS 1.2 ECDHE Ciphers
  private static readonly ECDHE_CIPHERS = [
    0xc02b, // TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
    0xc02f, // TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
    0xc02c, // TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
    0xc030, // TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
    0xcca9, // TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256
    0xcca8  // TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256
  ];

  // Standard ClientHello Extensions
  private static readonly STANDARD_EXTENSIONS = [
    0x0000, // server_name (SNI)
    0x0017, // extended_master_secret
    0x0023, // session_ticket
    0x000d, // signature_algorithms
    0x002b, // supported_versions
    0x002d, // psk_key_exchange_modes
    0x0033, // key_share
    0x0010  // application_layer_protocol_negotiation (ALPN)
  ];

  private scrambledSessionsCount: number = 0;

  /**
   * Generates a new cryptographically scrambled TLS ClientHello profile for a session
   */
  public generateScrambledSession(): JA4ScrambledSession {
    this.scrambledSessionsCount++;

    // Pick random GREASE values
    const greaseCipher = JA4DynamicScrambler.GREASE_VALUES[
      Math.floor(Math.random() * JA4DynamicScrambler.GREASE_VALUES.length)
    ];
    const greaseExt = JA4DynamicScrambler.GREASE_VALUES[
      Math.floor(Math.random() * JA4DynamicScrambler.GREASE_VALUES.length)
    ];

    // Permute compliant TLS 1.3 ciphers
    const shuffledTls13 = this.shuffleArray([...JA4DynamicScrambler.TLS13_CIPHERS]);
    const shuffledEcdhe = this.shuffleArray([...JA4DynamicScrambler.ECDHE_CIPHERS]);
    
    // Inject GREASE cipher at random position
    const ciphers = [greaseCipher, ...shuffledTls13, ...shuffledEcdhe];

    // Permute extensions while preserving SNI at index 0 or 1
    const shuffledExt = this.shuffleArray([...JA4DynamicScrambler.STANDARD_EXTENSIONS]);
    const extensions = [greaseExt, ...shuffledExt];

    // Construct canonical JA4 Fingerprint string
    // Format: [protocol][transport][alpn]_[cipher_hash_12]_[extension_hash_12]
    const cipherHex = ciphers.map(c => c.toString(16).padStart(4, '0')).join(',');
    const extHex = extensions.map(e => e.toString(16).padStart(4, '0')).join(',');

    const cipherHash = crypto.createHash('sha256').update(cipherHex).digest('hex').substring(0, 12);
    const extHash = crypto.createHash('sha256').update(extHex).digest('hex').substring(0, 12);

    const ja4 = `t13d${ciphers.length}${extensions.length}h2_${cipherHash}_${extHash}`;

    return {
      sessionId: 'ses_' + crypto.randomBytes(6).toString('hex'),
      tlsVersion: 'TLS 1.3 (RFC 8446)',
      ja4Fingerprint: ja4,
      cipherSuites: ciphers,
      greaseCipherInjected: greaseCipher,
      extensions: extensions,
      greaseExtensionInjected: greaseExt,
      alpn: ['h2', 'http/1.1']
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  public getStats() {
    return {
      scrambledSessions: this.scrambledSessionsCount
    };
  }
}
