import type { UserStorageData, ConceptProgress, ExamAttempt, Understanding } from '../content/types';
import { conceptMap } from '../content/generated';

const STORAGE_KEY = 'on_van_dap_user_data_v1';
const CURRENT_SCHEMA_VERSION = 1;
const CONTENT_VERSION = '1.0.0';

export const DEFAULT_USER_DATA: UserStorageData = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  contentVersion: CONTENT_VERSION,
  updatedAt: new Date().toISOString(),
  conceptProgress: {},
  examSessions: {},
  fontSize: 'normal'
};

/**
 * Safely load user data from localStorage with schema migration and corruption handling.
 */
export function loadUserData(): UserStorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_USER_DATA, updatedAt: new Date().toISOString() };
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { ...DEFAULT_USER_DATA, updatedAt: new Date().toISOString() };
    }

    // Schema version check and migration placeholder
    if (!parsed.schemaVersion || parsed.schemaVersion < CURRENT_SCHEMA_VERSION) {
      parsed.schemaVersion = CURRENT_SCHEMA_VERSION;
    }

    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      contentVersion: CONTENT_VERSION,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      conceptProgress: parsed.conceptProgress || {},
      examSessions: parsed.examSessions || {},
      activeSessionId: parsed.activeSessionId,
      fontSize: parsed.fontSize || 'normal',
      lastStudiedConceptId: parsed.lastStudiedConceptId
    };
  } catch (err) {
    console.error('Lỗi khi đọc dữ liệu từ localStorage:', err);
    return { ...DEFAULT_USER_DATA, updatedAt: new Date().toISOString() };
  }
}

/**
 * Safely save user data to localStorage.
 */
export function saveUserData(data: UserStorageData): boolean {
  try {
    data.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('on-van-dap-storage-updated', { detail: data }));
    return true;
  } catch (err) {
    console.error('Lỗi khi lưu dữ liệu vào localStorage:', err);
    return false;
  }
}

/**
 * Update progress for a single concept.
 */
export function updateConceptProgress(
  conceptId: string,
  updates: Partial<ConceptProgress>
): UserStorageData {
  const data = loadUserData();
  const existing = data.conceptProgress[conceptId] || {
    bookmarked: false,
    note: '',
    updatedAt: new Date().toISOString()
  };

  data.conceptProgress[conceptId] = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  data.lastStudiedConceptId = conceptId;
  saveUserData(data);
  return data;
}

/**
 * Mark a concept as read.
 */
export function markConceptAsRead(conceptId: string): UserStorageData {
  const data = loadUserData();
  const existing = data.conceptProgress[conceptId];
  if (!existing?.readAt) {
    return updateConceptProgress(conceptId, { readAt: new Date().toISOString() });
  }
  return data;
}

/**
 * Update self-assessment understanding ('unknown' | 'partial' | 'confident').
 */
export function setConceptUnderstanding(
  conceptId: string,
  understanding: Understanding
): UserStorageData {
  return updateConceptProgress(conceptId, { understanding });
}

/**
 * Toggle bookmark for a concept.
 */
export function toggleConceptBookmark(conceptId: string): UserStorageData {
  const data = loadUserData();
  const existing = data.conceptProgress[conceptId];
  const isBookmarked = !(existing?.bookmarked);
  return updateConceptProgress(conceptId, { bookmarked: isBookmarked });
}

/**
 * Save user personal note for a concept.
 */
export function saveConceptNote(conceptId: string, note: string): UserStorageData {
  return updateConceptProgress(conceptId, { note });
}

/**
 * Set reader font size ('normal' | 'large' | 'xlarge').
 */
export function setReaderFontSize(size: 'normal' | 'large' | 'xlarge'): UserStorageData {
  const data = loadUserData();
  data.fontSize = size;
  saveUserData(data);
  document.documentElement.setAttribute('data-font-size', size);
  return data;
}

/**
 * Save or update an exam session.
 */
export function saveExamSession(session: ExamAttempt): UserStorageData {
  const data = loadUserData();
  data.examSessions[session.id] = session;
  data.activeSessionId = session.id;
  saveUserData(data);
  return data;
}

/**
 * Get active exam session.
 */
export function getExamSession(sessionId: string): ExamAttempt | undefined {
  const data = loadUserData();
  return data.examSessions[sessionId];
}

/**
 * Calculate user study statistics.
 */
export interface UserStats {
  totalRead: number;
  totalConcepts: number;
  understandingCounts: {
    confident: number;
    partial: number;
    unknown: number;
    unassessed: number;
  };
  totalBookmarked: number;
  totalNotes: number;
  needsReviewCount: number;
  completedExamsCount: number;
}

