import crypto from 'crypto';

const hmacSecretKey = process.env.HMAC_SECRET_KEY!;
const maxTimeDiff = 30 * 1000; // 30s

export function generateHmac(data: string, timestamp: string) {
  const hmac = crypto.createHmac('sha256', hmacSecretKey);
  hmac.update(data);
  hmac.update(timestamp);
  return hmac.digest('hex');
}

export function verifyHmac(data: string, timestamp: number, signature: string) {
  const expectedSignature = generateHmac(data, timestamp.toString());
  const isValidTimestamp = Math.abs(Date.now() - timestamp) <= maxTimeDiff;
  const isValidSignature = signature === expectedSignature;
  return isValidTimestamp && isValidSignature;
}
