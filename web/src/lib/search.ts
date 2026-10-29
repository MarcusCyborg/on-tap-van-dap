import { concepts, subjects, exams } from '../content/generated';
import type { SubjectId, Priority } from '../content/types';

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
  priority?: Priority;
  snippet: string;
  url: string;
  score: number;
}

export function searchKnowledgeBase(rawQuery: string): SearchResult[] {
  const query = rawQuery.trim();
  if (!query) return [];

  const normQuery = normalizeVietnamese(query);
  const terms = normQuery.split(/\s+/).filter(Boolean);
  const isExactIdSearch = /^(xs|ml|dl|gt)\d{1,2}$/i.test(query);

  const results: SearchResult[] = [];

  // 1. Search Concepts (140 questions)
  for (const c of concepts) {
    const normId = normalizeVietnamese(c.id);
    const normTitle = normalizeVietnamese(c.title);
    const normBody = normalizeVietnamese(c.bodyMarkdown);

    let score = 0;

    // Exact ID match
    if (normId === normQuery || c.id.toLowerCase() === query.toLowerCase()) {
      score += 1000;
    } else if (normId.includes(normQuery)) {
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

      results.push({
        id: c.id,
        type: 'concept',
        title: `${c.id} [${c.priority}] ${c.title}`,
        subjectId: c.subjectId,
        priority: c.priority,
        snippet,
        url: `#/learn/${c.id}`,
        score
      });
    }
  }

  // 2. Search Glossary Items
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
          snippet: g.meaning,
          url: `#/reference/${s.id}`,
          score
        });
      }
    }
  }

  // 3. Search Self-test Exercises
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
          snippet: ex.questionMarkdown.slice(0, 100).replace(/\n+/g, ' ') + '...',
          url: `#/reference/${s.id}`,
          score
        });
      }
    }
  }

  // 4. Search Exam Questions
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
