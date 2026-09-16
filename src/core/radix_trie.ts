/**
 * GhostShield Industrial Radix Trie
 * Sub-microsecond O(L) domain suffix matching across massive adtech & retargeting blocklists.
 */

interface TrieNode {
  children: Map<string, TrieNode>;
  isEnd: boolean;
}

export class ProductionRadixTrie {
  private root: TrieNode = { children: new Map(), isEnd: false };
  private totalDomains: number = 0;

  constructor() {
    this.seedPrimaryBlocklist();
  }

  public insert(domain: string): void {
    const parts = domain.toLowerCase().trim().split('.').reverse();
    let current = this.root;

    for (const part of parts) {
      if (!part) continue;
      if (!current.children.has(part)) {
        current.children.set(part, { children: new Map(), isEnd: false });
      }
      current = current.children.get(part)!;
    }
    if (!current.isEnd) {
      current.isEnd = true;
      this.totalDomains++;
    }
  }

  public isBlocked(domain: string): boolean {
    const parts = domain.toLowerCase().trim().split('.').reverse();
    let current = this.root;

    for (const part of parts) {
      if (current.isEnd) return true; // Suffix match (e.g. any subdomain of events.data.microsoft.com or criteo.net)
      if (!current.children.has(part)) return false;
      current = current.children.get(part)!;
    }
    return current.isEnd;
  }

  public size(): number {
    return this.totalDomains;
  }

  private seedPrimaryBlocklist() {
    const seed = [
      // 1. Meta / Facebook Cross-App Pixels & Tracking SDKs
      'connect.facebook.net', 'graph.facebook.com', 'pixel.facebook.com', 'an.facebook.com',
      'analytics.facebook.com', 'tr.snapchat.com', 'sc-static.net', 'analytics.tiktok.com',
      'ads.tiktok.com', 'business-api.tiktok.com',

      // 2. Criteo & Commercial Shopping Retargeting Networks
      'criteo.com', 'criteo.net', 'static.criteo.net', 'cas.criteo.com', 'gum.criteo.com',
      'dis.criteo.com', 'widget.criteo.com', 'adroll.com', 'd.adroll.com', 'outbrain.com',
      'taboola.com', 'trc.taboola.com', 'zemanta.com', 'revcontent.com',

      // 3. Google Advertising, Telemetry & Real-Time Bidding
      'google-analytics.com', 'googletagmanager.com', 'googletagservices.com',
      'pagead2.googlesyndication.com', 'adservice.google.com', 'doubleclick.net',
      'stats.g.doubleclick.net', 'securepubads.g.doubleclick.net', '2mdn.net',
      'googleadservices.com', 'partner.googleadservices.com',

      // 4. Data Brokers & Fingerprinting Profilers
      'scorecardresearch.com', 'sb.scorecardresearch.com', 'fpjs.pro', 'api.fpjs.io',
      'hotjar.com', 'static.hotjar.com', 'clarity.ms', 'c.clarity.ms', 'mouseflow.com',
      'crazyegg.com', 'mixpanel.com', 'api.mixpanel.com', 'segment.io', 'api.segment.io',
      'amplitude.com', 'api.amplitude.com', 'heapanalytics.com', 'fullstory.com',

      // 5. Ad Exchanges & Header Bidding Platforms
      'adnxs.com', 'ib.adnxs.com', 'rubiconproject.com', 'fastlane.rubiconproject.com',
      'pubmatic.com', 'ads.pubmatic.com', 'openx.net', 'smartadserver.com',
      'casalemedia.com', 'indexexchange.com', 'sovrn.com', 'yieldmo.com',
      'sharethrough.com', 'triplelift.com', 'teads.tv', 'inmobi.com',

      // 6. Windows & Microsoft OS Telemetry Beacons
      'telemetry.microsoft.com', 'events.data.microsoft.com', 'data.microsoft.com',
      'settings-win.data.microsoft.com', 'diagnostics.support.microsoft.com',
      'watson.telemetry.microsoft.com', 'feedback.microsoft.com',
      'telemetry.urs.microsoft.com', 'browser.pipe.aria.microsoft.com',

      // 7. Ultrasonic & Acoustic Cross-Device Proximity Trackers
      'silverpush.co', 'api.silverpush.co', 'alphonso.tv', 'audio.alphonso.tv',
      'lisnr.com', 'api.lisnr.com', 'signal360.com', 'shopkick.com', 'beacons.shopkick.com'
    ];

    seed.forEach((domain) => this.insert(domain));
  }
}
