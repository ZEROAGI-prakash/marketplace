/**
 * Advanced Security Utilities
 * Prevents source code inspection, admin detection, and unauthorized access
 */

import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.FILE_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const IV_LENGTH = 16
const ALGORITHM = 'aes-256-cbc'

// Encrypt file data before storing
export function encryptData(data: Buffer): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex'), iv)
  let encrypted = cipher.update(data)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return {
    encrypted: encrypted.toString('hex'),
    iv: iv.toString('hex'),
  }
}

// Decrypt file data when downloading
export function decryptData(encryptedData: string, iv: string): Buffer {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex'),
    Buffer.from(iv, 'hex')
  )
  let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'))
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted
}

// Generate secure file hash for integrity verification
export function generateFileHash(data: Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

// Obfuscate admin routes and endpoints
export function obfuscateAdminPath(path: string): string {
  const hash = crypto.createHash('md5').update(path + ENCRYPTION_KEY).digest('hex')
  return hash.slice(0, 16)
}

// Rate limiting for API endpoints
export interface RateLimitInfo {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitInfo>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const userLimit = rateLimitStore.get(identifier)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (userLimit.count >= maxRequests) {
    return false
  }

  userLimit.count++
  return true
}

// Watermark files with user ID for tracking
export function addWatermark(userId: string, productId: string): string {
  const timestamp = Date.now()
  const data = `${userId}:${productId}:${timestamp}`
  return crypto.createHash('sha256').update(data).digest('hex')
}

// Detect DevTools and block inspection
export const antiDevToolsScript = `
<script>
(function() {
  'use strict';
  
  // Detect DevTools
  const devtools = {
    isOpen: false,
    orientation: null
  };

  const threshold = 160;
  const emitEvent = (isOpen, orientation) => {
    window.dispatchEvent(new CustomEvent('devtoolschange', {
      detail: { isOpen, orientation }
    }));
  };

  setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const orientation = widthThreshold ? 'vertical' : 'horizontal';

    if (!(heightThreshold && widthThreshold) &&
      ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
      if (!devtools.isOpen || devtools.orientation !== orientation) {
        emitEvent(true, orientation);
      }
      devtools.isOpen = true;
      devtools.orientation = orientation;
    } else {
      if (devtools.isOpen) {
        emitEvent(false, null);
      }
      devtools.isOpen = false;
      devtools.orientation = null;
    }
  }, 500);

  // Disable right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 123 || // F12
      (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
      (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
      (e.ctrlKey && e.keyCode === 85)) { // Ctrl+U
      e.preventDefault();
      return false;
    }
  });

  // Detect console access
  const devtoolsDetector = () => {
    const before = new Date();
    debugger;
    const after = new Date();
    if (after - before > 100) {
      window.location.href = '/';
    }
  };

  setInterval(devtoolsDetector, 1000);

  // Disable text selection for sensitive content
  document.addEventListener('selectstart', (e) => {
    if (e.target.hasAttribute('data-protected')) {
      e.preventDefault();
      return false;
    }
  });

  // Clear console periodically
  setInterval(() => {
    console.clear();
  }, 2000);
})();
</script>
`

// Sanitize and validate file uploads
export function validateFileUpload(
  file: File,
  maxSize: number = 100 * 1024 * 1024, // 100MB
  allowedTypes: string[] = ['.stl', '.obj', '.fbx', '.blend', '.zip']
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` }
  }

  // Check file extension
  const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!ext || !allowedTypes.includes(ext)) {
    return { valid: false, error: `File type ${ext} not allowed. Allowed: ${allowedTypes.join(', ')}` }
  }

  return { valid: true }
}

// Generate secure download token
export function generateDownloadToken(userId: string, productId: string): string {
  const payload = {
    userId,
    productId,
    exp: Date.now() + 3600000, // 1 hour expiry
  }
  const signature = crypto
    .createHmac('sha256', ENCRYPTION_KEY)
    .update(JSON.stringify(payload))
    .digest('hex')
  
  return Buffer.from(JSON.stringify({ ...payload, signature })).toString('base64')
}

// Verify download token
export function verifyDownloadToken(token: string): { valid: boolean; userId?: string; productId?: string } {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    
    // Check expiry
    if (decoded.exp < Date.now()) {
      return { valid: false }
    }

    // Verify signature
    const { signature, ...payload } = decoded
    const expectedSignature = crypto
      .createHmac('sha256', ENCRYPTION_KEY)
      .update(JSON.stringify(payload))
      .digest('hex')

    if (signature !== expectedSignature) {
      return { valid: false }
    }

    return { valid: true, userId: decoded.userId, productId: decoded.productId }
  } catch {
    return { valid: false }
  }
}

// Hide admin credentials in memory
export function hashAdminPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export function verifyAdminPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return hash === verifyHash
}
