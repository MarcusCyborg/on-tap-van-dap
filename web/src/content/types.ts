export type SubjectId = 'xs' | 'ml' | 'dl' | 'gt';
export type Priority = 'A' | 'B' | 'C';
export type Understanding = 'unknown' | 'partial' | 'confident';
export type CollectionId = 'foundations' | 'dpl302m';
export type StudyLevel = 'core' | 'further';

export interface SourceReference {
  lessonId: string;       // e.g. "1.2"
  file: string;           // e.g. "1.2 Basic Neural Network.txt"
  slideMarkers?: string;  // e.g. "slide 4–10"
  infoType?: 'confirmed' | 'rewritten-formula' | 'supplemented';
}

export interface ContentBlock {
  type: 'concept' | 'example' | 'answer' | 'followup' | 'trap' | 'prose';
  tag?: string;
  markdown: string;
}

export interface Concept {
  id: string; // e.g. 'XS01' or 'DPL1-01'
  subjectId: SubjectId;
  priority: Priority;
  title: string;
  groupTitle: string;
  order: number; // 1 to 35 for foundations; chapter-relative for dpl302m
  bodyMarkdown: string;
  blocks: ContentBlock[];
  relatedIds: string[];
  prerequisiteIds: string[];
  simulationIds: string[];
  source: {
    file: string;
    heading: string;
    startLine: number;
    endLine: number;
    hash: string;
  };
  // DPL302m-specific optional fields
  collectionId?: CollectionId;
  chapterId?: string;        // e.g. 'dpl1'
  chapterTitle?: string;     // e.g. 'Chương 1 — Từ logistic regression đến mạng nhiều tầng'
  lessonIds?: string[];      // e.g. ['1.1', '1.2']
  studyLevel?: StudyLevel;   // 'core' or 'further'
  sourceReferences?: SourceReference[];
}

export interface Exercise {
  id: string; // e.g. 'xs-ex-1' or 'dpl1-ex-1'
  subjectId?: SubjectId;
  collectionId?: CollectionId;
  chapterId?: string;
  number: number;
  title: string;
  questionMarkdown: string;
  solutionMarkdown: string;
}

export interface GlossaryItem {
  term: string;
  meaning: string;
}

export interface ReferenceSection {
  title: string;
  contentMarkdown: string;
}

export interface PythonExample {
  title: string;
  code: string;
  description: string;
}

export interface SubjectGroup {
  id: string;
  title: string;
  conceptIds: string[];
}

export interface Subject {
  id: SubjectId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  accentColor: string;
  order: number;
  readingPathA: string[];
  readingPathB: string[];
  readingPathC: string[];
  groups: SubjectGroup[];
  exercises: Exercise[];
  referenceSections: ReferenceSection[];
  pythonExamples?: PythonExample[];
  glossary: GlossaryItem[];
  introMarkdown: string;
}

// DPL302m chapter data structure
export interface DplChapter {
  chapterId: string;       // e.g. 'dpl1'
  title: string;
  file: string;
  idPrefix: string;        // e.g. 'DPL1-'
  coreCount: number;
  furtherCount: number;
  totalCount: number;
  conceptIds: string[];
  sourceLessons: string[];
  introMarkdown: string;
  exercises: Exercise[];
  referenceSections: ReferenceSection[];
  glossary: GlossaryItem[];
}

export interface ExamQuestion {
  id: string; // e.g. 'exam-1-q1'
  number: number;
  question: string;
  hint: string;
  relatedConceptIds?: string[];
}

export interface Exam {
  id: string; // e.g. 'exam-1'
  number: number;
  title: string;
  subtitle: string;
  questions: ExamQuestion[];
  reviewSheetMarkdown?: string;
}

export interface GuideSection {
  title: string;
  contentMarkdown: string;
}

export interface GuideData {
  title: string;
  overview: string;
  relations: string;
  eightConcepts: {
    title: string;
    content: string;
  }[];
  priorities: string;
  studyStrategy: string;
  fourHourScheduleTable: string;
  answerMethod: string;
  whenToMoveOn: string;
  aiPromptTemplate: string;
}

export interface ContentInventory {
  generatedAt: string;
  totalConcepts: number;
  foundationsConcepts: number;
  dpl302mConcepts: number;
  conceptsBySubject: Record<SubjectId, { total: number; A: number; B: number; C: number }>;
  dpl302mByChapter: Record<string, { total: number; core: number; further: number }>;
  totalExercises: number;
  foundationsExercises: number;
  dpl302mExercises: number;
  totalExams: number;
  totalExamQuestions: number;
  totalGlossaryItems: number;
  simulationCount: number;
  validationStatus: 'pass' | 'fail';
  validationErrors: string[];
}

// User state & persistence schema
export interface ConceptProgress {
  readAt?: string;
  understanding?: Understanding; // undefined = not assessed yet
  bookmarked: boolean;
  note: string;
  updatedAt: string;
}

export interface ExamAttempt {
  id: string;
  examId?: string; // if preset exam
  type: 'preset' | 'custom';
  createdAt: string;
  completedAt?: string;
  questionIds: string[]; // for preset, these are 'exam-X-qY'; for custom, these are concept IDs
  questionData: {
    id: string;
    title: string;
    questionText: string;
    hintText: string;
    subjectId?: SubjectId;
    collectionId?: CollectionId;
    chapterId?: string;
    relatedConceptIds?: string[];
  }[];
  currentIndex: number;
  revealedAnswers: Record<string, boolean>;
  userDrafts: Record<string, string>;
  scores: Record<string, 0 | 1 | 2>; // 0, 1, 2 rubric
  status: 'in-progress' | 'completed';
}

export interface UserStorageData {
  schemaVersion: number;
  contentVersion: string;
  updatedAt: string;
  conceptProgress: Record<string, ConceptProgress>;
  examSessions: Record<string, ExamAttempt>;
  activeSessionId?: string;
  fontSize: 'normal' | 'large' | 'xlarge';
  lastStudiedConceptId?: string;
}
