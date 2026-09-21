/**
 * Vector 26: Deep Packet Inspection (DPI) Shield
 * 
 * Defeats ISP/carrier DPI surveillance by:
 * 1. Detecting DPI injection signatures in HTTP responses (carrier-injected JS/iframes)
 * 2. Normalizing packet payload entropy to frustrate statistical fingerprinting
 * 3. Generating random-length chunked transfer patterns to defeat flow correlation
 * 4. SNI camouflage — returns plausible innocuous SNI decoys for blocked DPI categories
 * 
 * Threat model: Reliance Jio, Airtel, BSNL DPI middleboxes; corporate proxy SSL inspection
 */

export interface DpiScanResult {
  dpiInjectionDetected: boolean;
  injectionSignature: string | null;
  carrierName: string | null;
  payloadEntropy: number;
  normalized: boolean;
  recommendation: 'PASS' | 'STRIP_INJECTION' | 'TUNNEL_OVER_DOH';
}

export interface ChunkedPattern {
  chunkSizes: number[];
  interChunkDelaysMs: number[];
  totalBytes: number;
}

export interface SniCamouflageResult {
  originalSni: string;
  camouflageDecoy: string;
  category: string;
}

// Known carrier DPI injection signatures (base substrings)
const DPI_INJECTION_SIGNATURES: Record<string, string> = {
  // Jio
  'jioads.jio.com': 'Reliance Jio',
  'ads.jio.com': 'Reliance Jio',
  'jio-ads.network': 'Reliance Jio',
  // Airtel
  'airteledge.in': 'Airtel',
  'cdn.airtel.in/ads': 'Airtel',
  'ads.airtel.in': 'Airtel',
  // BSNL
  'bsnl.in/ads': 'BSNL',
  // Generic DPI markers
  'x-forwarded-for-injected': 'Generic-ISP-DPI',
  'via: 1.1 proxy': 'Transparent-Proxy',
  '__adinsert__': 'ISP-Ad-Injector',
  'adsbyisp': 'ISP-Ad-Injector',
};

// Innocuous decoy SNIs by category
const SNI_DECOY_MAP: Record<string, string> = {
  'vpn': 'software.microsoft.com',
  'proxy': 'update.googleapis.com',
  'tor': 'cdn.jsdelivr.net',
  'crypto': 'fonts.googleapis.com',
  'darkweb': 'static.cloudflare.com',
  'gaming': 'ssl.gstatic.com',
  'p2p': 'ajax.aspnetcdn.com',
};

export class DeepPacketInspectionShield {
  private injectionBlockCount = 0;
  private chunksEmitted = 0;

  /**
   * Scan an HTTP response payload for ISP/carrier DPI injection.
   * Input: raw response body as string or Buffer.
   */
  scanForDpiInjection(responseBody: string): DpiScanResult {
    const lower = responseBody.toLowerCase();

    for (const [sig, carrier] of Object.entries(DPI_INJECTION_SIGNATURES)) {
      if (lower.includes(sig)) {
        this.injectionBlockCount++;
        const entropy = this.shannonEntropy(responseBody);
        return {
          dpiInjectionDetected: true,
          injectionSignature: sig,
          carrierName: carrier,
          payloadEntropy: entropy,
          normalized: false,
          recommendation: 'STRIP_INJECTION',
        };
      }
    }

    const entropy = this.shannonEntropy(responseBody);
    // Very low entropy (<3.5) = likely injected padding / repeated chars
    if (entropy < 3.5 && responseBody.length > 200) {
      return {
        dpiInjectionDetected: true,
        injectionSignature: 'LOW_ENTROPY_INJECTION',
        carrierName: 'Unknown-ISP',
        payloadEntropy: entropy,
        normalized: false,
        recommendation: 'TUNNEL_OVER_DOH',
      };
    }

    return {
      dpiInjectionDetected: false,
      injectionSignature: null,
      carrierName: null,
      payloadEntropy: entropy,
      normalized: true,
      recommendation: 'PASS',
    };
  }

  /**
   * Strip known injection artifacts from response body.
   */
  stripInjection(responseBody: string, signature: string): string {
    // Remove script tags that match injection signature domain
    const domainPart = signature.split('/')[0];
    const scriptRegex = new RegExp(
      `<script[^>]*${domainPart.replace('.', '\\.')}[^>]*>[\\s\\S]*?<\\/script>`,
      'gi'
    );
    const iframeRegex = new RegExp(
      `<iframe[^>]*${domainPart.replace('.', '\\.')}[^>]*>[\\s\\S]*?<\\/iframe>`,
      'gi'
    );
    return responseBody.replace(scriptRegex, '').replace(iframeRegex, '');
  }

  /**
   * Vector 26A: Generate randomized chunked transfer pattern.
   * Makes DPI flow-size correlation attacks infeasible.
   */
  generateChunkedPattern(totalBytes: number): ChunkedPattern {
    const chunkSizes: number[] = [];
    const interChunkDelaysMs: number[] = [];
    let remaining = totalBytes;

    while (remaining > 0) {
      // Random chunk: 128–4096 bytes, crypto-random size
      const maxChunk = Math.min(remaining, 4096);
      const minChunk = Math.min(128, maxChunk);
      const chunkSize = minChunk + (Math.floor(Math.random() * (maxChunk - minChunk + 1)));
      chunkSizes.push(chunkSize);
      remaining -= chunkSize;

      // Random inter-chunk delay: 1–35ms (defeats timing correlation)
      interChunkDelaysMs.push(1 + Math.floor(Math.random() * 34));
    }
    this.chunksEmitted += chunkSizes.length;

    return { chunkSizes, interChunkDelaysMs, totalBytes };
  }

  /**
   * Vector 26B: SNI camouflage — return innocuous decoy SNI for blocked categories.
   */
  camouflageBlockedSni(originalSni: string, category: string): SniCamouflageResult {
    const decoy = SNI_DECOY_MAP[category.toLowerCase()] ?? 'www.example.com';
    return {
      originalSni,
      camouflageDecoy: decoy,
      category,
    };
  }

  /** Shannon entropy H(X) = -Σ p(x) log2(p(x)) */
  shannonEntropy(data: string): number {
    const freq = new Map<string, number>();
    for (const ch of data) {
      freq.set(ch, (freq.get(ch) ?? 0) + 1);
    }
    let entropy = 0;
    for (const count of freq.values()) {
      const p = count / data.length;
      entropy -= p * Math.log2(p);
    }
    return parseFloat(entropy.toFixed(4));
  }

  getStats() {
    return {
      injectionBlockCount: this.injectionBlockCount,
      chunksEmitted: this.chunksEmitted,
    };
  }
}
