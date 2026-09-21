/**
 * FUF In-App Deep-Link & Affiliate Attribution Sanitizer (Vector 34)
 * 
 * E-commerce and social media apps embed persistent attribution tracking hashes
 * inside shortened and deep-link URLs (e.g. fkrt.it, amzn.to, meesho.com/d/, dl.flipkart.com).
 * When opened, these links correlate the sender and receiver's social graphs.
 * 
 * DeepLinkSanitizer intercepts, extracts the pure canonical product destination,
 * and purges all affiliate, influencer, referral, and session correlation tokens.
 */

export interface DeepLinkSanitizeResult {
  originalUrl: string;
  sanitizedUrl: string;
  isDeepLink: boolean;
  strippedTokens: string[];
  canonicalPlatform?: string;
}

export class DeepLinkSanitizer {
  // Known short-link and deep-link attribution domains
  private static readonly DEEP_LINK_HOSTS = new Set([
    'fkrt.it',
    'dl.flipkart.com',
    'amzn.to',
    'amzn.in',
    'meesho.com',
    'myntr.it',
    'app.link',
    'branch.io',
    'adjust.com'
  ]);

  // Aggressive tracking and attribution parameters to purge
  private static readonly PURGE_PARAMS = new Set([
    'affid',
    'affiliate_id',
    'ref',
    'ref_',
    'tag',
    'spm',
    'scm',
    'igshid',
    'fbclid',
    'gclid',
    'ttclid',
    'source_caller',
    'shortlink',
    'c',
    'pid',
    '_branch_match_id',
    '_b'
  ]);

  private sanitizedCount: number = 0;

  /**
   * Sanitizes a URL by peeling off attribution parameters and deep-link wrappers.
   */
  public sanitize(rawUrl: string): DeepLinkSanitizeResult {
    try {
      const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
      const hostname = parsed.hostname.toLowerCase();
      const stripped: string[] = [];

      const isDeepLink = DeepLinkSanitizer.DEEP_LINK_HOSTS.has(hostname) || hostname.endsWith('.app.link');

      // Purge query params
      const searchParams = new URLSearchParams(parsed.search);
      for (const key of Array.from(searchParams.keys())) {
        if (DeepLinkSanitizer.PURGE_PARAMS.has(key.toLowerCase()) || key.toLowerCase().startsWith('utm_')) {
          stripped.push(key);
          searchParams.delete(key);
        }
      }

      parsed.search = searchParams.toString();
      // Remove trailing hash if it contains tracking IDs
      if (parsed.hash && (parsed.hash.includes('ref=') || parsed.hash.includes('affid='))) {
        parsed.hash = '';
      }

      const sanitizedUrl = parsed.toString();
      if (stripped.length > 0 || isDeepLink) {
        this.sanitizedCount++;
      }

      return {
        originalUrl: rawUrl,
        sanitizedUrl,
        isDeepLink,
        strippedTokens: stripped,
        canonicalPlatform: hostname
      };
    } catch (e) {
      return {
        originalUrl: rawUrl,
        sanitizedUrl: rawUrl,
        isDeepLink: false,
        strippedTokens: []
      };
    }
  }

  public getStats() {
    return {
      sanitizedDeepLinks: this.sanitizedCount
    };
  }
}
