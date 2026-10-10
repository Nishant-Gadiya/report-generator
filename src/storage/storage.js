/**
 * Storage utilities.
 * - localStorage  → report text, settings, and front-sheet data
 * - IndexedDB     → image blobs (via idb)
 */
import { openDB } from 'idb';

const LS_KEY = 'reportgen_report';
const DB_NAME = 'reportgen_images';
const DB_VERSION = 1;
const IMG_STORE = 'images';

// ── localStorage ──────────────────────────────────────────────────────────────

export function saveReport(report) {
  const serialisable = {
    ...report,
    // Strip blob URLs from images before saving (blobs are in IndexedDB)
    sections: report.sections.map((sec) => ({
      ...sec,
      images: sec.images.map(({ blobUrl, ...rest }) => rest),
    })),
  };
  localStorage.setItem(LS_KEY, JSON.stringify(serialisable));
}

export function loadReport() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearReport() {
  localStorage.removeItem(LS_KEY);
}

// ── IndexedDB (image blobs) ───────────────────────────────────────────────────

let dbPromise = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(IMG_STORE)) {
          db.createObjectStore(IMG_STORE);
        }
      },
    });
  }
  return dbPromise;
}

export async function saveImageBlob(imageId, blob) {
  const db = await getDb();
  await db.put(IMG_STORE, blob, imageId);
}

export async function loadImageBlob(imageId) {
  const db = await getDb();
  return db.get(IMG_STORE, imageId);
}

export async function deleteImageBlob(imageId) {
  const db = await getDb();
  await db.delete(IMG_STORE, imageId);
}

export async function clearAllImageBlobs() {
  const db = await getDb();
  await db.clear(IMG_STORE);
}

/**
 * After loading a report from localStorage, re-hydrate blob URLs
 * for all image entries by fetching blobs from IndexedDB.
 */
export async function rehydrateImages(report) {
  const sections = await Promise.all(
    report.sections.map(async (sec) => {
      const images = await Promise.all(
        sec.images.map(async (img) => {
          const blob = await loadImageBlob(img.id);
          if (!blob) return img;
          const blobUrl = URL.createObjectURL(blob);
          return { ...img, blobUrl };
        })
      );
      return { ...sec, images };
    })
  );
  return { ...report, sections };
}
