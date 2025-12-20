export function generate32CharToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}
