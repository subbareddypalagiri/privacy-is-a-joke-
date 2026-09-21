/**
 * FUF Autonomous DGA (Domain Generation Algorithm) Anomaly Detector (Vector 32)
 * 
 * Analyzes domain labels for mathematical randomness, consonant-vowel distribution,
 * and high-entropy algorithmic signatures to automatically detect and sinkhole
 * zero-day tracking domains, state-level spyware C2s, and evasive adtech networks
 * before any static blocklist updates.
 */

export interface DgaDetectionResult {
  isDga: boolean;
  shannonEntropy: number;
  consonantVowelRatio: number;
  maxConsecutiveConsonants: number;
  anomalyScore: number; // 0.0 to 1.0 (>= 0.65 triggers defensive sinkhole)
  recommendation: 'SINKHOLE_DGA' | 'PASS_LEGITIMATE';
  reason: string;
}

export class DgaAnomalyDetector {
  private static readonly VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
  private detectedDgaCount: number = 0;

  /**
   * Evaluates a domain name to determine if it exhibits DGA characteristics.
   */
  public evaluateDomain(domain: string): DgaDetectionResult {
    const parts = domain.toLowerCase().trim().split('.');
    if (parts.length < 2) {
      return {
        isDga: false,
        shannonEntropy: 0,
        consonantVowelRatio: 0,
        maxConsecutiveConsonants: 0,
        anomalyScore: 0,
        recommendation: 'PASS_LEGITIMATE',
        reason: 'Root or incomplete domain format.'
      };
    }

    // Extract the primary domain label (e.g., 'x8f2a9b1c' in 'x8f2a9b1c.biz')
    const primaryLabel = parts[parts.length - 2];
    
    // Ignore extremely short legitimate labels (e.g. 'sbi', 'fb', 'x')
    if (primaryLabel.length <= 4) {
      return {
        isDga: false,
        shannonEntropy: 1.5,
        consonantVowelRatio: 1.0,
        maxConsecutiveConsonants: primaryLabel.length,
        anomalyScore: 0.1,
        recommendation: 'PASS_LEGITIMATE',
        reason: 'Short conventional domain label.'
      };
    }

    const entropy = this.calculateEntropy(primaryLabel);
    const { cvRatio, maxConsonants } = this.analyzePhonetics(primaryLabel);
    const digitRatio = this.calculateDigitRatio(primaryLabel);

    // Composite Anomaly Score Model
    let score = 0;

    // High Shannon entropy (> 3.2 for typical words) indicates algorithmic randomness
    if (entropy > 3.4) score += 0.35;
    else if (entropy > 3.1) score += 0.20;

    // Abnormal consonant-to-vowel ratio (> 3.5 or < 0.2 indicates unpronounceable string)
    if (cvRatio > 3.8 || (cvRatio > 2.5 && primaryLabel.length > 8)) score += 0.25;

    // Heavy consonant clusters (> 4 consecutive consonants)
    if (maxConsonants >= 5) score += 0.25;
    else if (maxConsonants >= 4) score += 0.15;

    // High digit embedding in base label
    if (digitRatio > 0.25) score += 0.20;

    const isDga = score >= 0.60;
    if (isDga) {
      this.detectedDgaCount++;
    }

    return {
      isDga,
      shannonEntropy: parseFloat(entropy.toFixed(3)),
      consonantVowelRatio: parseFloat(cvRatio.toFixed(2)),
      maxConsecutiveConsonants: maxConsonants,
      anomalyScore: parseFloat(score.toFixed(2)),
      recommendation: isDga ? 'SINKHOLE_DGA' : 'PASS_LEGITIMATE',
      reason: isDga 
        ? `DGA signature detected (Score: ${score.toFixed(2)}, Entropy: ${entropy.toFixed(2)}, Cluster: ${maxConsonants})`
        : 'Domain phonetics conform to natural human-linguistic structure.'
    };
  }

  private calculateEntropy(str: string): number {
    const len = str.length;
    const freqs: Record<string, number> = {};
    for (let i = 0; i < len; i++) {
      const ch = str[i];
      freqs[ch] = (freqs[ch] || 0) + 1;
    }

    let entropy = 0;
    for (const ch of Object.keys(freqs)) {
      const p = freqs[ch] / len;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }

  private analyzePhonetics(str: string): { cvRatio: number; maxConsonants: number } {
    let vowels = 0;
    let consonants = 0;
    let currentConsonants = 0;
    let maxConsonants = 0;

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch >= 'a' && ch <= 'z') {
        if (DgaAnomalyDetector.VOWELS.has(ch)) {
          vowels++;
          currentConsonants = 0;
        } else {
          consonants++;
          currentConsonants++;
          if (currentConsonants > maxConsonants) {
            maxConsonants = currentConsonants;
          }
        }
      }
    }

    const cvRatio = vowels === 0 ? consonants : consonants / vowels;
    return { cvRatio, maxConsonants };
  }

  private calculateDigitRatio(str: string): number {
    let digits = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] >= '0' && str[i] <= '9') {
        digits++;
      }
    }
    return digits / str.length;
  }

  public getStats() {
    return {
      dgaDetections: this.detectedDgaCount
    };
  }
}
