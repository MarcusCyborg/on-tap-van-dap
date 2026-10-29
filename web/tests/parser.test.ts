import { describe, it, expect } from 'vitest';
import { concepts, subjects, exams, guide, inventory, conceptMap } from '../src/content/generated';
import { SIMULATIONS_META } from '../src/content/metadata';

describe('Content Import & Integrity', () => {
  it('has exactly 140 concepts across 4 subjects', () => {
    expect(concepts.length).toBe(140);
    expect(inventory.totalConcepts).toBe(140);
    expect(inventory.validationStatus).toBe('pass');
    expect(inventory.validationErrors.length).toBe(0);
  });

  it('has exact 18 A / 12 B / 5 C distribution for each subject', () => {
    const subjects = ['xs', 'ml', 'dl', 'gt'] as const;
    for (const s of subjects) {
      const stats = inventory.conceptsBySubject[s];
      expect(stats.total).toBe(35);
      expect(stats.A).toBe(18);
      expect(stats.B).toBe(12);
      expect(stats.C).toBe(5);
    }
  });

  it('has unique IDs from 01 to 35 for each prefix', () => {
    const prefixes = ['XS', 'ML', 'DL', 'GT'];
    for (const p of prefixes) {
      for (let i = 1; i <= 35; i++) {
        const id = `${p}${i.toString().padStart(2, '0')}`;
        const c = conceptMap.get(id);
        expect(c).toBeDefined();
        expect(c?.order).toBe(i);
        expect(c?.bodyMarkdown.length).toBeGreaterThan(50);
        expect(c?.blocks.length).toBeGreaterThan(0);
      }
    }
  });

  it('contains non-question sections: 20 exercises and 4 exams', () => {
    expect(inventory.totalExercises).toBe(20);
    expect(inventory.totalExams).toBe(4);
    expect(exams.length).toBe(4);
    for (const ex of exams) {
      expect(ex.questions.length).toBe(7);
    }
  });

  it('has all 8 simulations mapped to valid concepts', () => {
    expect(SIMULATIONS_META.length).toBe(8);
    for (const sim of SIMULATIONS_META) {
      expect(sim.conceptIds.length).toBeGreaterThan(0);
      for (const cId of sim.conceptIds) {
        expect(conceptMap.has(cId)).toBe(true);
      }
    }
  });

  it('has valid related and prerequisite concept IDs without dead links', () => {
    for (const c of concepts) {
      for (const rId of c.relatedIds) {
        expect(conceptMap.has(rId)).toBe(true);
      }
      for (const pId of c.prerequisiteIds) {
        expect(conceptMap.has(pId)).toBe(true);
      }
    }
  });

  it('does not swallow exercises/glossary into GT35 or XS35/ML35/DL35', () => {
    const gt35 = conceptMap.get('GT35');
    expect(gt35?.bodyMarkdown).toContain('Prefix sum');
    expect(gt35?.bodyMarkdown).not.toContain('Hai ví dụ Python');
    expect(gt35?.bodyMarkdown).not.toContain('Bảng độ phức tạp');

    const xs35 = conceptMap.get('XS35');
    expect(xs35?.bodyMarkdown).toContain('MLE');
    expect(xs35?.bodyMarkdown).not.toContain('Năm bài tự kiểm tra');
    expect(xs35?.bodyMarkdown).not.toContain('Bảng công thức');
  });

  it('has guide data loaded correctly', () => {
    expect(guide.title).toBeDefined();
    expect(guide.eightConcepts.length).toBe(8);
    expect(guide.fourHourScheduleTable).toContain('Xác suất thống kê');
  });
});
