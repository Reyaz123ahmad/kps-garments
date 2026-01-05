/**
 * Mask email address for security
 */
export const maskEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const maskedUsername = username.length > 2 
    ? username.substring(0, 2) + '*'.repeat(username.length - 2)
    : '*'.repeat(username.length);
  
  return `${maskedUsername}@${domain}`;
};

/**
 * Mask phone number for security
 */
export const maskPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length <= 6) return phone;
  
  return digits.replace(/(\d{3})(\d+)(\d{3})/, '$1**$3');
};

/**
 * Mask name for security
 */
export const maskName = (name) => {
  if (!name || typeof name !== 'string') return '';
  
  return name.length > 2 
    ? name.substring(0, 2) + '*'.repeat(name.length - 2)
    : '*'.repeat(name.length);
};

/**
 * Mask address for security
 */
export const maskAddress = (address) => {
  if (!address || typeof address !== 'string') return '';
  
  const parts = address.split(',');
  if (parts.length > 1) {
    return parts[0] + ', ' + parts[1].replace(/[a-zA-Z0-9]/g, '*');
  }
  
  return address;
};

export default {
  maskEmail,
  maskPhone,
  maskName,
  maskAddress,
};
