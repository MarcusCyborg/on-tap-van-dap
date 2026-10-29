import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadUserData,
  saveUserData,
  updateConceptProgress,
  setConceptUnderstanding,
  toggleConceptBookmark,
  saveConceptNote,
  computeUserStats,
  exportDataAsJSON,
  validateImportData,
  applyImportedData,
  resetUserData,
  DEFAULT_USER_DATA
} from '../src/lib/storage';
import { normalizeVietnamese, searchKnowledgeBase } from '../src/lib/search';
import { createCustomPracticeSession, createPresetExamSession } from '../src/lib/sampling';

// Mock localStorage for test environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });
Object.defineProperty(global, 'window', {
  value: {
    dispatchEvent: () => true,
    addEventListener: () => true,
    removeEventListener: () => true
  }
});
Object.defineProperty(global, 'CustomEvent', {
  value: class CustomEvent {
    constructor(public type: string, public init?: any) {}
  }
});
Object.defineProperty(global, 'document', {
  value: {
    documentElement: {
      setAttribute: () => {}
    }
  }
});

describe('Vietnamese Accent Normalization & Search', () => {
  it('normalizes accents and converts đ -> d', () => {
    expect(normalizeVietnamese('Xác suất thống kê')).toBe('xac suat thong ke');
    expect(normalizeVietnamese('Độ lệch chuẩn')).toBe('do lech chuan');
    expect(normalizeVietnamese('ĐỆ QUY')).toBe('de quy');
    expect(normalizeVietnamese('ML30')).toBe('ml30');
  });

  it('searches by exact ID with highest priority', () => {
    const results = searchKnowledgeBase('ML30');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].id).toBe('ML30');
  });

  it('finds concepts with both accented and unaccented queries', () => {
    const r1 = searchKnowledgeBase('xac suat');
    const r2 = searchKnowledgeBase('xác suất');
    expect(r1.length).toBeGreaterThan(0);
    expect(r2.length).toBeGreaterThan(0);
    expect(r1[0].id).toBe(r2[0].id);

    const r3 = searchKnowledgeBase('do lech chuan');
    const r4 = searchKnowledgeBase('độ lệch chuẩn');
    expect(r3.some(res => res.id === 'XS06')).toBe(true);
    expect(r4.some(res => res.id === 'XS06')).toBe(true);
  });

  it('finds terms in glossary', () => {
    const results = searchKnowledgeBase('variance');
    expect(results.some(r => r.type === 'glossary')).toBe(true);
  });
});

describe('Storage, Progress & Backup/Restore', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('initializes with default data', () => {
    const data = loadUserData();
    expect(data.schemaVersion).toBe(1);
    expect(Object.keys(data.conceptProgress).length).toBe(0);
  });

  it('tracks concept progress, bookmarking, and notes independently', () => {
    updateConceptProgress('XS01', { readAt: new Date().toISOString() });
    setConceptUnderstanding('XS01', 'confident');
    toggleConceptBookmark('XS01');
    saveConceptNote('XS01', 'Ghi chú quan trọng về xác suất');

    const data = loadUserData();
    const p = data.conceptProgress['XS01'];
    expect(p.readAt).toBeDefined();
    expect(p.understanding).toBe('confident');
    expect(p.bookmarked).toBe(true);
    expect(p.note).toBe('Ghi chú quan trọng về xác suất');

    const stats = computeUserStats(data);
    expect(stats.totalRead).toBe(1);
    expect(stats.understandingCounts.confident).toBe(1);
    expect(stats.totalBookmarked).toBe(1);
    expect(stats.totalNotes).toBe(1);
  });

  it('validates import data correctly and rejects malformed JSON', () => {
    const invalid = validateImportData('{ bad json');
    expect(invalid.valid).toBe(false);

    const validJSON = JSON.stringify({
      schemaVersion: 1,
      conceptProgress: {
        XS01: { bookmarked: true, note: 'Test note', updatedAt: new Date().toISOString() },
        UNKNOWN99: { bookmarked: false, note: '', updatedAt: new Date().toISOString() }
      }
    });

    const preview = validateImportData(validJSON);
    expect(preview.valid).toBe(true);
    expect(preview.totalValidConcepts).toBe(1);
    expect(preview.unknownConceptIds).toEqual(['UNKNOWN99']);
    expect(preview.notesCount).toBe(1);
    expect(preview.bookmarksCount).toBe(1);
  });

  it('merges imported data without wiping existing unmentioned notes', () => {
    updateConceptProgress('ML01', { note: 'Existing ML note' });

    const importData = {
      ...DEFAULT_USER_DATA,
      conceptProgress: {
        XS02: { bookmarked: true, note: 'Imported XS note', updatedAt: new Date().toISOString() }
      }
    };

    applyImportedData(importData, 'merge');
    const data = loadUserData();
    expect(data.conceptProgress['ML01']?.note).toBe('Existing ML note');
    expect(data.conceptProgress['XS02']?.note).toBe('Imported XS note');
  });
});

describe('Practice Session Sampling', () => {
  it('creates preset exam sessions correctly', () => {
    for (let i = 1; i <= 4; i++) {
      const session = createPresetExamSession(i);
      expect(session.type).toBe('preset');
      expect(session.questionIds.length).toBe(7);
      expect(session.questionData.length).toBe(7);
      expect(session.status).toBe('in-progress');
    }
  });

  it('creates 5 or 7 custom questions across all 4 subjects', () => {
    const res5 = createCustomPracticeSession({
      subjects: ['xs', 'ml', 'dl', 'gt'],
      priorities: ['A', 'B', 'C'],
      onlyNeedsReview: false,
      questionCount: 5
    });
    expect(res5.success).toBe(true);
    expect(res5.session?.questionIds.length).toBe(5);

    // Each subject should have at least 1 when 4 subjects are picked in 5 questions
    const subjectsInSession = new Set(res5.session?.questionData.map(q => q.subjectId));
    expect(subjectsInSession.size).toBe(4);

    const res7 = createCustomPracticeSession({
      subjects: ['xs', 'ml', 'dl', 'gt'],
      priorities: ['A'],
      onlyNeedsReview: false,
      questionCount: 7
    });
    expect(res7.success).toBe(true);
    expect(res7.session?.questionIds.length).toBe(7);
  });
});
