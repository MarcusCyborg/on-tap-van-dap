import { concepts, exams } from '../content/generated';
import type { SubjectId, Priority, ExamAttempt, Concept, CollectionId, StudyLevel } from '../content/types';
import { loadUserData } from './storage';

export interface PracticeFilterOptions {
  collection?: CollectionId; // 'foundations' | 'dpl302m', defaults to 'foundations'
  subjects?: SubjectId[]; // for foundations: ['xs', 'ml', 'dl', 'gt']
  priorities?: Priority[]; // for foundations: ['A', 'B', 'C']
  chapters?: string[]; // for dpl302m: ['dpl1', 'dpl2', 'dpl3', 'dpl4', 'dpl5']
  studyLevels?: StudyLevel[]; // for dpl302m: ['core', 'further']
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
 * Supports both Foundations (4 subjects, A/B/C) and DPL302m (5 chapters, Core/Further).
 */
export function createCustomPracticeSession(
  options: PracticeFilterOptions
): SamplingResult {
  const userData = loadUserData();
  const collection = options.collection || 'foundations';

  let pool: Concept[] = [];

  if (collection === 'dpl302m') {
    const selectedChapters = (options.chapters && options.chapters.length > 0)
      ? options.chapters
      : ['dpl1', 'dpl2', 'dpl3', 'dpl4', 'dpl5'];

    const selectedLevels = (options.studyLevels && options.studyLevels.length > 0)
      ? options.studyLevels
      : (['core', 'further'] as StudyLevel[]);

    pool = concepts.filter(c => {
      if (c.collectionId !== 'dpl302m') return false;
      if (c.chapterId && !selectedChapters.includes(c.chapterId)) return false;
      if (c.studyLevel && !selectedLevels.includes(c.studyLevel)) return false;

      if (options.onlyNeedsReview) {
        const p = userData.conceptProgress[c.id];
        const needsReview = p?.bookmarked || p?.understanding === 'unknown' || p?.understanding === 'partial';
        if (!needsReview) return false;
      }

      return true;
    });
  } else {
    // Foundations mode
    const selectedSubjects = (options.subjects && options.subjects.length > 0)
      ? options.subjects
      : (['xs', 'ml', 'dl', 'gt'] as SubjectId[]);
    const selectedPriorities = (options.priorities && options.priorities.length > 0)
      ? options.priorities
      : (['A', 'B', 'C'] as Priority[]);

    pool = concepts.filter(c => {
      if (c.collectionId && c.collectionId !== 'foundations') return false;
      if (!selectedSubjects.includes(c.subjectId)) return false;
      if (!selectedPriorities.includes(c.priority)) return false;

      if (options.onlyNeedsReview) {
        const p = userData.conceptProgress[c.id];
        const needsReview = p?.bookmarked || p?.understanding === 'unknown' || p?.understanding === 'partial';
        if (!needsReview) return false;
      }

      return true;
    });
  }

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

  if (collection === 'dpl302m') {
    // For DPL302m:
    // "Nếu đủ năm chương trong pool và chọn ít nhất năm câu, lấy ít nhất một câu mỗi chương rồi chọn số còn lại không trùng."
    // Find unique chapters present in the filtered pool
    const presentChapters = Array.from(new Set(pool.map(c => c.chapterId).filter(Boolean))) as string[];
    presentChapters.sort(); // dpl1, dpl2, ...

    if (presentChapters.length >= 5 && targetCount >= 5) {
      const chosenIds = new Set<string>();
      for (const chId of presentChapters) {
        const candidate = shuffled.find(c => c.chapterId === chId && !chosenIds.has(c.id));
        if (candidate) {
          selected.push(candidate);
          chosenIds.add(candidate.id);
        }
      }

      // Fill remainder up to targetCount
      for (const c of shuffled) {
        if (selected.length >= targetCount) break;
        if (!chosenIds.has(c.id)) {
          selected.push(c);
          chosenIds.add(c.id);
        }
      }
    } else {
      // Pick up to targetCount from shuffled pool
      selected = shuffled.slice(0, targetCount);
    }
  } else {
    // Foundations mode
    const selectedSubjects = options.subjects || ['xs', 'ml', 'dl', 'gt'];
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

    const levelTag = c.collectionId === 'dpl302m'
      ? (c.studyLevel === 'core' ? 'Cốt lõi' : 'Đọc tiếp')
      : `Mức ${c.priority}`;

    return {
      id: c.id,
      title: `${c.id} [${levelTag}] ${c.title}`,
      questionText: c.title,
      hintText,
      subjectId: c.subjectId,
      collectionId: c.collectionId,
      chapterId: c.chapterId,
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
    title: `Câu ${q.number}: ${exam.title}`,
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
