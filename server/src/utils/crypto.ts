import { customAlphabet } from 'nanoid';

// Generate public app ID (short, URL-safe)
const nanoidAppId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 16);

// Generate secret key (longer, more secure)
const nanoidSecret = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_', 64);

export const generateAppId = (): string => {
  return `app_${nanoidAppId()}`;
};

export const generateSecretKey = (): string => {
  return `sk_${nanoidSecret()}`;
};
