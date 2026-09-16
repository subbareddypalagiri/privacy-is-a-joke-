/**
 * GhostShield Encrypted Client Hello (ECH) & DNS Type 65 (HTTPS RR) Synthesizer (RFC 9460)
 * Forces modern browsers (Chromium 117+, Firefox 118+, Safari 17+) to encrypt the TLS SNI header,
 * preventing ISP Deep Packet Inspection (DPI) firewalls from observing visited domains.
 */

export interface ECHConfig {
  version: number;
  publicName: string;
  rawEchConfigList: Buffer;
  enabled: boolean;
}

export class ECHSynthesizer {
  // Well-known Anycast ECH Public Gateways for synthesized TLS 1.3 Outer SNI
  private static readonly CLOUDFLARE_ECH_PUBLIC_NAME = 'cloudflare-ech.com';
  private static readonly DEFCAP_ECH_CONFIG = Buffer.from(
    '0044fe0d00400020000100018590c8849b2072e9d28701d90069359c349479b9bbd247f12e87900b462c111c0020000100010012636c6f7564666c6172652d6563682e636f6d0000',
    'hex'
  );

  /**
   * Detects if an incoming DNS query is asking for Type 65 (HTTPS Resource Record)
   */
  public isHttpsRecordQuery(qType: number): boolean {
    return qType === 65; // RFC 9460 HTTPS RR
  }

  /**
   * Synthesizes an RFC 9460 Type 65 HTTPS record payload containing ECH parameters
   * when upstream returns a standard A/AAAA or unpopulated HTTPS response.
   */
  public synthesizeHttpsECHResponse(domain: string, txId: number): Buffer {
    const domainLabels = domain.split('.').filter(Boolean);
    let labelBufLength = 0;
    domainLabels.forEach((l) => (labelBufLength += l.length + 1));
    labelBufLength += 1; // root null byte

    // Construct standard DNS Response Header
    const header = Buffer.alloc(12);
    header.writeUInt16BE(txId, 0);
    header.writeUInt16BE(0x8180, 2); // Standard query response, NoError
    header.writeUInt16BE(1, 4); // Questions: 1
    header.writeUInt16BE(1, 6); // Answers: 1
    header.writeUInt16BE(0, 8); // Authority RRs: 0
    header.writeUInt16BE(0, 10); // Additional RRs: 0

    // Question Section
    const question = Buffer.alloc(labelBufLength + 4);
    let offset = 0;
    domainLabels.forEach((label) => {
      question.writeUInt8(label.length, offset++);
      question.write(label, offset);
      offset += label.length;
    });
    question.writeUInt8(0, offset++); // null terminator
    question.writeUInt16BE(65, offset); // Type: HTTPS (65)
    offset += 2;
    question.writeUInt16BE(1, offset); // Class: IN (1)

    // Answer Section: HTTPS RR (Type 65) with ECH parameter key 5
    const echData = ECHSynthesizer.DEFCAP_ECH_CONFIG;
    const rdataLength = 2 + 1 + domainLabels[0].length + 1 + 2 + 2 + echData.length; // priority(2) + target + key(2) + valLen(2) + ech

    const answer = Buffer.alloc(labelBufLength + 10 + rdataLength);
    let aOffset = 0;

    // Pointer to domain in question
    answer.writeUInt16BE(0xc00c, aOffset);
    aOffset += 2;
    answer.writeUInt16BE(65, aOffset); // Type 65
    aOffset += 2;
    answer.writeUInt16BE(1, aOffset); // Class IN
    aOffset += 2;
    answer.writeUInt32BE(300, aOffset); // TTL: 300s
    aOffset += 4;
    answer.writeUInt16BE(rdataLength, aOffset); // RDLength
    aOffset += 2;

    // RDATA: SvcPriority (1) + SvcBindingName (".")
    answer.writeUInt16BE(1, aOffset); // Priority: 1 (AliasForm = 0, ServiceForm > 0)
    aOffset += 2;
    answer.writeUInt8(0, aOffset); // Target name "." (same as domain)
    aOffset += 1;

    // ParamKey 5: ECH (Encrypted Client Hello)
    answer.writeUInt16BE(5, aOffset); // Key 5 = ECH
    aOffset += 2;
    answer.writeUInt16BE(echData.length, aOffset); // Value length
    aOffset += 2;
    echData.copy(answer, aOffset);

    return Buffer.concat([header, question, answer]);
  }
}
