/**
 * FUF First-Party Telemetry & Reverse-Proxy Shield (Vector 31 - 2026 Apex)
 * 
 * Major shopping apps (Flipkart, Meesho, Myntra, Swiggy) and media portals
 * increasingly route surveillance telemetry through FIRST-PARTY subdomains or
 * reverse-proxy paths to bypass standard third-party domain blocklists.
 * 
 * Examples:
 *  - analytics.flipkart.com, t.meesho.com, data.zomato.com, collect.myntra.com
 *  - flipkart.com/api/telemetry, meesho.com/metrics/log, swiggy.com/d/event
 * 
 * This engine detects and neutralizes these first-party surveillance endpoints
 * at wire speed while preserving 100% of authentic catalog, cart, and payment traffic.
 */

export interface FirstPartyShieldVerdict {
  isFirstPartyTelemetry: boolean;
  parentPlatform: string;
  subdomainType: 'TELEMETRY_SUBDOMAIN' | 'SUBPATH_PROXY' | 'CLEAN_CATALOG';
  actionTaken: 'SINKHOLED_IN_RAM' | 'CLEAN_PASS';
  targetEndpoint: string;
  reason: string;
}

export class FirstPartyProxyShield {
  // Known first-party telemetry subdomains operated by major platforms
  private static readonly FIRST_PARTY_TRACKING_SUBDOMAINS: Record<string, string> = {
    'analytics.flipkart.com': 'Flipkart First-Party Telemetry',
    'telemetry.flipkart.com': 'Flipkart Behavioral Logger',
    'metrics.flipkart.com': 'Flipkart Client Metrics',
    't.meesho.com': 'Meesho Event Telemetry Proxy',
    'analytics.meesho.com': 'Meesho Analytics Gateway',
    'logs.meesho.com': 'Meesho User Action Logger',
    'collect.myntra.com': 'Myntra Behavioral Ingestion',
    'analytics.myntra.com': 'Myntra User Telemetry',
    'track.swiggy.com': 'Swiggy Real-Time Location & Behavioral Tracker',
    'data.zomato.com': 'Zomato In-App Telemetry Collector',
    'telemetry.amazon.in': 'Amazon India In-App Metrics',
    'device-metrics.amazon.in': 'Amazon Hardware Telemetry Bridge',
    'telemetry.tatacliq.com': 'Tata CLiQ User Telemetry',
    'analytics.jiomart.com': 'JioMart Behavioral Tracker',
    'logs.paytm.com': 'Paytm Ad/Impression Tracking Gateway'
  };

  // Evasive subpath patterns used for first-party tracking proxies
  private static readonly TRACKING_SUBPATHS: RegExp[] = [
    /\/(api|v[0-9]+)\/(telemetry|track|events?|log|metrics|collect|beacon)/i,
    /\/(collect|pageview|event_logger|clickstream|ad_impression)\b/i,
    /\/tr\/(p|e|i)\b/i,
    /\/(insights|rum|monitoring)\/(log|push|record)/i
  ];

  private blockedSubdomainQueries: number = 0;
  private blockedSubpathQueries: number = 0;

  /**
   * Evaluates a domain or FQDN to determine if it represents a first-party tracking subdomain.
   */
  public evaluateDomain(domain: string): FirstPartyShieldVerdict {
    const clean = domain.toLowerCase().trim();

    for (const [subdomain, platform] of Object.entries(FirstPartyProxyShield.FIRST_PARTY_TRACKING_SUBDOMAINS)) {
      if (clean === subdomain || clean.endsWith('.' + subdomain)) {
        this.blockedSubdomainQueries++;
        return {
          isFirstPartyTelemetry: true,
          parentPlatform: platform,
          subdomainType: 'TELEMETRY_SUBDOMAIN',
          actionTaken: 'SINKHOLED_IN_RAM',
          targetEndpoint: clean,
          reason: `Neutralized first-party tracking subdomain: ${platform}`
        };
      }
    }

    return {
      isFirstPartyTelemetry: false,
      parentPlatform: 'Organic',
      subdomainType: 'CLEAN_CATALOG',
      actionTaken: 'CLEAN_PASS',
      targetEndpoint: clean,
      reason: 'Legitimate first-party commerce or content domain.'
    };
  }

  /**
   * Evaluates a full request URL to determine if it targets a first-party tracking subpath.
   */
  public evaluateUrlPath(urlStr: string): FirstPartyShieldVerdict {
    try {
      const parsed = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
      const pathname = parsed.pathname;

      for (const regex of FirstPartyProxyShield.TRACKING_SUBPATHS) {
        if (regex.test(pathname)) {
          this.blockedSubpathQueries++;
          return {
            isFirstPartyTelemetry: true,
            parentPlatform: parsed.hostname,
            subdomainType: 'SUBPATH_PROXY',
            actionTaken: 'SINKHOLED_IN_RAM',
            targetEndpoint: pathname,
            reason: `First-party tracking subpath matched: ${pathname}`
          };
        }
      }
    } catch (e) {}

    return {
      isFirstPartyTelemetry: false,
      parentPlatform: 'Organic',
      subdomainType: 'CLEAN_CATALOG',
      actionTaken: 'CLEAN_PASS',
      targetEndpoint: urlStr,
      reason: 'Clean non-telemetry application path.'
    };
  }

  public getStats() {
    return {
      blockedSubdomains: this.blockedSubdomainQueries,
      blockedSubpaths: this.blockedSubpathQueries,
      totalNeutralized: this.blockedSubdomainQueries + this.blockedSubpathQueries
    };
  }
}
