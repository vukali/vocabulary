import { idbDeleteKeys, idbGet, idbSetEntries } from "./indexedDb";

const isBrowser = () => typeof window !== "undefined";
const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";

export const readStorageJson = (key, fallback) => {
  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
};

export const readStorageObject = (key, fallback = {}) => {
  const value = readStorageJson(key, fallback);
  return isPlainObject(value) ? value : fallback;
};

export const readStorageArray = (key, fallback = []) => {
  const value = readStorageJson(key, fallback);
  return Array.isArray(value) ? value : fallback;
};

export const readStorageText = (key, fallback) => {
  if (!isBrowser()) return fallback;
  return window.localStorage.getItem(key) || fallback;
};

export const hasStorageKey = (key) => {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(key) !== null;
};

export const writeStorageEntries = (entries) => {
  if (!isBrowser()) return;

  entries.forEach(([key, value]) => {
    window.localStorage.setItem(key, value);
  });

   void idbSetEntries(entries);
};

export const clearStorageByPrefixes = (prefixes = []) => {
  if (!isBrowser()) return;

  const keysToDelete = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key) continue;
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => {
    window.localStorage.removeItem(key);
  });

  void idbDeleteKeys(keysToDelete);
};

export const readPersistentRaw = async (key, fallback = null) => {
  if (!isBrowser()) return fallback;

  try {
    const persisted = await idbGet(key);
    if (persisted !== null && persisted !== undefined) {
      return persisted;
    }
  } catch {
    return window.localStorage.getItem(key) ?? fallback;
  }

  return window.localStorage.getItem(key) ?? fallback;
};

export const readPersistentText = async (key, fallback) => {
  const value = await readPersistentRaw(key, fallback);
  return value == null ? fallback : String(value);
};

export const readPersistentJson = async (key, fallback) => {
  const raw = await readPersistentRaw(key, null);
  if (raw == null) return fallback;

  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return fallback;
  }
};

export const migrateStorageKeysToIndexedDb = async (keys = []) => {
  if (!isBrowser()) return;

  const entries = [];
  for (const key of keys) {
    const existing = await idbGet(key);
    if (existing !== null && existing !== undefined) continue;

    const localValue = window.localStorage.getItem(key);
    if (localValue !== null) {
      entries.push([key, localValue]);
    }
  }

  if (entries.length > 0) {
    await idbSetEntries(entries);
  }
};

export const removePersistentKeys = async (keys = []) => {
  if (!isBrowser()) return;

  keys.forEach((key) => {
    window.localStorage.removeItem(key);
  });

  await idbDeleteKeys(keys);
};
