import { concepts, exams } from '../content/generated';
import type { SubjectId, Priority, ExamAttempt, Concept } from '../content/types';
import { loadUserData } from './storage';

export interface PracticeFilterOptions {
  subjects: SubjectId[]; // empty array = all 4 subjects
  priorities: Priority[]; // empty array = all (A, B, C)
  onlyNeedsReview: boolean;
  questionCount: 5 | 7;
}

export interface SamplingResult {
  success: boolean;
  message?: string;
  session?: ExamAttempt;
  availableCount: number;
}

/**
 * Deterministically or pseudo-randomly generate a practice session.
 */
export function createCustomPracticeSession(
  options: PracticeFilterOptions
): SamplingResult {
  const userData = loadUserData();
  const selectedSubjects = options.subjects.length > 0 ? options.subjects : (['xs', 'ml', 'dl', 'gt'] as SubjectId[]);
  const selectedPriorities = options.priorities.length > 0 ? options.priorities : (['A', 'B', 'C'] as Priority[]);

  // Filter pool
  let pool = concepts.filter(c => {
    if (!selectedSubjects.includes(c.subjectId)) return false;
    if (!selectedPriorities.includes(c.priority)) return false;

    if (options.onlyNeedsReview) {
      const p = userData.conceptProgress[c.id];
      const needsReview = p?.bookmarked || p?.understanding === 'unknown' || p?.understanding === 'partial';
      if (!needsReview) return false;
    }

    return true;
  });

  const availableCount = pool.length;

  if (availableCount === 0) {
    return {
      success: false,
      availableCount: 0,
      message: 'Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiện tại. Vui lòng mở rộng lựa chọn hoặc bỏ bớt điều kiện lọc.'
    };
  }

  // Shuffle pool using Fisher-Yates
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  let selected: Concept[] = [];
  const targetCount = Math.min(options.questionCount, availableCount);

  // If "all 4 subjects" selected, try to pick at least 1 from each subject first
  if (selectedSubjects.length === 4 && !options.onlyNeedsReview) {
    const subjectsToPick = ['xs', 'ml', 'dl', 'gt'] as SubjectId[];
    const chosenIds = new Set<string>();

    for (const sId of subjectsToPick) {
      const candidate = shuffled.find(c => c.subjectId === sId && !chosenIds.has(c.id));
      if (candidate) {
        selected.push(candidate);
        chosenIds.add(candidate.id);
      }
    }

    // Fill the remainder from the shuffled pool
    for (const c of shuffled) {
      if (selected.length >= targetCount) break;
      if (!chosenIds.has(c.id)) {
        selected.push(c);
        chosenIds.add(c.id);
      }
    }
  } else {
    // Standard random pick from the filtered pool
    selected = shuffled.slice(0, targetCount);
  }

  // Prepare session
  const sessionId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const questionIds = selected.map(c => c.id);

  const questionData = selected.map(c => {
    // Extract answer and followup blocks for hints
    const ansBlock = c.blocks.find(b => b.type === 'answer');
    const followupBlock = c.blocks.find(b => b.type === 'followup');
    const conceptBlock = c.blocks.find(b => b.type === 'concept');

    let hintText = '';
    if (ansBlock) {
      hintText = ansBlock.markdown;
    } else if (conceptBlock) {
      hintText = conceptBlock.markdown;
    } else {
      hintText = c.bodyMarkdown;
    }

    if (followupBlock) {
      hintText += `\n\n${followupBlock.markdown}`;
    }

    return {
      id: c.id,
      title: `${c.id} [${c.priority}] ${c.title}`,
      questionText: c.title,
      hintText,
      subjectId: c.subjectId,
      relatedConceptIds: c.relatedIds
    };
  });

  const session: ExamAttempt = {
    id: sessionId,
    type: 'custom',
    createdAt: new Date().toISOString(),
    questionIds,
    questionData,
    currentIndex: 0,
    revealedAnswers: {},
    userDrafts: {},
    scores: {},
    status: 'in-progress'
  };

  return {
    success: true,
    availableCount,
    session,
    message: availableCount < options.questionCount
      ? `Chỉ có ${availableCount} câu thỏa mãn bộ lọc (ít hơn số câu yêu cầu ${options.questionCount}). Đã tạo lượt với ${availableCount} câu.`
      : undefined
  };
}

/**
 * Initialize a preset exam session (from Đề 1, 2, 3, 4).
 */
export function createPresetExamSession(examNumber: number): ExamAttempt {
  const exam = exams.find(e => e.number === examNumber);
  if (!exam) {
    throw new Error(`Không tìm thấy Đề ${examNumber}`);
  }

  const sessionId = `preset-exam-${examNumber}-${Date.now()}`;
  const questionIds = exam.questions.map(q => q.id);

  const questionData = exam.questions.map(q => ({
    id: q.id,
    title: `Câu ${q.number} — ${exam.title}`,
    questionText: q.question,
    hintText: q.hint,
    relatedConceptIds: q.relatedConceptIds
  }));

  return {
    id: sessionId,
    examId: exam.id,
    type: 'preset',
    createdAt: new Date().toISOString(),
    questionIds,
    questionData,
    currentIndex: 0,
    revealedAnswers: {},
    userDrafts: {},
    scores: {},
    status: 'in-progress'
  };
}
