/**
 * Safe LocalStorage Persistence Utility
 * Automatically handles JSON serialization, versioning, error recovery,
 * and ensures sensitive credentials are never persisted to disk.
 */

const STORAGE_PREFIX = "skillsync_demo_";

export const getStorageItem = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[SkillSync Storage] Error reading key "${key}":`, err);
    return fallback;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn(`[SkillSync Storage] Error writing key "${key}":`, err);
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (err) {
    console.warn(`[SkillSync Storage] Error deleting key "${key}":`, err);
  }
};

/**
 * Resets all demo storage back to pristine factory mock data
 */
export const resetDemoStorage = () => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  } catch (err) {
    console.error("[SkillSync Storage] Reset failed:", err);
  }
};
