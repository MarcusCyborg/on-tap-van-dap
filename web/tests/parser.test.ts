import { describe, it, expect } from 'vitest';
import {
  concepts,
  foundationConcepts,
  dplConcepts,
  subjects,
  exams,
  guide,
  inventory,
  conceptMap,
  dplChapters
} from '../src/content/generated';
import { SIMULATIONS_META } from '../src/content/metadata';

describe('Content Import & Integrity', () => {
  it('has exactly 140 foundations, 72 DPL302m, and 212 total concepts', () => {
    expect(foundationConcepts.length).toBe(140);
    expect(dplConcepts.length).toBe(72);
    expect(concepts.length).toBe(212);

    expect(inventory.foundationsConcepts).toBe(140);
    expect(inventory.dpl302mConcepts).toBe(72);
    expect(inventory.totalConcepts).toBe(212);
    expect(inventory.validationStatus).toBe('pass');
    expect(inventory.validationErrors.length).toBe(0);

    const allIds = new Set(concepts.map(c => c.id));
    expect(allIds.size).toBe(212);
  });

  it('has exact 18 A / 12 B / 5 C distribution for each foundations subject', () => {
    const subjKeys = ['xs', 'ml', 'dl', 'gt'] as const;
    for (const s of subjKeys) {
      const stats = inventory.conceptsBySubject[s];
      expect(stats.total).toBe(35);
      expect(stats.A).toBe(18);
      expect(stats.B).toBe(12);
      expect(stats.C).toBe(5);
    }
  });

  it('has unique IDs from 01 to 35 for each foundations prefix', () => {
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

  it('has exact chapter breakdown and study level distribution for DPL302m (57 core, 15 further)', () => {
    expect(dplChapters.length).toBe(5);

    const expectedChapters = [
      { id: 'dpl1', total: 12, core: 11, further: 1, prefix: 'DPL1-' },
      { id: 'dpl2', total: 14, core: 11, further: 3, prefix: 'DPL2-' },
      { id: 'dpl3', total: 10, core: 8, further: 2, prefix: 'DPL3-' },
      { id: 'dpl4', total: 18, core: 14, further: 4, prefix: 'DPL4-' },
      { id: 'dpl5', total: 18, core: 13, further: 5, prefix: 'DPL5-' },
    ];

    let totalCore = 0;
    let totalFurther = 0;

    for (const exp of expectedChapters) {
      const ch = dplChapters.find(c => c.chapterId === exp.id);
      expect(ch).toBeDefined();
      expect(ch?.totalCount).toBe(exp.total);
      expect(ch?.coreCount).toBe(exp.core);
      expect(ch?.furtherCount).toBe(exp.further);
      expect(ch?.conceptIds.length).toBe(exp.total);

      totalCore += exp.core;
      totalFurther += exp.further;

      // Verify all IDs in this chapter
      for (let i = 1; i <= exp.total; i++) {
        const id = `${exp.prefix}${i.toString().padStart(2, '0')}`;
        const c = conceptMap.get(id);
        expect(c).toBeDefined();
        expect(c?.collectionId).toBe('dpl302m');
        expect(c?.chapterId).toBe(exp.id);
      }
    }

    expect(totalCore).toBe(57);
    expect(totalFurther).toBe(15);
  });

  it('contains 39 exercises (20 foundations + 19 DPL302m) and 4 preset exams', () => {
    expect(inventory.foundationsExercises).toBe(20);
    expect(inventory.dpl302mExercises).toBe(19);
    expect(inventory.totalExercises).toBe(39);

    expect(inventory.totalExams).toBe(4);
    expect(exams.length).toBe(4);
    for (const ex of exams) {
      expect(ex.questions.length).toBe(7);
    }
  });

  it('correctly parses Chapter 1 ordered-list exercises without swallowing into DPL1-12', () => {
    const ch1 = dplChapters.find(c => c.chapterId === 'dpl1');
    expect(ch1?.exercises.length).toBe(4);

    const dpl1_12 = conceptMap.get('DPL1-12');
    expect(dpl1_12).toBeDefined();
    // DPL1-12 should not contain "Bốn bài tự kiểm tra" in its body
    expect(dpl1_12?.bodyMarkdown).not.toContain('Bốn bài tự kiểm tra');
    expect(dpl1_12?.bodyMarkdown).not.toContain('Shape và tham số');

    // Exercise 1 should be Shape và tham số
    expect(ch1?.exercises[0].title).toContain('Shape');
  });

  it('correctly parses Chapter 3 exercises (3 exercises)', () => {
    const ch3 = dplChapters.find(c => c.chapterId === 'dpl3');
    expect(ch3?.exercises.length).toBe(3);
    expect(ch3?.exercises[0].title).toContain('Bài 1');
    expect(ch3?.exercises[1].title).toContain('Bài 2');
    expect(ch3?.exercises[2].title).toContain('Bài 3');
  });

  it('correctly categorizes answer blocks for DPL concepts', () => {
    const dpl1_01 = conceptMap.get('DPL1-01');
    expect(dpl1_01).toBeDefined();
    const ansBlock = dpl1_01?.blocks.find(b => b.type === 'answer');
    expect(ansBlock).toBeDefined();
    expect(ansBlock?.markdown).toMatch(/Trả lời miệng:|Mẫu đáp:/);
  });

  it('spot-checks first and last concept of each DPL chapter', () => {
    const spotChecks = [
      'DPL1-01', 'DPL1-12',
      'DPL2-01', 'DPL2-14',
      'DPL3-01', 'DPL3-10',
      'DPL4-01', 'DPL4-18',
      'DPL5-01', 'DPL5-18'
    ];

    for (const id of spotChecks) {
      const c = conceptMap.get(id);
      expect(c).toBeDefined();
      expect(c?.bodyMarkdown.length).toBeGreaterThan(100);
      expect(c?.blocks.length).toBeGreaterThan(1);
    }
  });

  it('spot-checks specific key concepts required by specification', () => {
    // DPL1-10 code/formula
    const dpl1_10 = conceptMap.get('DPL1-10');
    expect(dpl1_10).toBeDefined();
    expect(dpl1_10?.studyLevel).toBe('further');
    expect(dpl1_10?.bodyMarkdown).toContain('dW2 = (1/m) D2 A1ᵀ');
    expect(dpl1_10?.bodyMarkdown).toContain('D1  = (W2ᵀ D2) ⊙ g1\'(Z1)');

    // DPL2-11 optimizer
    const dpl2_11 = conceptMap.get('DPL2-11');
    expect(dpl2_11).toBeDefined();
    expect(dpl2_11?.bodyMarkdown.toLowerCase()).toContain('adam');

    // DPL4-13 IoU/NMS
    const dpl4_13 = conceptMap.get('DPL4-13');
    expect(dpl4_13).toBeDefined();
    expect(dpl4_13?.bodyMarkdown).toContain('IoU');
    expect(dpl4_13?.bodyMarkdown).toContain('NMS');

    // DPL5-15 attention
    const dpl5_15 = conceptMap.get('DPL5-15');
    expect(dpl5_15).toBeDefined();
    expect(dpl5_15?.bodyMarkdown.toLowerCase()).toContain('self-attention');
    expect(dpl5_15?.bodyMarkdown).toContain('Attention(Q,K,V)');
    expect(dpl5_15?.bodyMarkdown).toContain('Q');
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
