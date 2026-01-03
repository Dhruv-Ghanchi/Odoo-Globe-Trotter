/**
 * Email Validation Utility (Frontend)
 * 
 * Provides comprehensive email validation including domain verification.
 * Ensures only valid email addresses with proper domains are accepted.
 */

/**
 * List of common valid email domains (TLDs and popular providers)
 */
const VALID_DOMAINS = [
  // Generic TLDs
  'com', 'net', 'org', 'edu', 'gov', 'mil', 'int',
  
  // Country code TLDs (popular ones)
  'co.uk', 'co.in', 'co.za', 'com.au', 'com.br', 'com.mx',
  'uk', 'us', 'ca', 'au', 'de', 'fr', 'it', 'es', 'nl', 'in', 'jp', 'cn',
  
  // New gTLDs
  'io', 'ai', 'app', 'dev', 'tech', 'online', 'site', 'website',
  'blog', 'news', 'info', 'biz', 'name', 'pro',
];

/**
 * List of disposable/temporary email domains to block
 */
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'temp-mail.org',
  'fakeinbox.com',
  'trashmail.com',
];

/**
 * Basic email format validation regex
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates email format
 */
export const isValidEmailFormat = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Extracts domain from email address
 */
export const extractDomain = (email) => {
  if (!email || typeof email !== 'string') {
    return null;
  }
  
  const parts = email.trim().toLowerCase().split('@');
  if (parts.length !== 2) {
    return null;
  }
  
  return parts[1];
};

/**
 * Checks if domain has valid TLD
 */
export const hasValidTLD = (domain) => {
  if (!domain) {
    return false;
  }
  
  const domainLower = domain.toLowerCase();
  
  // Check for exact matches (like co.uk)
  if (VALID_DOMAINS.includes(domainLower)) {
    return true;
  }
  
  // Check for TLD matches
  const parts = domainLower.split('.');
  if (parts.length < 2) {
    return false;
  }
  
  // Check last part (TLD)
  const tld = parts[parts.length - 1];
  if (VALID_DOMAINS.includes(tld)) {
    return true;
  }
  
  // Check last two parts (like co.uk)
  if (parts.length >= 2) {
    const lastTwo = parts.slice(-2).join('.');
    if (VALID_DOMAINS.includes(lastTwo)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Checks if email domain is disposable/temporary
 */
export const isDisposableEmail = (email) => {
  const domain = extractDomain(email);
  if (!domain) {
    return false;
  }
  
  return DISPOSABLE_DOMAINS.some(disposable => 
    domain.toLowerCase() === disposable.toLowerCase()
  );
};

/**
 * Comprehensive email validation
 * Returns error message or null if valid
 */
export const validateEmail = (email) => {
  // Check basic format
  if (!isValidEmailFormat(email)) {
    return 'Invalid email format';
  }
  
  // Extract domain
  const domain = extractDomain(email);
  if (!domain) {
    return 'Invalid email domain';
  }
  
  // Check for disposable email
  if (isDisposableEmail(email)) {
    return 'Disposable email addresses are not allowed';
  }
  
  // Check for valid TLD
  if (!hasValidTLD(domain)) {
    return 'Email domain is not recognized. Please use a valid email domain';
  }
  
  return null; // Valid
};
