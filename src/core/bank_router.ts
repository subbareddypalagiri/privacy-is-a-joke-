/**
 * FUF Zone A Financial & Government Whitelist Router
 * Ensures 100% uninterrupted 2FA, OTP delivery, net banking, and tax filing.
 */

export const FINANCIAL_WHITELIST = new Set([
  // Major Indian Banks
  'onlinesbi.sbi', 'sbi.co.in', 'retail.onlinesbi.sbi',
  'hdfcbank.com', 'netbanking.hdfcbank.com',
  'icicibank.com', 'infinity.icicibank.com',
  'axisbank.com', 'axisbank.co.in',
  'kotak.com', 'netbanking.kotak.com',
  'pnbindia.in', 'netpnb.com',
  'bankofbaroda.in', 'bobibanking.com',
  'canarabank.com', 'unionbankofindia.co.in',
  'indusind.com', 'yesbank.in', 'idfcfirstbank.com',

  // Payment Gateways & UPI Networks
  'razorpay.com', 'api.razorpay.com',
  'paytm.com', 'securegw.paytm.in',
  'phonepe.com', 'api.phonepe.com',
  'npci.org.in', 'bhimupi.org.in',
  'stripe.com', 'api.stripe.com', 'js.stripe.com',
  'paypal.com', 'www.paypal.com', 'paypalobjects.com',
  'billdesk.com', 'ccavenue.com', 'cashfree.com',

  // International Financial Institutions
  'chase.com', 'bankofamerica.com', 'wellsfargo.com',
  'citi.com', 'hsbc.com', 'standardchartered.co.in',
  'barclays.co.uk', 'revolut.com', 'wise.com',

  // Critical Government Portals
  'uidai.gov.in', 'myaadhaar.uidai.gov.in',
  'incometax.gov.in', 'eportal.incometax.gov.in',
  'epfindia.gov.in', 'passports.gov.in',
  'passportindia.gov.in', 'digilocker.gov.in',
  'parivahan.gov.in', 'irctc.co.in', 'npscra.nsdl.co.in'
]);

export class BankRouter {
  public isBankOrGovt(domain: string): boolean {
    const d = domain.toLowerCase().trim();
    if (FINANCIAL_WHITELIST.has(d)) return true;
    for (const bank of FINANCIAL_WHITELIST) {
      if (d.endsWith('.' + bank)) return true;
    }
    return false;
  }
}
