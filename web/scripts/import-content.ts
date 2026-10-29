import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  SubjectId,
  CollectionId,
  StudyLevel,
  Priority,
  Concept,
  ContentBlock,
  Subject,
  SubjectGroup,
  Exercise,
  GlossaryItem,
  ReferenceSection,
  PythonExample,
  Exam,
  ExamQuestion,
  GuideData,
  ContentInventory,
  DplChapter,
  SourceReference
} from '../src/content/types';
import {
  SIMULATIONS_META,
  SUBJECT_INFO,
  CONCEPT_METADATA,
  EXAM_RELATED_CONCEPTS
} from '../src/content/metadata';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CHUYEN_DE_DIR = path.resolve(__dirname, '../../Chuyen-de');
const DPL302M_DIR = path.resolve(__dirname, '../../DPL302m');
const OUT_DIR = path.resolve(__dirname, '../src/content/generated');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function computeHash(content: string): string {
  return crypto.createHash('sha256').update(content.trim()).digest('hex').slice(0, 12);
}

// Helper to parse blocks inside a concept
// Supports both "Trả lời miệng"/"Trả lời" (foundations) and "Mẫu đáp" (DPL302m)
function parseConceptBlocks(bodyLines: string[]): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let currentType: ContentBlock['type'] = 'prose';
  let currentTag: string | undefined = undefined;
  let currentBuffer: string[] = [];

  const flush = () => {
    if (currentBuffer.length > 0) {
      const markdown = currentBuffer.join('\n').trim();
      if (markdown) {
        blocks.push({
          type: currentType,
          tag: currentTag,
          markdown
        });
      }
      currentBuffer = [];
    }
  };

  for (const line of bodyLines) {
    const boldTagMatch = line.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
    if (boldTagMatch) {
      flush();
      const rawTag = boldTagMatch[1].trim();

      const lower = rawTag.toLowerCase();
      if (lower.includes('hiểu') || lower.includes('định nghĩa') || lower.includes('bản chất')) {
        currentType = 'concept';
      } else if (lower.includes('ví dụ')) {
        currentType = 'example';
      } else if (lower.includes('trả lời miệng') || lower.includes('trả lời') || lower.includes('mẫu đáp')) {
        // Handles both "Trả lời miệng" (foundations) and "Mẫu đáp" (DPL302m)
        currentType = 'answer';
      } else if (lower.includes('nối tiếp') || lower.includes('hỏi tiếp')) {
        currentType = 'followup';
      } else if (lower.includes('bẫy') || lower.includes('lưu ý')) {
        currentType = 'trap';
      } else if (lower.includes('nguồn')) {
        // "Nguồn:" in DPL302m - treat as prose metadata
        currentType = 'prose';
      } else {
        currentType = 'prose';
      }

      currentTag = rawTag;
      currentBuffer.push(line);
    } else {
      currentBuffer.push(line);
    }
  }

  flush();

  // If no specific blocks were tagged, keep everything as prose
  if (blocks.length === 0 && bodyLines.length > 0) {
    blocks.push({
      type: 'prose',
      markdown: bodyLines.join('\n').trim()
    });
  }

  return blocks;
}

