import crypto from 'crypto';

const hmacSecretKey = process.env.HMAC_SECRET_KEY!;

export function generateHmac(data: string, timestamp: string) {
  const hmac = crypto.createHmac('sha256', hmacSecretKey);
  hmac.update(data);
  hmac.update(timestamp);
  return hmac.digest('hex');
}
