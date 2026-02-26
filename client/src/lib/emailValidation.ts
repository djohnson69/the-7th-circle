const VALID_EMAIL_DOMAINS = new Set([
  // Major providers
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'hotmail.co.uk',
  'live.com',
  'live.co.uk',
  'msn.com',
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.ca',
  'yahoo.com.au',
  'ymail.com',
  'rocketmail.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'aol.co.uk',
  'aim.com',
  
  // Privacy-focused
  'protonmail.com',
  'proton.me',
  'pm.me',
  'tutanota.com',
  'tutamail.com',
  'tuta.io',
  'fastmail.com',
  'fastmail.fm',
  'hushmail.com',
  'mailfence.com',
  'posteo.de',
  'posteo.net',
  
  // International
  'gmx.com',
  'gmx.net',
  'gmx.de',
  'gmx.at',
  'gmx.ch',
  'gmx.us',
  'web.de',
  'mail.com',
  'email.com',
  'usa.com',
  'myself.com',
  'consultant.com',
  'europe.com',
  'asia.com',
  'yandex.com',
  'yandex.ru',
  'mail.ru',
  'inbox.ru',
  'list.ru',
  'bk.ru',
  'qq.com',
  '163.com',
  '126.com',
  'sina.com',
  'sina.cn',
  'rediffmail.com',
  'libero.it',
  'virgilio.it',
  'alice.it',
  'laposte.net',
  'orange.fr',
  'sfr.fr',
  'free.fr',
  'wanadoo.fr',
  't-online.de',
  'arcor.de',
  'freenet.de',
  
  // Business/Hosting
  'zoho.com',
  'zohomail.com',
  'hey.com',
  'titan.email',
  
  // ISP email domains (US)
  'att.net',
  'sbcglobal.net',
  'bellsouth.net',
  'comcast.net',
  'xfinity.com',
  'verizon.net',
  'cox.net',
  'charter.net',
  'spectrum.net',
  'frontier.com',
  'earthlink.net',
  'juno.com',
  'netzero.net',
  'centurylink.net',
  
  // ISP email domains (International)
  'btinternet.com',
  'btopenworld.com',
  'talk21.com',
  'sky.com',
  'virginmedia.com',
  'ntlworld.com',
  'blueyonder.co.uk',
  'talktalk.net',
  'rogers.com',
  'shaw.ca',
  'telus.net',
  'sympatico.ca',
  'optusnet.com.au',
  'bigpond.com',
  'bigpond.net.au',
  'ozemail.com.au',
  
  // Education (common patterns)
  'edu',
  'ac.uk',
  
  // Tech companies
  'apple.com',
  'microsoft.com',
  'amazon.com',
  'google.com',
]);

const VALID_TLDS = new Set([
  // Generic TLDs
  'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
  'info', 'biz', 'name', 'pro', 'coop', 'museum', 'aero',
  
  // Country code TLDs (common ones)
  'us', 'uk', 'ca', 'au', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'be',
  'at', 'ch', 'pl', 'ru', 'cn', 'jp', 'kr', 'in', 'br', 'mx', 'ar',
  'za', 'nz', 'ie', 'se', 'no', 'dk', 'fi', 'cz', 'sk', 'hu', 'ro',
  'bg', 'gr', 'tr', 'il', 'ae', 'sa', 'sg', 'hk', 'tw', 'ph', 'my',
  'th', 'id', 'vn', 'pk', 'bd', 'ua', 'by', 'kz', 'ng', 'eg', 'ke',
  'gh', 'ma', 'tn', 'cl', 'co', 'pe', 've', 'ec', 'uy', 'py', 'bo',
  
  // New gTLDs (popular ones)
  'io', 'co', 'ai', 'app', 'dev', 'tech', 'online', 'site', 'store',
  'shop', 'blog', 'cloud', 'email', 'digital', 'agency', 'media',
  'design', 'studio', 'solutions', 'services', 'consulting', 'group',
  'company', 'business', 'enterprises', 'industries', 'inc', 'llc',
  'xyz', 'me', 'tv', 'cc', 'ws', 'fm', 'am', 'gg', 'ly', 'to',
  
  // Regional/special
  'ac', 'eu', 'asia',
]);

export function validateEmailDomain(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email format." };
  }

  const parts = email.toLowerCase().split('@');
  if (parts.length !== 2) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  const domain = parts[1];
  
  if (VALID_EMAIL_DOMAINS.has(domain)) {
    return { valid: true };
  }

  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { valid: false, error: "Please use a valid email provider." };
  }

  const tld = domainParts[domainParts.length - 1];
  const secondLevel = domainParts.length > 2 ? `${domainParts[domainParts.length - 2]}.${tld}` : null;
  
  if (secondLevel && (secondLevel === 'co.uk' || secondLevel === 'com.au' || secondLevel === 'co.nz' || 
      secondLevel === 'ac.uk' || secondLevel === 'org.uk' || secondLevel === 'edu.au')) {
    if (domainParts.length >= 3 && domainParts[0].length >= 2) {
      return { valid: true };
    }
  }

  if (!VALID_TLDS.has(tld)) {
    return { valid: false, error: "Please use a valid email provider." };
  }

  const domainName = domainParts[domainParts.length - 2];
  if (domainName.length < 2) {
    return { valid: false, error: "Please use a valid email provider." };
  }

  const gibberishPattern = /^[bcdfghjklmnpqrstvwxz]{5,}$/i;
  if (gibberishPattern.test(domainName)) {
    return { valid: false, error: "Please use a valid email provider." };
  }

  const repeatingPattern = /(.)\1{3,}/;
  if (repeatingPattern.test(domainName)) {
    return { valid: false, error: "Please use a valid email provider." };
  }

  const hasVowel = /[aeiou]/i.test(domainName);
  const hasConsonant = /[bcdfghjklmnpqrstvwxz]/i.test(domainName);
  if (domainName.length > 4 && (!hasVowel || !hasConsonant)) {
    return { valid: false, error: "Please use a valid email provider." };
  }

  return { valid: true };
}
