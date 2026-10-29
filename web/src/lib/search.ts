import { concepts, subjects, exams, dplChapters } from '../content/generated';
import type { SubjectId, Priority, CollectionId, StudyLevel } from '../content/types';

export function normalizeVietnamese(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
}

export interface SearchResult {
  id: string;
  type: 'concept' | 'glossary' | 'exercise' | 'exam-question';
  title: string;
  subjectId?: SubjectId;
  collectionId?: CollectionId;
  chapterId?: string;
  chapterTitle?: string;
  priority?: Priority;
  studyLevel?: StudyLevel;
  snippet: string;
  url: string;
  score: number;
}

export function searchKnowledgeBase(rawQuery: string): SearchResult[] {
  const query = rawQuery.trim();
  if (!query) return [];

  const normQuery = normalizeVietnamese(query);
  const terms = normQuery.split(/\s+/).filter(Boolean);
  // Match exact ID patterns: XS01, ML35, DL07, GT20, DPL1-01, DPL4-13, or dpl413
  const cleanQueryId = query.replace(/[\s\-_]/g, '').toLowerCase();

  const results: SearchResult[] = [];

  // 1. Search Concepts (All 212 questions: 140 Foundations + 72 DPL302m)
  for (const c of concepts) {
    const normId = normalizeVietnamese(c.id);
    const cleanId = c.id.replace(/[\s\-_]/g, '').toLowerCase();
    const normTitle = normalizeVietnamese(c.title);
    const normBody = normalizeVietnamese(c.bodyMarkdown);

    let score = 0;

    // Exact ID match or clean ID match (e.g. DPL4-13, dpl413)
    if (normId === normQuery || c.id.toLowerCase() === query.toLowerCase() || cleanId === cleanQueryId) {
      score += 1000;
    } else if (normId.includes(normQuery) || cleanId.includes(cleanQueryId)) {
      score += 500;
    }

    // Title match
    if (normTitle.includes(normQuery)) {
      score += 200;
    } else {
      let matchedTerms = 0;
      for (const t of terms) {
        if (normTitle.includes(t)) matchedTerms++;
      }
      if (matchedTerms === terms.length) {
        score += 100;
      } else if (matchedTerms > 0) {
        score += matchedTerms * 20;
      }
    }

    // Body content match
    let bodyMatched = false;
    if (normBody.includes(normQuery)) {
      score += 50;
      bodyMatched = true;
    } else {
      let matchedTerms = 0;
      for (const t of terms) {
        if (normBody.includes(t)) matchedTerms++;
      }
      if (matchedTerms === terms.length) {
        score += 30;
        bodyMatched = true;
      }
    }

    if (score > 0) {
      // Create snippet
      let snippet = '';
      if (bodyMatched) {
        const idx = normBody.indexOf(normQuery !== '' ? normQuery : terms[0]);
        if (idx !== -1) {
          const start = Math.max(0, idx - 45);
          const end = Math.min(c.bodyMarkdown.length, idx + normQuery.length + 55);
          snippet = (start > 0 ? '...' : '') + c.bodyMarkdown.slice(start, end).replace(/\n+/g, ' ') + (end < c.bodyMarkdown.length ? '...' : '');
        } else {
          snippet = c.bodyMarkdown.slice(0, 100).replace(/\n+/g, ' ') + '...';
        }
      } else {
        snippet = c.bodyMarkdown.slice(0, 100).replace(/\n+/g, ' ') + '...';
      }

      const displayTitle = c.collectionId === 'dpl302m'
        ? `${c.id} [${c.studyLevel === 'core' ? 'Cốt lõi' : 'Đọc tiếp'}] ${c.title}`
        : `${c.id} [${c.priority}] ${c.title}`;

      results.push({
        id: c.id,
        type: 'concept',
        title: displayTitle,
        subjectId: c.subjectId,
        collectionId: c.collectionId,
        chapterId: c.chapterId,
        chapterTitle: c.chapterTitle,
        priority: c.priority,
        studyLevel: c.studyLevel,
        snippet,
        url: `#/learn/${c.id}`,
        score
      });
    }
  }

  // 2. Search Foundations Glossary Items
  for (const s of subjects) {
    for (const g of s.glossary) {
      const normTerm = normalizeVietnamese(g.term);
      const normMeaning = normalizeVietnamese(g.meaning);

      let score = 0;
      if (normTerm.includes(normQuery)) score += 120;
      else if (normMeaning.includes(normQuery)) score += 60;

      if (score > 0) {
        results.push({
          id: `glossary-${s.id}-${g.term}`,
          type: 'glossary',
          title: `Thuật ngữ: ${g.term} (${s.shortName})`,
          subjectId: s.id,
          collectionId: 'foundations',
          snippet: g.meaning,
          url: `#/reference/${s.id}`,
          score
        });
      }
    }
  }

  // 3. Search DPL302m Chapter Glossaries
  for (const ch of dplChapters) {
    for (const g of ch.glossary) {
      const normTerm = normalizeVietnamese(g.term);
      const normMeaning = normalizeVietnamese(g.meaning);

      let score = 0;
      if (normTerm.includes(normQuery)) score += 120;
      else if (normMeaning.includes(normQuery)) score += 60;

      if (score > 0) {
        results.push({
          id: `glossary-${ch.chapterId}-${g.term}`,
          type: 'glossary',
          title: `Thuật ngữ: ${g.term} (${ch.title.split(/[:\-]/)[0].trim()})`,
          collectionId: 'dpl302m',
          chapterId: ch.chapterId,
          chapterTitle: ch.title,
          snippet: g.meaning,
          url: `#/dpl302m/${ch.chapterId}`,
          score
        });
      }
    }
  }

  // 4. Search Foundations Exercises
  for (const s of subjects) {
    for (const ex of s.exercises) {
      const normTitle = normalizeVietnamese(ex.title);
      const normQ = normalizeVietnamese(ex.questionMarkdown);

      let score = 0;
      if (normTitle.includes(normQuery)) score += 110;
      else if (normQ.includes(normQuery)) score += 40;

      if (score > 0) {
        results.push({
          id: ex.id,
          type: 'exercise',
          title: `Bài tập: ${ex.title} (${s.shortName})`,
          subjectId: s.id,
          collectionId: 'foundations',
          snippet: ex.questionMarkdown.slice(0, 100).replace(/\n+/g, ' ') + '...',
          url: `#/reference/${s.id}`,
          score
        });
      }
    }
  }

  // 5. Search DPL302m Exercises
  for (const ch of dplChapters) {
    for (const ex of ch.exercises) {
      const normTitle = normalizeVietnamese(ex.title);
      const normQ = normalizeVietnamese(ex.questionMarkdown);

      let score = 0;
      if (normTitle.includes(normQuery)) score += 110;
      else if (normQ.includes(normQuery)) score += 40;

      if (score > 0) {
        results.push({
          id: ex.id,
          type: 'exercise',
          title: `Bài tập: ${ex.title} (${ch.title.split(/[:\-]/)[0].trim()})`,
          collectionId: 'dpl302m',
          chapterId: ch.chapterId,
          chapterTitle: ch.title,
          snippet: ex.questionMarkdown.slice(0, 100).replace(/\n+/g, ' ') + '...',
          url: `#/dpl302m/${ch.chapterId}`,
          score
        });
      }
    }
  }

  // 6. Search Exam Questions
  for (const exam of exams) {
    for (const q of exam.questions) {
      const normQ = normalizeVietnamese(q.question);
      const normHint = normalizeVietnamese(q.hint);

      let score = 0;
      if (normQ.includes(normQuery)) score += 80;
      else if (normHint.includes(normQuery)) score += 40;

      if (score > 0) {
        results.push({
          id: q.id,
          type: 'exam-question',
          title: `Đề ${exam.number} - Câu ${q.number}`,
          collectionId: 'foundations',
          snippet: q.question,
          url: `#/practice`,
          score
        });
      }
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, 30); // Return top 30
}
