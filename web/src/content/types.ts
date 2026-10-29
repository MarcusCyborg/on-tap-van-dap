export type SubjectId = 'xs' | 'ml' | 'dl' | 'gt';
export type Priority = 'A' | 'B' | 'C';
export type Understanding = 'unknown' | 'partial' | 'confident';

export interface ContentBlock {
  type: 'concept' | 'example' | 'answer' | 'followup' | 'trap' | 'prose';
  tag?: string;
  markdown: string;
}

export interface Concept {
  id: string; // e.g. 'XS01'
  subjectId: SubjectId;
  priority: Priority;
  title: string;
  groupTitle: string;
  order: number; // 1 to 35
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
}

export interface Exercise {
  id: string; // e.g. 'xs-ex-1'
  subjectId: SubjectId;
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
  conceptsBySubject: Record<SubjectId, { total: number; A: number; B: number; C: number }>;
  totalExercises: number;
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
