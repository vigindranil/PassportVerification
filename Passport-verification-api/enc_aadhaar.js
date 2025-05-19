import crypto from 'crypto';

// Use 32-byte key for AES-256
const ENCRYPTION_KEY = Buffer.from("c7f85e2f0c67e125d8b80ec928deec6ae7132bc67b1a04aa92f30836e0dc0b45", 'hex');
const IV_LENGTH = 16; // AES block size for CBC mode

// Encrypt function
export const encrypt = (text)=> {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Return IV and encrypted data (both needed for decryption)
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypt function
export const decrypt = (encryptedText) => {
  try {
    const [ivHex, encrypted] = encryptedText.split(':');
    if (!ivHex || !encrypted) throw new Error('Invalid encrypted format');
    
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err.message);
    return null;
  }
};

// Example usage
// const original = '816124495494';
// const encrypted = encrypt(original);
// const decrypted = decrypt('4e44c2902474680f2d0ecdb6ab36eb65:b37d8e4fe6ee13a9fae82a21309c8cba');

// console.log('Original:', original);
// console.log('Encrypted:', encrypted);
// console.log('Decrypted:', decrypted);
