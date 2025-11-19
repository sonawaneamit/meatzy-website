/**
 * Utility functions for generating referral links and QR codes
 */

/**
 * Generate a referral link with optional UTM parameters
 */
export function generateReferralLink(
  referralCode: string,
  options?: {
    includeUTM?: boolean;
    baseUrl?: string;
  }
): string {
  const baseUrl = options?.baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://getmeatzy.com');

  let link = `${baseUrl}?ref=${referralCode.toUpperCase()}`;

  // Add UTM parameters for tracking
  if (options?.includeUTM) {
    link += `&utm_source=referral&utm_medium=affiliate&utm_campaign=${referralCode}`;
  }

  return link;
}

/**
 * Generate multiple referral link formats
 */
export function generateReferralLinks(referralCode: string) {
  return {
    simple: generateReferralLink(referralCode),
    withUTM: generateReferralLink(referralCode, { includeUTM: true }),
    // For specific product pages
    ketoBox: generateReferralLink(referralCode, { includeUTM: true }) + '&product=keto-box',
    leanMachine: generateReferralLink(referralCode, { includeUTM: true }) + '&product=lean-machine',
    familyFavorites: generateReferralLink(referralCode, { includeUTM: true }) + '&product=family-favorites',
  };
}

/**
 * Generate social sharing links
 */
export function generateSocialLinks(referralCode: string, referralLink: string) {
  const message = encodeURIComponent(
    `🥩 Check out MEATZY - Premium grass-fed meat delivered to your door! Use my link to get started: ${referralLink}`
  );

  const twitterMessage = encodeURIComponent(
    `🥩 Just discovered @GetMeatzy - premium grass-fed meat delivered! Check it out:`
  );

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
    twitter: `https://twitter.com/intent/tweet?text=${twitterMessage}&url=${encodeURIComponent(referralLink)}`,
    whatsapp: `https://wa.me/?text=${message}`,
    email: `mailto:?subject=${encodeURIComponent('Check out MEATZY!')}&body=${message}`,
    sms: `sms:?&body=${message}`,
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

/**
 * Download QR code as image
 */
export function downloadQRCode(dataUrl: string, filename: string = 'meatzy-referral-qr.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
