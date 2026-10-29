import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  SubjectId,
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
  ContentInventory
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
const OUT_DIR = path.resolve(__dirname, '../src/content/generated');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function computeHash(content: string): string {
  return crypto.createHash('sha256').update(content.trim()).digest('hex').slice(0, 12);
}

// Helper to parse blocks inside a concept
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
    const boldTagMatch = line.match(/^\*\*([^*]+)\:\*\*\s*(.*)$/);
    if (boldTagMatch) {
      flush();
      const rawTag = boldTagMatch[1].trim();
      const rest = boldTagMatch[2].trim();

      const lower = rawTag.toLowerCase();
      if (lower.includes('hiểu') || lower.includes('định nghĩa') || lower.includes('bản chất')) {
        currentType = 'concept';
      } else if (lower.includes('ví dụ')) {
        currentType = 'example';
      } else if (lower.includes('trả lời miệng') || lower.includes('trả lời')) {
        currentType = 'answer';
      } else if (lower.includes('nối tiếp') || lower.includes('hỏi tiếp')) {
        currentType = 'followup';
      } else if (lower.includes('bẫy') || lower.includes('lưu ý')) {
        currentType = 'trap';
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

// 1. Parse 00-Cach-hoc-va-ban-do-kien-thuc.md
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

// 2. Parse Subject Files (01, 02, 03, 04)
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
        }
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

// 3. Parse 05-Bon-de-van-dap-tong-hop.md
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

// 4. Main import runner and validator
function run() {
  console.log('🚀 Bắt đầu import nội dung chuyên đề...');

  const guide = parseGuide();
  console.log('✅ Đã phân tích bản đồ kiến thức và hướng dẫn.');

  const subjectConfigs: { id: SubjectId; file: string; prefix: string }[] = [
    { id: 'xs', file: '01-Xac-suat-thong-ke.md', prefix: 'XS' },
    { id: 'ml', file: '02-Machine-Learning.md', prefix: 'ML' },
    { id: 'dl', file: '03-Deep-Learning.md', prefix: 'DL' },
    { id: 'gt', file: '04-Giai-thuat.md', prefix: 'GT' }
  ];

  const subjects: Subject[] = [];
  let allConcepts: Concept[] = [];

  for (const cfg of subjectConfigs) {
    const res = parseSubjectFile(cfg.id, cfg.file, cfg.prefix);
    subjects.push(res.subject);
    allConcepts = allConcepts.concat(res.concepts);
    console.log(`✅ [${cfg.id.toUpperCase()}] ${res.concepts.length} câu, ${res.subject.groups.length} cụm, ${res.subject.exercises.length} bài tập, ${res.subject.glossary.length} thuật ngữ.`);
  }

  const exams = parseExams();
  console.log(`✅ Đã phân tích ${exams.length} đề tổng hợp với tổng cộng ${exams.reduce((acc, e) => acc + e.questions.length, 0)} câu.`);

  // Validation
  const validationErrors: string[] = [];

  if (allConcepts.length !== 140) {
    validationErrors.push(`Tổng số concept phải là 140, nhưng thực tế là ${allConcepts.length}`);
  }

  const conceptIds = new Set(allConcepts.map(c => c.id));
  if (conceptIds.size !== 140) {
    validationErrors.push(`Có ID concept trùng lặp! Số ID duy nhất: ${conceptIds.size}`);
  }

  // Priority counts per subject
  const conceptsBySubject: ContentInventory['conceptsBySubject'] = {
    xs: { total: 0, A: 0, B: 0, C: 0 },
    ml: { total: 0, A: 0, B: 0, C: 0 },
    dl: { total: 0, A: 0, B: 0, C: 0 },
    gt: { total: 0, A: 0, B: 0, C: 0 }
  };

  for (const c of allConcepts) {
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

  // Check 20 exercises
  const totalExercises = subjects.reduce((sum, s) => sum + s.exercises.length, 0);
  if (totalExercises !== 20) {
    validationErrors.push(`Tổng số bài tự kiểm tra phải là 20, nhưng thực tế là ${totalExercises}`);
  }

  // Check 4 exams and 7 questions each
  if (exams.length !== 4) {
    validationErrors.push(`Số đề thi phải là 4, nhưng thực tế là ${exams.length}`);
  }
  for (const e of exams) {
    if (e.questions.length !== 7) {
      validationErrors.push(`Đề ${e.number} phải có đúng 7 câu, thực tế có ${e.questions.length}`);
    }
  }

  // Check link validity (relatedIds, prerequisiteIds)
  for (const c of allConcepts) {
    for (const rId of c.relatedIds) {
      if (!conceptIds.has(rId)) {
        validationErrors.push(`Concept ${c.id} tham chiếu relatedId không tồn tại: ${rId}`);
      }
    }
    for (const pId of c.prerequisiteIds) {
      if (!conceptIds.has(pId)) {
        validationErrors.push(`Concept ${c.id} tham chiếu prerequisiteId không tồn tại: ${pId}`);
      }
    }
  }

  const inventory: ContentInventory = {
    generatedAt: new Date().toISOString(),
    totalConcepts: allConcepts.length,
    conceptsBySubject,
    totalExercises,
    totalExams: exams.length,
    totalExamQuestions: exams.reduce((acc, e) => acc + e.questions.length, 0),
    totalGlossaryItems: subjects.reduce((sum, s) => sum + s.glossary.length, 0),
    simulationCount: SIMULATIONS_META.length,
    validationStatus: validationErrors.length === 0 ? 'pass' : 'fail',
    validationErrors
  };

  if (validationErrors.length > 0) {
    console.error('❌ VALIDATION FAILED!');
    for (const err of validationErrors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log('🎉 VALIDATION PASSED! Mọi tiêu chí nội dung đạt chuẩn 100%.');

  // Write outputs
  fs.writeFileSync(path.join(OUT_DIR, 'guide.json'), JSON.stringify(guide, null, 2), 'utf-8');
  fs.writeFileSync(path.join(OUT_DIR, 'subjects.json'), JSON.stringify(subjects, null, 2), 'utf-8');
  fs.writeFileSync(path.join(OUT_DIR, 'concepts.json'), JSON.stringify(allConcepts, null, 2), 'utf-8');
  fs.writeFileSync(path.join(OUT_DIR, 'exams.json'), JSON.stringify(exams, null, 2), 'utf-8');
  fs.writeFileSync(path.join(OUT_DIR, 'inventory.json'), JSON.stringify(inventory, null, 2), 'utf-8');

  // Write index.ts for convenient typed imports
  const indexTs = `// Auto-generated by scripts/import-content.ts. Do not edit directly.
import guideData from './guide.json';
import subjectsData from './subjects.json';
import conceptsData from './concepts.json';
import examsData from './exams.json';
import inventoryData from './inventory.json';
import type { GuideData, Subject, Concept, Exam, ContentInventory } from '../types';

export const guide: GuideData = guideData as unknown as GuideData;
export const subjects: Subject[] = subjectsData as unknown as Subject[];
export const concepts: Concept[] = conceptsData as unknown as Concept[];
export const exams: Exam[] = examsData as unknown as Exam[];
export const inventory: ContentInventory = inventoryData as unknown as ContentInventory;

export const conceptMap = new Map<string, Concept>(concepts.map(c => [c.id, c]));
export const subjectMap = new Map<string, Subject>(subjects.map(s => [s.id, s]));
export const examMap = new Map<string, Exam>(exams.map(e => [e.id, e]));
`;

  fs.writeFileSync(path.join(OUT_DIR, 'index.ts'), indexTs, 'utf-8');
  console.log(`📁 Dữ liệu generated đã được ghi vào ${OUT_DIR}`);
}

run();
