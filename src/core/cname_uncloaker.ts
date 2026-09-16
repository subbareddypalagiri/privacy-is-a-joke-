/**
 * GhostShield CNAME Uncloaking Engine
 * Detects and unmasks third-party trackers disguised as first-party subdomains (CNAME Cloaking).
 * Recursively inspects DNS alias chains to block hidden Criteo, Adobe, and Keywee beacons.
 */

import { ProductionRadixTrie } from './radix_trie';

export const KNOWN_CNAME_TRACKER_TARGETS = new Set([
  'criteo.net',
  'criteo.com',
  'omtrdc.net',      // Adobe Experience Cloud Tracking
  '2o7.net',         // Adobe Omniture
  'sc.omtrdc.net',
  'wt-eu02.net',     // Webtrekk
  'wl.spotify.com',
  'branch.io',       // Mobile deep link & attribution tracker
  'app.link',
  'keywee.co',
  'wizaly.com',      // Multi-touch attribution tracker
  'eulerian.net',
  'affex.org',
  'act-on.com'
]);

export class CnameUncloaker {
  private trie: ProductionRadixTrie;

  constructor(trie: ProductionRadixTrie) {
    this.trie = trie;
  }

  public isCloakedTracker(canonicalName: string): boolean {
    const cname = canonicalName.toLowerCase().trim();
    if (this.trie.isBlocked(cname)) return true;
    for (const target of KNOWN_CNAME_TRACKER_TARGETS) {
      if (cname === target || cname.endsWith('.' + target)) {
        return true;
      }
    }
    return false;
  }
}
