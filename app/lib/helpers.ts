/* eslint-disable @typescript-eslint/no-explicit-any */

export function generate32CharToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateWebsite(url: string): boolean {
  const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?.*)?(#.*)?$/i;
  return pattern.test(url);
}

// find duplicate keys
export function findDuplicateKeys(arr: any, keyName: string): string {
  const duplicates = Object.keys(
    arr.reduce((acc: any, obj: any) => {
      acc[obj[keyName]] = (acc[obj[keyName]] || 0) + 1;
      return acc;
    }, {}),
  ).filter((k) => arr.reduce((a: any, o: any) => (o[keyName] === k ? a + 1 : a), 0) > 1);

  return duplicates.join(',');
}

// check if the object has empty value
export function findKeysWithEmptyValues(arr: any, keyName: string, valueName: string): string {
  // Filter objects where keyName has value but valueName is empty
  const filtered = arr
    .filter((obj: any) => obj[keyName] && (!obj[valueName] || obj[valueName] === ''))
    .map((obj: any) => obj[keyName]); // get only the keys

  // Remove duplicates and join with comma
  return [...new Set(filtered)].join(',');
}

// return only the objects with values in an array
export function cleanArray(arr: any) {
  return arr.filter((obj: any) => obj.envKey !== '' || obj.envValue !== '');
}

export function isSingleEmpty(arr: any, a: string, b: string): boolean {
  return arr.length === 1 && !arr[0][a]?.trim() && !arr[0][b]?.trim();
}

// use for prisma response to remove the _debugInfo
export function removeDebugInfo(data: any) {
  if (!Array.isArray(data)) return data;

  const clean = data.slice(); // clone numeric items only

  if ('_debugInfo' in clean) {
    delete clean._debugInfo;
  }

  return clean;
}