export function computeUserStats(data: UserStorageData): UserStats {
  const totalConcepts = 140;
  let totalRead = 0;
  let totalBookmarked = 0;
  let totalNotes = 0;
  let confident = 0;
  let partial = 0;
  let unknown = 0;
  let unassessed = 0;

  const reviewIds = new Set<string>();

  for (let i = 1; i <= 35; i++) {
    for (const prefix of ['XS', 'ML', 'DL', 'GT']) {
      const id = `${prefix}${i.toString().padStart(2, '0')}`;
      const p = data.conceptProgress[id];
      if (p?.readAt) totalRead++;
      if (p?.bookmarked) {
        totalBookmarked++;
        reviewIds.add(id);
      }
      if (p?.note?.trim()) totalNotes++;

      if (p?.understanding === 'confident') confident++;
      else if (p?.understanding === 'partial') {
        partial++;
        reviewIds.add(id);
      } else if (p?.understanding === 'unknown') {
        unknown++;
        reviewIds.add(id);
      } else {
        unassessed++;
      }
    }
  }

  const completedExamsCount = Object.values(data.examSessions).filter(
    s => s.status === 'completed'
  ).length;

  return {
    totalRead,
    totalConcepts,
    understandingCounts: { confident, partial, unknown, unassessed },
    totalBookmarked,
    totalNotes,
    needsReviewCount: reviewIds.size,
    completedExamsCount
  };
}

/**
 * Export data to a downloadable JSON file.
 */
export function exportDataAsJSON(): string {
  const data = loadUserData();
  return JSON.stringify(data, null, 2);
}

/**
 * Inspect and validate imported JSON data before applying.
 */
export interface ImportPreview {
  valid: boolean;
  error?: string;
  totalValidConcepts: number;
  unknownConceptIds: string[];
  totalExams: number;
  notesCount: number;
  bookmarksCount: number;
  sourceUpdatedAt?: string;
  dataToImport?: UserStorageData;
}

export function validateImportData(jsonString: string): ImportPreview {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'Định dạng JSON không hợp lệ hoặc rỗng.', totalValidConcepts: 0, unknownConceptIds: [], totalExams: 0, notesCount: 0, bookmarksCount: 0 };
    }

    if (!parsed.conceptProgress || typeof parsed.conceptProgress !== 'object') {
      return { valid: false, error: 'Dữ liệu thiếu mục conceptProgress.', totalValidConcepts: 0, unknownConceptIds: [], totalExams: 0, notesCount: 0, bookmarksCount: 0 };
    }

    let totalValid = 0;
    let notesCount = 0;
    let bookmarksCount = 0;
    const unknownIds: string[] = [];

    for (const [id, val] of Object.entries(parsed.conceptProgress)) {
      if (conceptMap.has(id)) {
        totalValid++;
        const p = val as ConceptProgress;
        if (p.note?.trim()) notesCount++;
        if (p.bookmarked) bookmarksCount++;
      } else {
        unknownIds.push(id);
      }
    }

    const totalExams = parsed.examSessions ? Object.keys(parsed.examSessions).length : 0;

    return {
      valid: true,
      totalValidConcepts: totalValid,
      unknownConceptIds: unknownIds,
      totalExams,
      notesCount,
      bookmarksCount,
      sourceUpdatedAt: parsed.updatedAt,
      dataToImport: parsed as UserStorageData
    };
  } catch (err: any) {
    return {
      valid: false,
      error: `Lỗi đọc JSON: ${err?.message || 'Không xác định'}`,
      totalValidConcepts: 0,
      unknownConceptIds: [],
      totalExams: 0,
      notesCount: 0,
      bookmarksCount: 0
    };
  }
}

/**
 * Apply imported data (either overwrite or merge).
 */
export function applyImportedData(dataToImport: UserStorageData, mode: 'merge' | 'overwrite'): boolean {
  try {
    const current = loadUserData();
    let merged: UserStorageData;

    if (mode === 'overwrite') {
      merged = {
        ...dataToImport,
        schemaVersion: CURRENT_SCHEMA_VERSION,
        contentVersion: CONTENT_VERSION,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Merge: keep latest notes or non-empty fields
      merged = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        contentVersion: CONTENT_VERSION,
        updatedAt: new Date().toISOString(),
        fontSize: dataToImport.fontSize || current.fontSize,
        lastStudiedConceptId: dataToImport.lastStudiedConceptId || current.lastStudiedConceptId,
        conceptProgress: {
          ...current.conceptProgress,
          ...dataToImport.conceptProgress
        },
        examSessions: {
          ...current.examSessions,
          ...dataToImport.examSessions
        }
      };
    }

    return saveUserData(merged);
  } catch (err) {
    console.error('Lỗi khi áp dụng dữ liệu nhập:', err);
    return false;
  }
}

/**
 * Reset all user progress with confirmation.
 */
export function resetUserData(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('on-van-dap-storage-updated', { detail: DEFAULT_USER_DATA }));
    return true;
  } catch (err) {
    console.error('Lỗi khi đặt lại dữ liệu:', err);
    return false;
  }
}