// ============================================================
// 1. Parse 00-Cach-hoc-va-ban-do-kien-thuc.md (Guide)
// ============================================================
function parseGuide(): GuideData {
  const filePath = path.join(CHUYEN_DE_DIR, '00-Cach-hoc-va-ban-do-kien-thuc.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let title = 'Bản đồ kiến thức và cách dùng bộ chuyên đề';
  let overview = '';
  let relations = '';
  const eightConcepts: { title: string; content: string }[] = [];
  let priorities = '';
  let studyStrategy = '';
  let fourHourScheduleTable = '';
  let answerMethod = '';
  let whenToMoveOn = '';
  let aiPromptTemplate = '';

  let currentSection = '';
  let buffer: string[] = [];
  let currentSubconceptTitle = '';
  let currentSubconceptBuffer: string[] = [];

  const flushSection = () => {
    const text = buffer.join('\n').trim();
    if (currentSection === 'overview') overview = text;
    else if (currentSection === 'relations') relations = text;
    else if (currentSection === 'priorities') priorities = text;
    else if (currentSection === 'studyStrategy') studyStrategy = text;
    else if (currentSection === 'schedule') fourHourScheduleTable = text;
    else if (currentSection === 'answerMethod') answerMethod = text;
    else if (currentSection === 'whenToMoveOn') whenToMoveOn = text;
    else if (currentSection === 'aiPrompt') aiPromptTemplate = text;
    buffer = [];
  };

  const flushSubconcept = () => {
    if (currentSubconceptTitle && currentSubconceptBuffer.length > 0) {
      eightConcepts.push({
        title: currentSubconceptTitle,
        content: currentSubconceptBuffer.join('\n').trim()
      });
      currentSubconceptTitle = '';
      currentSubconceptBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('# ')) {
      title = line.replace(/^#\s+/, '').trim();
    } else if (line.startsWith('## Bộ này giải quyết việc gì?')) {
      flushSection();
      currentSection = 'overview';
    } else if (line.startsWith('## Bốn mảng liên quan với nhau ra sao?')) {
      flushSection();
      currentSection = 'relations';
    } else if (line.startsWith('## Tám khái niệm nhỏ để đỡ bị ngợp')) {
      flushSection();
      currentSection = 'eightConcepts';
    } else if (line.startsWith('## Ba mức ưu tiên trong mỗi chuyên đề')) {
      flushSubconcept();
      flushSection();
      currentSection = 'priorities';
    } else if (line.startsWith('## Có tài liệu rộng nhưng chỉ còn một tối')) {
      flushSection();
      currentSection = 'studyStrategy';
    } else if (line.startsWith('### Gợi ý phân bổ nếu còn khoảng 4 giờ')) {
      flushSection();
      currentSection = 'schedule';
    } else if (line.startsWith('## Cách trả lời một câu vấn đáp')) {
      flushSection();
      currentSection = 'answerMethod';
    } else if (line.startsWith('## Khi nào được chuyển sang câu tiếp theo?')) {
      flushSection();
      currentSection = 'whenToMoveOn';
    } else if (line.startsWith('## Yêu cầu người khác hoặc AI hỏi thử')) {
      flushSection();
      currentSection = 'aiPrompt';
    } else {
      if (currentSection === 'eightConcepts') {
        if (line.startsWith('### ')) {
          flushSubconcept();
          currentSubconceptTitle = line.replace(/^###\s+/, '').trim();
        } else {
          currentSubconceptBuffer.push(line);
        }
      } else {
        buffer.push(line);
      }
    }
  }

  flushSubconcept();
  flushSection();

  return {
    title,
    overview,
    relations,
    eightConcepts,
    priorities,
    studyStrategy,
    fourHourScheduleTable,
    answerMethod,
    whenToMoveOn,
    aiPromptTemplate
  };
}

// ============================================================
// 2. Parse Foundation Subject Files (01, 02, 03, 04)
// ============================================================
interface SubjectParseResult {
  subject: Subject;
  concepts: Concept[];
}

function parseSubjectFile(subjectId: SubjectId, fileName: string, prefix: string): SubjectParseResult {
  const filePath = path.join(CHUYEN_DE_DIR, fileName);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const concepts: Concept[] = [];
  const exercises: Exercise[] = [];
  const referenceSections: ReferenceSection[] = [];
  const pythonExamples: PythonExample[] = [];
  const glossary: GlossaryItem[] = [];
  const groups: SubjectGroup[] = [];

  let currentGroupTitle = 'Nhập môn & Nền tảng';
  let currentGroupConcepts: string[] = [];

  let readingPathA: string[] = [];
  let readingPathB: string[] = [];
  let readingPathC: string[] = [];

  let introLines: string[] = [];

  // Scanning state
  let mode: 'intro' | 'concepts' | 'exercises' | 'reference' | 'python' | 'glossary' = 'intro';
  let currentConcept: Partial<Concept> | null = null;
  let currentConceptLines: string[] = [];
  let currentConceptStartLine = 0;
  let currentConceptHeading = '';

  let currentExercise: Partial<Exercise> | null = null;
  let currentExerciseLines: string[] = [];

  let currentRefTitle = '';
  let currentRefLines: string[] = [];

  let currentPyTitle = '';
  let currentPyLines: string[] = [];

  const flushConcept = (endLine: number) => {
    if (currentConcept && currentConcept.id) {
      const bodyMarkdown = currentConceptLines.join('\n').trim();
      const blocks = parseConceptBlocks(currentConceptLines);
      const meta = CONCEPT_METADATA[currentConcept.id] || {};
      
      // Match simulations
      const simIds = SIMULATIONS_META
        .filter(s => s.conceptIds.includes(currentConcept!.id!))
        .map(s => s.id);

      const fullConcept: Concept = {
        id: currentConcept.id!,
        subjectId,
        priority: currentConcept.priority || 'A',
        title: currentConcept.title || '',
        groupTitle: currentGroupTitle,
        order: parseInt(currentConcept.id!.replace(/\D/g, ''), 10),
        bodyMarkdown,
        blocks,
        relatedIds: meta.relatedIds || [],
        prerequisiteIds: meta.prerequisiteIds || [],
        simulationIds: simIds,
        source: {
          file: `Chuyen-de/${fileName}`,
          heading: currentConceptHeading,
          startLine: currentConceptStartLine,
          endLine,
          hash: computeHash(bodyMarkdown)
        },
        collectionId: 'foundations'
      };

      concepts.push(fullConcept);
      currentGroupConcepts.push(fullConcept.id);

      currentConcept = null;
      currentConceptLines = [];
    }
  };

  const flushExercise = () => {
    if (currentExercise && currentExercise.title) {
      const allLines = currentExerciseLines.join('\n').trim();
      const parts = allLines.split(/\*\*Lời giải:\*\*/i);
      const questionMarkdown = parts[0] ? parts[0].trim() : '';
      const solutionMarkdown = parts[1] ? parts[1].trim() : '';

      exercises.push({
        id: `${subjectId}-ex-${exercises.length + 1}`,
        subjectId,
        collectionId: 'foundations',
        number: exercises.length + 1,
        title: currentExercise.title,
        questionMarkdown,
        solutionMarkdown
      });
      currentExercise = null;
      currentExerciseLines = [];
    }
  };

  const flushRef = () => {
    if (currentRefTitle && currentRefLines.length > 0) {
      referenceSections.push({
        title: currentRefTitle,
        contentMarkdown: currentRefLines.join('\n').trim()
      });
      currentRefTitle = '';
      currentRefLines = [];
    }
  };

  const flushPy = () => {
    if (currentPyTitle && currentPyLines.length > 0) {
      const fullText = currentPyLines.join('\n').trim();
      const codeMatch = fullText.match(/```python\s*([\s\S]*?)```/);
      const code = codeMatch ? codeMatch[1].trim() : '';
      const description = fullText.replace(/```python[\s\S]*?```/, '').trim();

      pythonExamples.push({
        title: currentPyTitle,
        code,
        description
      });
      currentPyTitle = '';
      currentPyLines = [];
    }
  };

  const flushGroup = () => {
    if (currentGroupConcepts.length > 0) {
      groups.push({
        id: `${subjectId}-group-${groups.length + 1}`,
        title: currentGroupTitle,
        conceptIds: [...currentGroupConcepts]
      });
      currentGroupConcepts = [];
    }
  };

  const questionRegex = new RegExp(`^(?:#{2,3})\\s+(${prefix}\\d{2})\\s+\\[([ABC])\\]\\s+(.*)$`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Detect major section shifts outside questions
    if (/^##\s+(?:Năm bài tự kiểm tra|VI\.\s*Năm tình huống|V\.\s*Năm bài tự kiểm tra)/i.test(line)) {
      if (currentConcept) flushConcept(lineNum - 1);
      flushGroup();
      mode = 'exercises';
      continue;
    }

    if (/^##\s+(?:Bảng công thức|VII\.\s*Bảng lựa chọn|VI\.\s*Sơ đồ quy trình|Bảng độ phức tạp)/i.test(line)) {
      if (currentConcept) flushConcept(lineNum - 1);
      if (mode === 'exercises') flushExercise();
      flushRef();
      mode = 'reference';
      currentRefTitle = line.replace(/^##\s+/, '').trim();
      continue;
    }

    if (/^##\s+(?:Hai ví dụ Python)/i.test(line)) {
      if (currentConcept) flushConcept(lineNum - 1);
      flushGroup();
      mode = 'python';
      continue;
    }

    if (/^##\s+(?:Từ điển Anh–Việt|VIII\.\s*Từ điển|VII\.\s*Từ điển)/i.test(line)) {
      if (currentConcept) flushConcept(lineNum - 1);
      if (mode === 'exercises') flushExercise();
      if (mode === 'reference') flushRef();
      if (mode === 'python') flushPy();
      mode = 'glossary';
      continue;
    }

    // Check if new group heading (e.g. ## Cụm 1... or ## I. ...)
    if (/^##\s+(?:Cụm\s+\d+|[IVXLCDM]+\.\s+[^\n]+)/.test(line) && mode !== 'reference' && mode !== 'glossary') {
      if (currentConcept) flushConcept(lineNum - 1);
      flushGroup();
      currentGroupTitle = line.replace(/^##\s+/, '').trim();
      mode = 'concepts';
      continue;
    }

    // Check if question heading
    const qMatch = line.match(questionRegex);
    if (qMatch) {
      if (currentConcept) {
        flushConcept(lineNum - 1);
      }
      mode = 'concepts';
      currentConceptStartLine = lineNum;
      currentConceptHeading = line;
      currentConcept = {
        id: qMatch[1],
        priority: qMatch[2] as Priority,
        title: qMatch[3].trim()
      };
      continue;
    }

    // In 'intro' mode
    if (mode === 'intro') {
      introLines.push(line);
      // Check for reading paths
      if (line.includes('Đường đọc') || line.includes('Đường đọc tối nay')) {
        const matchesA = line.match(new RegExp(`${prefix}\\d{2}`, 'g'));
        if (matchesA && readingPathA.length === 0) {
          readingPathA = matchesA;
        }
      }
      if (line.includes('B (') || line.includes('B:')) {
        const matchesB = line.match(new RegExp(`${prefix}\\d{2}`, 'g'));
        if (matchesB) readingPathB = matchesB;
      }
      if (line.includes('C (') || line.includes('C:')) {
        const matchesC = line.match(new RegExp(`${prefix}\\d{2}`, 'g'));
        if (matchesC) readingPathC = matchesC;
      }
      continue;
    }

    // In 'concepts' mode
    if (mode === 'concepts') {
      if (currentConcept) {
        currentConceptLines.push(line);
      }
      continue;
    }

    // In 'exercises' mode
    if (mode === 'exercises') {
      if (/^###\s+(?:Bài|Tình huống)\s+\d+/.test(line)) {
        flushExercise();
        currentExercise = {
          title: line.replace(/^###\s+/, '').trim()
        };
      } else if (currentExercise) {
        currentExerciseLines.push(line);
      }
      continue;
    }

    // In 'reference' mode
    if (mode === 'reference') {
      if (/^###\s+/.test(line)) {
        flushRef();
        currentRefTitle = line.replace(/^###\s+/, '').trim();
      } else {
        currentRefLines.push(line);
      }
      continue;
    }

    // In 'python' mode
    if (mode === 'python') {
      if (/^###\s+/.test(line)) {
        flushPy();
        currentPyTitle = line.replace(/^###\s+/, '').trim();
      } else {
        currentPyLines.push(line);
      }
      continue;
    }

    // In 'glossary' mode
    if (mode === 'glossary') {
      // Parse markdown table rows: | term | meaning |
      const tableRowMatch = line.match(/^\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|$/);
      if (tableRowMatch) {
        const term = tableRowMatch[1].trim();
        const meaning = tableRowMatch[2].trim();
        if (term && meaning && !term.includes('---') && !term.toLowerCase().includes('tiếng anh')) {
          glossary.push({ term, meaning });
        }
      }
      continue;
    }
  }

  // Final flushes
  if (currentConcept) flushConcept(lines.length);
  flushGroup();
  flushExercise();
  flushRef();
  flushPy();

  // If GT reading paths weren't found in intro, populate them from concepts
  if (readingPathA.length === 0) {
    readingPathA = concepts.filter(c => c.priority === 'A').map(c => c.id);
  }
  if (readingPathB.length === 0) {
    readingPathB = concepts.filter(c => c.priority === 'B').map(c => c.id);
  }
  if (readingPathC.length === 0) {
    readingPathC = concepts.filter(c => c.priority === 'C').map(c => c.id);
  }

  // If GT, set the explicit 6 thematic groups according to the concept map table
  if (subjectId === 'gt') {
    groups.length = 0; // Clear any default group
    groups.push(
      { id: 'gt-group-1', title: 'Đánh giá lời giải (GT01–GT05)', conceptIds: ['GT01', 'GT02', 'GT03', 'GT04', 'GT05'] },
      { id: 'gt-group-2', title: 'Cấu trúc dữ liệu (GT06–GT11)', conceptIds: ['GT06', 'GT07', 'GT08', 'GT09', 'GT10', 'GT11'] },
      { id: 'gt-group-3', title: 'Tìm kiếm và sắp xếp (GT12–GT18)', conceptIds: ['GT12', 'GT13', 'GT14', 'GT15', 'GT16', 'GT17', 'GT18'] },
      { id: 'gt-group-4', title: 'Đệ quy và cây (GT19–GT23)', conceptIds: ['GT19', 'GT20', 'GT21', 'GT22', 'GT23'] },
      { id: 'gt-group-5', title: 'Đồ thị (GT24–GT28)', conceptIds: ['GT24', 'GT25', 'GT26', 'GT27', 'GT28'] },
      { id: 'gt-group-6', title: 'Kỹ thuật giải bài (GT29–GT35)', conceptIds: ['GT29', 'GT30', 'GT31', 'GT32', 'GT33', 'GT34', 'GT35'] }
    );
    // Assign group titles to concepts
    for (const c of concepts) {
      const g = groups.find(group => group.conceptIds.includes(c.id));
      if (g) c.groupTitle = g.title;
    }
  }

  const sInfo = SUBJECT_INFO[subjectId];
  const subject: Subject = {
    id: subjectId,
    name: sInfo.name,
    shortName: sInfo.shortName,
    description: sInfo.description,
    color: sInfo.color,
    accentColor: sInfo.accentColor,
    order: sInfo.order,
    readingPathA,
    readingPathB,
    readingPathC,
    groups,
    exercises,
    referenceSections,
    pythonExamples,
    glossary,
    introMarkdown: introLines.join('\n').trim()
  };

  return { subject, concepts };
}

// ============================================================
// 3. Parse Exams (05-Bon-de-van-dap-tong-hop.md)
// ============================================================
function parseExams(): Exam[] {
  const filePath = path.join(CHUYEN_DE_DIR, '05-Bon-de-van-dap-tong-hop.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const exams: Exam[] = [];
  let currentExam: Partial<Exam> | null = null;
  let currentExamQuestions: string[] = [];
  let currentExamHints: string[] = [];
  let currentMode: 'questions' | 'hints' | 'reviewSheet' = 'questions';
  let reviewSheetLines: string[] = [];

  const flushExam = () => {
    if (currentExam && currentExam.number) {
      const qList: ExamQuestion[] = [];
      const count = Math.max(currentExamQuestions.length, currentExamHints.length);
      for (let i = 0; i < count; i++) {
        const qId = `exam-${currentExam.number}-q${i + 1}`;
        qList.push({
          id: qId,
          number: i + 1,
          question: currentExamQuestions[i] || '',
          hint: currentExamHints[i] || '',
          relatedConceptIds: EXAM_RELATED_CONCEPTS[qId] || []
        });
      }

      exams.push({
        id: `exam-${currentExam.number}`,
        number: currentExam.number,
        title: currentExam.title || `Đề ${currentExam.number}`,
        subtitle: currentExam.subtitle || '',
        questions: qList
      });

      currentExam = null;
      currentExamQuestions = [];
      currentExamHints = [];
      currentMode = 'questions';
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^##\s+Đề\s+(\d+)\s*—\s*(.*)$/.test(line)) {
      flushExam();
      const m = line.match(/^##\s+Đề\s+(\d+)\s*—\s*(.*)$/);
      if (m) {
        currentExam = {
          number: parseInt(m[1], 10),
          title: `Đề ${m[1]}`,
          subtitle: m[2].trim()
        };
      }
      currentMode = 'questions';
      continue;
    }

    if (/^###\s+Gợi ý sau khi trả lời/.test(line)) {
      currentMode = 'hints';
      continue;
    }

    if (/^##\s+Phiếu sửa lỗi sau mỗi đề/.test(line)) {
      flushExam();
      currentMode = 'reviewSheet';
      continue;
    }

    if (currentMode === 'reviewSheet') {
      reviewSheetLines.push(line);
      continue;
    }

    if (currentMode === 'questions' && currentExam) {
      const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        currentExamQuestions.push(numMatch[2].trim());
      }
    } else if (currentMode === 'hints' && currentExam) {
      const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        currentExamHints.push(numMatch[2].trim());
      }
    }
  }

  flushExam();

  const reviewSheetMarkdown = reviewSheetLines.join('\n').trim();
  for (const ex of exams) {
    ex.reviewSheetMarkdown = reviewSheetMarkdown;
  }

  return exams;
}

// ============================================================
// 4. Parse DPL302m Chapter Files
// ============================================================

interface DplChapterConfig {
  chapterId: string;
  title: string;
  file: string;
  idPrefix: string;
  expectedQuestionCount: number;
  coreCount: number;
  furtherCount: number;
  questionIds: string[];
  sourceLessons: string[];
  sha256: string;
}

// Parse source references from "**Nguồn:**" line
function parseSourceRef(line: string, chapterId: string): SourceReference[] {
  // e.g. "**Nguồn:** `1.2 Basic Neural Network.txt`, slide 4–10."
  const refs: SourceReference[] = [];
  const srcMatch = line.match(/`([^`]+)`/g);
  if (srcMatch) {
    for (const m of srcMatch) {
      const file = m.replace(/`/g, '').trim();
      // Extract lesson ID from filename (e.g. "1.2" from "1.2 Basic Neural Network.txt")
      const lessonMatch = file.match(/^(\d+\.\d+)/);
      const lessonId = lessonMatch ? lessonMatch[1] : '';
      const slideMatch = line.match(/slide\s+([\d–\-,]+)/i);
      refs.push({
        lessonId,
        file,
        slideMarkers: slideMatch ? slideMatch[1] : undefined,
        infoType: 'confirmed'
      });
    }
  }
  return refs;
}

// Determine studyLevel from heading tag: [Cốt lõi] or [Đọc tiếp]
function parseStudyLevel(headingTag: string): StudyLevel {
  const lower = headingTag.toLowerCase();
  if (lower.includes('cốt lõi') || lower.includes('cot loi')) return 'core';
  if (lower.includes('đọc tiếp') || lower.includes('doc tiep')) return 'further';
  return 'core'; // default
}

// Parse lesson IDs from source references for a concept
function extractLessonIds(sourceRefs: SourceReference[]): string[] {
  const ids = new Set<string>();
  for (const ref of sourceRefs) {
    if (ref.lessonId) ids.add(ref.lessonId);
  }
  return Array.from(ids);
}

function parseDplChapterFile(cfg: DplChapterConfig): { concepts: Concept[]; chapter: DplChapter } {
  const filePath = path.join(DPL302M_DIR, cfg.file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const concepts: Concept[] = [];
  const exercises: Exercise[] = [];
  const referenceSections: ReferenceSection[] = [];
  const glossary: GlossaryItem[] = [];

  let introLines: string[] = [];

  // Mode tracking
  type DplMode = 'intro' | 'concept' | 'exercises' | 'reference' | 'glossary';
  let mode: DplMode = 'intro';

  let currentConcept: Partial<Concept> | null = null;
  let currentConceptLines: string[] = [];
  let currentConceptStartLine = 0;
  let currentConceptHeading = '';
  let currentStudyLevel: StudyLevel = 'core';
  let currentSourceRefs: SourceReference[] = [];

  let currentExercise: Partial<Exercise> | null = null;
  let currentExerciseLines: string[] = [];

  let currentRefTitle = '';
  let currentRefLines: string[] = [];

  let exerciseCounter = 0;
  // For ordered-list exercises (like Chapter 1's numbered list)
  let inOrderedListExercise = false;
  let orderedListBuffer: string[] = [];
  let inOrderedListSection = false;

  const flushConcept = (endLine: number) => {
    if (currentConcept && currentConcept.id) {
      const bodyMarkdown = currentConceptLines.join('\n').trim();
      const blocks = parseConceptBlocks(currentConceptLines);

      // Match simulations - DPL concepts may link to existing simulations
      const simIds = SIMULATIONS_META
        .filter(s => s.conceptIds.includes(currentConcept!.id!))
        .map(s => s.id);

      // Extract order from ID suffix (e.g. DPL1-07 -> 7)
      const orderMatch = currentConcept.id!.match(/-(\d+)$/);
      const order = orderMatch ? parseInt(orderMatch[1], 10) : 0;

      const fullConcept: Concept = {
        id: currentConcept.id!,
        subjectId: 'dl', // DPL concepts belong to dl subject
        priority: 'A',   // Foundations mapping: use 'A' as neutral placeholder; 
                         // actual level is in studyLevel
        title: currentConcept.title || '',
        groupTitle: cfg.title,
        order,
        bodyMarkdown,
        blocks,
        relatedIds: [],
        prerequisiteIds: [],
        simulationIds: simIds,
        source: {
          file: `DPL302m/${cfg.file}`,
          heading: currentConceptHeading,
          startLine: currentConceptStartLine,
          endLine,
          hash: computeHash(bodyMarkdown)
        },
        collectionId: 'dpl302m',
        chapterId: cfg.chapterId,
        chapterTitle: cfg.title,
        lessonIds: extractLessonIds(currentSourceRefs),
        studyLevel: currentStudyLevel,
        sourceReferences: currentSourceRefs
      };

      concepts.push(fullConcept);

      currentConcept = null;
      currentConceptLines = [];
      currentSourceRefs = [];
    }
  };

  const flushExercise = () => {
    if (currentExercise && currentExercise.title && currentExerciseLines.length > 0) {
      const allLines = currentExerciseLines.join('\n').trim();
      // Split on "Lời giải:" or similar solution marker
      const solutionPattern = /\*\*Lời giải[^*]*:\*\*/i;
      const parts = allLines.split(solutionPattern);
      const questionMarkdown = parts[0] ? parts[0].trim() : '';
      const solutionMarkdown = parts[1] ? parts[1].trim() : '';

      exerciseCounter++;
      exercises.push({
        id: `${cfg.chapterId}-ex-${exerciseCounter}`,
        collectionId: 'dpl302m',
        chapterId: cfg.chapterId,
        number: exerciseCounter,
        title: currentExercise.title,
        questionMarkdown,
        solutionMarkdown
      });
      currentExercise = null;
      currentExerciseLines = [];
    }
  };

  const flushRef = () => {
    if (currentRefTitle && currentRefLines.length > 0) {
      referenceSections.push({
        title: currentRefTitle,
        contentMarkdown: currentRefLines.join('\n').trim()
      });
      currentRefTitle = '';
      currentRefLines = [];
    }
  };

  // Regex for DPL concept headings: ## DPL1-01 [Cốt lõi] Title
  // or ## DPL1-10 [Đọc tiếp] Title
  const dplHeadingRegex = /^#{2,3}\s+(DPL\d+-\d+)\s+\[(Cốt lõi|Đọc tiếp)\]\s+(.*)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Detect major section transitions
    // Chapter exercises - could be ordered list (chapter 1) or ### Bài headings
    // Matches: "Bốn bài tự kiểm tra", "Ba bài tự kiểm tra có lời giải", "Bài tự kiểm tra", etc.
    if (/^##\s+(?:(?:Bốn|Ba|Hai|Năm|Sáu|\d+)\s+bài\s+tự\s+kiểm\s+tra|Bài\s+tự\s+kiểm\s+tra|Các\s+bài\s+tự\s+kiểm\s+tra|Tự\s+kiểm\s+tra)/i.test(line)) {
      if (currentConcept) flushConcept(lineNum - 1);
      mode = 'exercises';
      inOrderedListSection = true;
      // Start collecting ordered list exercises
      orderedListBuffer = [line];
      continue;
    }

    // Chapter exercises section with ### Bài X heading pattern
    if (mode === 'exercises' && /^###\s+Bài\s+\d+/.test(line)) {
      flushExercise();
      currentExercise = {
        title: line.replace(/^###\s+/, '').trim()
      };
      inOrderedListSection = false;
      continue;
    }

    // Glossary / Từ khóa section
    if (/^##\s+(?:Từ khóa|Từ điển|Bảng từ)/i.test(line)) {
      if (currentConcept) flushConcept(lineNum - 1);
      if (mode === 'exercises') flushExercise();
      flushRef();
      mode = 'glossary';
      continue;
    }

    // Reference sections (formulas, tables, appendices after last concept)
    if (/^##\s+(?:Bảng|Công thức|Phụ lục|Tài liệu)/i.test(line) && mode !== 'glossary') {
      if (currentConcept) flushConcept(lineNum - 1);
      if (mode === 'exercises') flushExercise();
      flushRef();
      mode = 'reference';
      currentRefTitle = line.replace(/^##\s+/, '').trim();
      continue;
    }

    // New DPL concept heading
    const dplMatch = line.match(dplHeadingRegex);
    if (dplMatch) {
      if (currentConcept) flushConcept(lineNum - 1);
      if (mode === 'exercises') flushExercise();
      
      mode = 'concept';
      inOrderedListSection = false;
      currentConceptStartLine = lineNum;
      currentConceptHeading = line;
      currentStudyLevel = parseStudyLevel(dplMatch[2]);
      currentSourceRefs = [];
      currentConcept = {
        id: dplMatch[1],
        title: dplMatch[3].trim()
      };
      continue;
    }

    // Track source refs in concept body
    if (mode === 'concept' && currentConcept) {
      // Parse source reference from "**Nguồn:**" lines
      if (line.startsWith('**Nguồn:**') || line.startsWith('**Nguồn**: ')) {
        const refs = parseSourceRef(line, cfg.chapterId);
        currentSourceRefs.push(...refs);
      }
      currentConceptLines.push(line);
      continue;
    }

    // Intro mode
    if (mode === 'intro') {
      introLines.push(line);
      continue;
    }

    // Exercises mode - ordered list items (Chapter 1 style)
    if (mode === 'exercises') {
      if (inOrderedListSection) {
        orderedListBuffer.push(line);
        
        // Detect ordered list items: "1. **Title:**" or "1. **Heading**"
        const orderedMatch = line.match(/^(\d+)\.\s+\*\*([^*]+)\*\*/);
        if (orderedMatch) {
          flushExercise();
          const num = parseInt(orderedMatch[1], 10);
          currentExercise = {
            title: `Bài ${num}: ${orderedMatch[2].trim()}`
          };
          currentExerciseLines = [line];
          inOrderedListExercise = true;
        } else if (inOrderedListExercise && currentExercise) {
          currentExerciseLines.push(line);
        }
      } else if (currentExercise) {
        currentExerciseLines.push(line);
      }
      continue;
    }

    // Reference mode
    if (mode === 'reference') {
      if (/^###\s+/.test(line)) {
        flushRef();
        currentRefTitle = line.replace(/^###\s+/, '').trim();
      } else {
        currentRefLines.push(line);
      }
      continue;
    }

    // Glossary mode - parse table and inline items
    if (mode === 'glossary') {
      // Markdown table row: | term | meaning |
      const tableRowMatch = line.match(/^\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|$/);
      if (tableRowMatch) {
        const term = tableRowMatch[1].trim();
        const meaning = tableRowMatch[2].trim();
        if (term && meaning && !term.includes('---') && !term.toLowerCase().includes('thuật ngữ')) {
          glossary.push({ term, meaning });
        }
      }
      continue;
    }
  }

  // Final flushes
  if (currentConcept) flushConcept(lines.length);
  if (mode === 'exercises') flushExercise();
  flushRef();

  // Handle Chapter 1's ordered list exercises if not yet parsed as ### Bài format
  // The intro text mentions "Bốn bài tự kiểm tra" as a numbered list
  // If exercises are in orderedListBuffer, parse them
  if (exercises.length === 0 && orderedListBuffer.length > 0) {
    // Parse ordered list: items starting with "1. **...**" 
    const orderedText = orderedListBuffer.join('\n');
    const itemPattern = /(\d+)\.\s+\*\*([^:]+):\*\*\s*([\s\S]*?)(?=\n\d+\.\s+\*\*|\n##|$)/g;
    let match;
    while ((match = itemPattern.exec(orderedText)) !== null) {
      const num = parseInt(match[1], 10);
      const title = match[2].trim();
      const body = match[3].trim();
      exerciseCounter++;
      exercises.push({
        id: `${cfg.chapterId}-ex-${exerciseCounter}`,
        collectionId: 'dpl302m',
        chapterId: cfg.chapterId,
        number: exerciseCounter,
        title: `Bài ${num}: ${title}`,
        questionMarkdown: body,
        solutionMarkdown: ''
      });
    }
  }

  const chapter: DplChapter = {
    chapterId: cfg.chapterId,
    title: cfg.title,
    file: cfg.file,
    idPrefix: cfg.idPrefix,
    coreCount: cfg.coreCount,
    furtherCount: cfg.furtherCount,
    totalCount: cfg.expectedQuestionCount,
    conceptIds: concepts.map(c => c.id),
    sourceLessons: cfg.sourceLessons,
    introMarkdown: introLines.join('\n').trim(),
    exercises,
    referenceSections,
    glossary
  };

  return { concepts, chapter };
}

// ============================================================
// 5. Main import runner
// ============================================================
function run() {
  console.log('🚀 Bắt đầu import nội dung chuyên đề và DPL302m...');

  // --- Guide ---
  const guide = parseGuide();
  console.log('✅ Đã phân tích bản đồ kiến thức và hướng dẫn.');

  // --- Foundation Subjects ---
  const subjectConfigs: { id: SubjectId; file: string; prefix: string }[] = [
    { id: 'xs', file: '01-Xac-suat-thong-ke.md', prefix: 'XS' },
    { id: 'ml', file: '02-Machine-Learning.md', prefix: 'ML' },
    { id: 'dl', file: '03-Deep-Learning.md', prefix: 'DL' },
    { id: 'gt', file: '04-Giai-thuat.md', prefix: 'GT' }
  ];

  const subjects: Subject[] = [];
  let foundationConcepts: Concept[] = [];

  for (const cfg of subjectConfigs) {
    const res = parseSubjectFile(cfg.id, cfg.file, cfg.prefix);
    subjects.push(res.subject);
    foundationConcepts = foundationConcepts.concat(res.concepts);
    console.log(`✅ [${cfg.id.toUpperCase()}] ${res.concepts.length} câu, ${res.subject.groups.length} cụm, ${res.subject.exercises.length} bài tập, ${res.subject.glossary.length} thuật ngữ.`);
  }

  // --- DPL302m Chapters ---
  // Load manifest
  const manifestPath = path.join(DPL302M_DIR, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  const dplChapterConfigs: DplChapterConfig[] = manifest.chapters;

  const dplChapters: DplChapter[] = [];
  let dplConcepts: Concept[] = [];

  for (const cfg of dplChapterConfigs) {
    const { concepts: chapConcepts, chapter } = parseDplChapterFile(cfg);
    dplConcepts = dplConcepts.concat(chapConcepts);
    dplChapters.push(chapter);
    console.log(`✅ [DPL-${cfg.chapterId.toUpperCase()}] ${chapConcepts.length} câu (core: ${chapConcepts.filter(c => c.studyLevel === 'core').length}, further: ${chapConcepts.filter(c => c.studyLevel === 'further').length}), ${chapter.exercises.length} bài tập.`);
  }

  // --- Exams ---
  const exams = parseExams();
  console.log(`✅ Đã phân tích ${exams.length} đề tổng hợp với tổng cộng ${exams.reduce((acc, e) => acc + e.questions.length, 0)} câu.`);

  // --- All Concepts ---
  const allConcepts = [...foundationConcepts, ...dplConcepts];

  // ============================================================
  // Validation
  // ============================================================
  const validationErrors: string[] = [];

  // Foundation: 140 concepts
  if (foundationConcepts.length !== 140) {
    validationErrors.push(`Bộ foundations phải có 140 câu, thực tế: ${foundationConcepts.length}`);
  }

  const foundationIds = new Set(foundationConcepts.map(c => c.id));
  if (foundationIds.size !== foundationConcepts.length) {
    validationErrors.push(`Bộ foundations có ID trùng! Unique: ${foundationIds.size}/${foundationConcepts.length}`);
  }

  // Foundation per-subject check (18A/12B/5C)
  const conceptsBySubject: ContentInventory['conceptsBySubject'] = {
    xs: { total: 0, A: 0, B: 0, C: 0 },
    ml: { total: 0, A: 0, B: 0, C: 0 },
    dl: { total: 0, A: 0, B: 0, C: 0 },
    gt: { total: 0, A: 0, B: 0, C: 0 }
  };

  for (const c of foundationConcepts) {
    const s = conceptsBySubject[c.subjectId];
    s.total++;
    s[c.priority]++;
  }

  for (const [sId, counts] of Object.entries(conceptsBySubject)) {
    if (counts.total !== 35) {
      validationErrors.push(`Mảng ${sId} có ${counts.total} câu thay vì 35`);
    }
    if (counts.A !== 18 || counts.B !== 12 || counts.C !== 5) {
      validationErrors.push(`Mảng ${sId} phân bổ mức không đúng 18A/12B/5C: ${counts.A}A, ${counts.B}B, ${counts.C}C`);
    }
  }

  // DPL302m: 72 concepts
  if (dplConcepts.length !== 72) {
    validationErrors.push(`Bộ DPL302m phải có 72 câu, thực tế: ${dplConcepts.length}`);
  }

  // DPL per-chapter check
  const dpl302mByChapter: ContentInventory['dpl302mByChapter'] = {};
  for (const cfg of dplChapterConfigs) {
    const chapConcepts = dplConcepts.filter(c => c.chapterId === cfg.chapterId);
    dpl302mByChapter[cfg.chapterId] = {
      total: chapConcepts.length,
      core: chapConcepts.filter(c => c.studyLevel === 'core').length,
      further: chapConcepts.filter(c => c.studyLevel === 'further').length
    };
    if (chapConcepts.length !== cfg.expectedQuestionCount) {
      validationErrors.push(`Chương ${cfg.chapterId} phải có ${cfg.expectedQuestionCount} câu, thực tế: ${chapConcepts.length}`);
    }
    // Validate all expected IDs are present
    for (const expectedId of cfg.questionIds) {
      if (!dplConcepts.find(c => c.id === expectedId)) {
        validationErrors.push(`Thiếu ID ${expectedId} trong chương ${cfg.chapterId}`);
      }
    }
  }

  // Total: 212 concepts
  if (allConcepts.length !== 212) {
    validationErrors.push(`Tổng số câu phải là 212, thực tế: ${allConcepts.length}`);
  }

  // No duplicate IDs across all
  const allIds = new Set(allConcepts.map(c => c.id));
  if (allIds.size !== allConcepts.length) {
    validationErrors.push(`Có ID trùng trong toàn thư viện! Unique: ${allIds.size}/${allConcepts.length}`);
  }

  // Check 20 foundation exercises
  const totalFoundationExercises = subjects.reduce((sum, s) => sum + s.exercises.length, 0);
  if (totalFoundationExercises !== 20) {
    validationErrors.push(`Tổng số bài tự kiểm tra foundations phải là 20, thực tế: ${totalFoundationExercises}`);
  }

  // Check 19 DPL exercises
  const totalDplExercises = dplChapters.reduce((sum, ch) => sum + ch.exercises.length, 0);
  if (totalDplExercises !== 19) {
    validationErrors.push(`Tổng số bài tự kiểm tra DPL302m phải là 19, thực tế: ${totalDplExercises}`);
  }

  // Check 4 exams with 7 questions each
  if (exams.length !== 4) {
    validationErrors.push(`Số đề thi phải là 4, thực tế: ${exams.length}`);
  }
  for (const e of exams) {
    if (e.questions.length !== 7) {
      validationErrors.push(`Đề ${e.number} phải có đúng 7 câu, thực tế: ${e.questions.length}`);
    }
  }

  // Check link validity for foundation concepts (relatedIds, prerequisiteIds)
  for (const c of foundationConcepts) {
    for (const rId of c.relatedIds) {
      if (!allIds.has(rId)) {
        validationErrors.push(`Concept ${c.id} tham chiếu relatedId không tồn tại: ${rId}`);
      }
    }
    for (const pId of c.prerequisiteIds) {
      if (!allIds.has(pId)) {
        validationErrors.push(`Concept ${c.id} tham chiếu prerequisiteId không tồn tại: ${pId}`);
      }
    }
  }

  const inventory: ContentInventory = {
    generatedAt: new Date().toISOString(),
    totalConcepts: allConcepts.length,
    foundationsConcepts: foundationConcepts.length,
    dpl302mConcepts: dplConcepts.length,
    conceptsBySubject,
    dpl302mByChapter,
    totalExercises: totalFoundationExercises + totalDplExercises,
    foundationsExercises: totalFoundationExercises,
    dpl302mExercises: totalDplExercises,
    totalExams: exams.length,
    totalExamQuestions: exams.reduce((acc, e) => acc + e.questions.length, 0),
    totalGlossaryItems: subjects.reduce((sum, s) => sum + s.glossary.length, 0)
      + dplChapters.reduce((sum, ch) => sum + ch.glossary.length, 0),
    simulationCount: SIMULATIONS_META.length,
    validationStatus: validationErrors.length === 0 ? 'pass' : 'fail',
    validationErrors
  };

  if (validationErrors.length > 0) {
    console.error('❌ VALIDATION FAILED!');
    for (const err of validationErrors) {
      console.error(`  - ${err}`);
    }
    // Don't exit - write data anyway so we can debug
    console.warn('⚠️  Tiếp tục ghi dữ liệu dù có lỗi validation để debug...');
  } else {
    console.log('🎉 VALIDATION PASSED! Mọi tiêu chí nội dung đạt chuẩn.');
  }

  // Write outputs
  fs.writeFileSync(path.join(OUT_DIR, 'guide.json'), JSON.stringify(guide, null, 2), 'utf-8');
  fs.writeFileSync(path.join(OUT_DIR, 'subjects.json'), JSON.stringify(subjects, null, 2), 'utf-8');
  fs.writeFileSync(path.join(OUT_DIR, 'concepts.json'), JSON.stringify(allConcepts, null, 2), 'utf-8');
  fs.writeFileSync(path.join(OUT_DIR, 'exams.json'), JSON.stringify(exams, null, 2), 'utf-8');
  fs.writeFileSync(path.join(OUT_DIR, 'inventory.json'), JSON.stringify(inventory, null, 2), 'utf-8');
  fs.writeFileSync(path.join(OUT_DIR, 'dpl-chapters.json'), JSON.stringify(dplChapters, null, 2), 'utf-8');

  // Write index.ts for convenient typed imports
  const indexTs = `// Auto-generated by scripts/import-content.ts. Do not edit directly.
import guideData from './guide.json';
import subjectsData from './subjects.json';
import conceptsData from './concepts.json';
import examsData from './exams.json';
import inventoryData from './inventory.json';
import dplChaptersData from './dpl-chapters.json';
import type { GuideData, Subject, Concept, Exam, ContentInventory, DplChapter } from '../types';

export const guide: GuideData = guideData as unknown as GuideData;
export const subjects: Subject[] = subjectsData as unknown as Subject[];
export const concepts: Concept[] = conceptsData as unknown as Concept[];
export const exams: Exam[] = examsData as unknown as Exam[];
export const inventory: ContentInventory = inventoryData as unknown as ContentInventory;
export const dplChapters: DplChapter[] = dplChaptersData as unknown as DplChapter[];

export const conceptMap = new Map<string, Concept>(concepts.map(c => [c.id, c]));
export const subjectMap = new Map<string, Subject>(subjects.map(s => [s.id, s]));
export const examMap = new Map<string, Exam>(exams.map(e => [e.id, e]));
export const dplChapterMap = new Map<string, DplChapter>(dplChapters.map(ch => [ch.chapterId, ch]));

// Helper: all DPL302m concepts
export const dplConcepts: Concept[] = concepts.filter(c => c.collectionId === 'dpl302m');
// Helper: all foundation concepts
export const foundationConcepts: Concept[] = concepts.filter(c => c.collectionId === 'foundations');
`;

  fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), indexTs, 'utf-8');
  console.log(`📁 Dữ liệu generated đã được ghi vào ${OUT_DIR}`);
  console.log(`📊 Tổng kết: ${foundationConcepts.length} foundations + ${dplConcepts.length} DPL302m = ${allConcepts.length} câu`);
  console.log(`📝 Bài tập: ${totalFoundationExercises} foundations + ${totalDplExercises} DPL302m = ${totalFoundationExercises + totalDplExercises} bài`);
}

run();
