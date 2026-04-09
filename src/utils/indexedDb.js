const DB_NAME = "vocab-sprint-db";
const DB_VERSION = 1;
const STORE_NAME = "kv";

let dbPromise = null;

const isBrowser = () =>
  typeof window !== "undefined" && typeof window.indexedDB !== "undefined";

const requestToPromise = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const openDb = () => {
  if (!isBrowser()) return Promise.resolve(null);
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }).catch(() => null);

  return dbPromise;
};

const withStore = async (mode, handler) => {
  const database = await openDb();
  if (!database) return null;

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);

    let result;
    try {
      result = handler(store);
    } catch (error) {
      reject(error);
      return;
    }

    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
};

export const idbGet = async (key) =>
  withStore("readonly", (store) => requestToPromise(store.get(key)));

export const idbSetEntries = async (entries = []) =>
  withStore("readwrite", (store) => {
    entries.forEach(([key, value]) => {
      store.put(value, key);
    });
    return true;
  });

export const idbDeleteKeys = async (keys = []) =>
  withStore("readwrite", (store) => {
    keys.forEach((key) => {
      store.delete(key);
    });
    return true;
  });
