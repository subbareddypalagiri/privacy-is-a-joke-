/**
 * FUF Zero-Trace Clipboard & Pasteboard Sniffing Shield (Vector 35)
 * 
 * Prevents unauthorized background snooping of system clipboard via
 * navigator.clipboard.readText() and sanitizes attribution tokens from pasted text.
 */

export class ClipboardArmor {
  private blockedReadsCount: number = 0;
  private sanitizedPastesCount: number = 0;

  /**
   * Sanitizes pasted text by stripping tracking query parameters.
   */
  public sanitizePastedText(text: string): { cleaned: string; hadTrackers: boolean } {
    if (!text || typeof text !== 'string') {
      return { cleaned: text, hadTrackers: false };
    }

    // Check if text looks like a URL
    if (text.includes('http://') || text.includes('https://') || text.includes('fkrt.it') || text.includes('meesho.com')) {
      const trackingRegex = /([?&])(utm_[^=&]+|fbclid|gclid|ttclid|affid|ref|spm)=[^&#]*/gi;
      if (trackingRegex.test(text)) {
        const cleaned = text.replace(trackingRegex, '$1').replace(/[?&]$/, '').replace(/\?&/, '?');
        this.sanitizedPastesCount++;
        return { cleaned, hadTrackers: true };
      }
    }

    return { cleaned: text, hadTrackers: false };
  }

  /**
   * Evaluates if a clipboard read request should be blocked.
   * Only explicit user paste operations should have access.
   */
  public shouldBlockClipboardRead(isUserInitiated: boolean): boolean {
    if (!isUserInitiated) {
      this.blockedReadsCount++;
      return true;
    }
    return false;
  }

  public getStats() {
    return {
      blockedReads: this.blockedReadsCount,
      sanitizedPastes: this.sanitizedPastesCount
    };
  }
}
