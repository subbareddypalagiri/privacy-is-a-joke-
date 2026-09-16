/**
 * GhostShield URL Clickstream & Tracking Parameter Sanitizer
 * Strips algorithmic identity parameters (fbclid, gclid, ttclid, utm_*) from URLs.
 * Destroys cross-platform graph link stitching when sharing or clicking links.
 */

export const INVASIVE_TRACKING_PARAMS = new Set([
  // Meta / Facebook Click ID
  'fbclid',
  // Google Click ID & AdWords Attribution
  'gclid',
  'gclsrc',
  'dclid',
  // TikTok & ByteDance Click ID
  'ttclid',
  // Microsoft & Bing Click ID
  'msclkid',
  // Twitter / X Attribution
  'twclid',
  // MailChimp & Email Telemetry
  'mc_eid',
  'mc_cid',
  // Standard Marketing UTM Trackers
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'utm_brand',
  // HubSpot & Salesforce Trackers
  '_hsenc',
  '_hsmi',
  'mkt_tok',
  // Yandex Click ID
  'yclid',
  // Amazon Referral & Search Tags
  'ref_',
  'tag'
]);

export class UrlSanitizer {
  public sanitizeUrl(rawUrl: string): { cleanUrl: string; strippedParams: string[] } {
    try {
      const url = new URL(rawUrl);
      const stripped: string[] = [];

      const keys = Array.from(url.searchParams.keys());
      for (const key of keys) {
        const lowerKey = key.toLowerCase();
        if (INVASIVE_TRACKING_PARAMS.has(lowerKey) || lowerKey.startsWith('utm_')) {
          url.searchParams.delete(key);
          stripped.push(key);
        }
      }

      return { cleanUrl: url.toString(), strippedParams: stripped };
    } catch (e) {
      return { cleanUrl: rawUrl, strippedParams: [] };
    }
  }
}
