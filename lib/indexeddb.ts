const DB_NAME = 'RoxTasksDB';
const DB_VERSION = 1;
const STORE_NAME = 'wallpapers';
const ACTIVE_KEY = 'active_custom_wallpaper';

export interface StoredWallpaper {
  id: string;
  blob: Blob;
  fileName: string;
  fileType: string;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open RoxTasks IndexedDB.'));
    };
  });
}

/**
 * Save uploaded wallpaper blob into IndexedDB
 */
export async function saveCustomWallpaper(file: File): Promise<string> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const record: StoredWallpaper = {
      id: ACTIVE_KEY,
      blob: file,
      fileName: file.name,
      fileType: file.type,
      updatedAt: Date.now(),
    };

    const request = store.put(record);

    request.onsuccess = () => {
      const objectUrl = URL.createObjectURL(file);
      resolve(objectUrl);
    };

    request.onerror = () => {
      reject(request.error || new Error('Could not save wallpaper to local storage.'));
    };
  });
}

/**
 * Retrieve current active custom wallpaper from IndexedDB
 */
export async function getCustomWallpaper(): Promise<{ objectUrl: string; fileName: string } | null> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(ACTIVE_KEY);

      request.onsuccess = () => {
        const record = request.result as StoredWallpaper | undefined;
        if (record && record.blob) {
          const objectUrl = URL.createObjectURL(record.blob);
          resolve({ objectUrl, fileName: record.fileName });
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('IndexedDB wallpaper load error:', err);
    return null;
  }
}

/**
 * Delete custom wallpaper from IndexedDB
 */
export async function deleteCustomWallpaper(): Promise<void> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(ACTIVE_KEY);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('IndexedDB wallpaper delete error:', err);
  }
}
