/**
 * Dual-Zone Smart Router
 * Dynamically classifies origin domains into Zone A (High-Trust Banking/Govt)
 * vs Zone B (Wild Web / Tracking Heavy) to guarantee zero broken checkouts or locked accounts.
 */

export const DEFAULT_TRUSTED_DOMAINS = [
  // Indian Banking & Payments
  'onlinesbi.sbi',
  'sbi.co.in',
  'hdfcbank.com',
  'netbanking.hdfcbank.com',
  'icicibank.com',
  'infinity.icicibank.com',
  'axisbank.com',
  'kotak.com',
  'pnbindia.in',
  'bankofbaroda.in',
  'canarabank.com',
  'unionbankofindia.co.in',
  'razorpay.com',
  'paytm.com',
  'phonepe.com',
  'billdesk.com',
  'ccavenue.com',

  // Global Banking & Gateways
  'chase.com',
  'bankofamerica.com',
  'wellsfargo.com',
  'citi.com',
  'paypal.com',
  'stripe.com',
  'checkout.stripe.com',
  'wise.com',
  'revolut.com',

  // Government & Essential Identity Portals
  'uidai.gov.in',
  'myaadhaar.uidai.gov.in',
  'incometax.gov.in',
  'epfindia.gov.in',
  'passportindia.gov.in',
  'irctc.co.in',
  'login.gov',
  'irs.gov',
  'gov.uk'
];

export class DualZoneRouter {
  private trustedSet: Set<string>;

  constructor(customTrustedList?: string[]) {
    this.trustedSet = new Set(
      (customTrustedList || DEFAULT_TRUSTED_DOMAINS).map((d) => d.toLowerCase().trim())
    );
  }

  public updateTrustedList(list: string[]) {
    this.trustedSet = new Set(list.map((d) => d.toLowerCase().trim()));
  }

  public isTrustedDomain(hostname: string): boolean {
    const host = hostname.toLowerCase().trim();
    if (this.trustedSet.has(host)) return true;

    // Check parent domain suffixes (e.g. netbanking.hdfcbank.com matches hdfcbank.com)
    for (const trusted of this.trustedSet) {
      if (host === trusted || host.endsWith('.' + trusted)) {
        return true;
      }
    }
    return false;
  }

  public getZoneForHost(hostname: string): 'TRUSTED' | 'WILD_WEB' {
    return this.isTrustedDomain(hostname) ? 'TRUSTED' : 'WILD_WEB';
  }
}
