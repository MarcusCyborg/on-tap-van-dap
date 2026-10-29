import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  FileEdit,
  Save,
  Check
} from 'lucide-react';
import { concepts, conceptMap, subjects } from '../../content/generated';
import type { Concept, Priority, Understanding } from '../../content/types';
import { SUBJECT_INFO } from '../../content/metadata';
import {
  loadUserData,
  markConceptAsRead,
  setConceptUnderstanding,
  toggleConceptBookmark,
  saveConceptNote
} from '../../lib/storage';
import { SimulationContainer } from '../simulations/SimulationContainer';

export const ConceptReader: React.FC = () => {
  const { conceptId } = useParams<{ conceptId: string }>();
  const navigate = useNavigate();

  const concept = conceptId ? conceptMap.get(conceptId.toUpperCase()) : undefined;

  // Reading Mode: 'read' (đọc hiểu) vs 'practice' (tự trả lời)
  const [readingMode, setReadingMode] = useState<'read' | 'practice'>('read');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [scratchpad, setScratchpad] = useState<string>('');

  // User state
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [understanding, setUnderstanding] = useState<Understanding | undefined>(undefined);
  const [userNote, setUserNote] = useState<string>('');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState<boolean>(false);

  // Load user data & reset reveal state on concept change
  useEffect(() => {
    if (!concept) return;

    // Mark as read
    markConceptAsRead(concept.id);

    const data = loadUserData();
    const p = data.conceptProgress[concept.id];
    setIsBookmarked(p?.bookmarked || false);
    setUnderstanding(p?.understanding);
    setUserNote(p?.note || '');
    setScratchpad('');
    // Always reset answer reveal state when switching concepts
    setIsAnswerRevealed(false);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [conceptId]);

  if (!concept) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-ink">Không tìm thấy khái niệm này</h2>
        <p className="text-sm text-muted">Mã khái niệm &ldquo;{conceptId}&rdquo; không tồn tại trong danh mục 140 câu.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-dark"
        >
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const sInfo = SUBJECT_INFO[concept.subjectId];
  const isDpl = concept.collectionId === 'dpl302m';

  // Find previous and next concepts within the current collection (DPL302m or Foundations)
  // Prevents jumping between DPL sequence and DL01-DL35 due to global array ordering
  const collectionConcepts = isDpl
    ? concepts.filter(c => c.collectionId === 'dpl302m')
    : concepts.filter(c => c.collectionId !== 'dpl302m');

  const currentIndex = collectionConcepts.findIndex(c => c.id === concept.id);
  const prevConcept = currentIndex > 0 ? collectionConcepts[currentIndex - 1] : undefined;
  const nextConcept = currentIndex < collectionConcepts.length - 1 ? collectionConcepts[currentIndex + 1] : undefined;

  const handleToggleBookmark = () => {
    const updated = toggleConceptBookmark(concept.id);
    setIsBookmarked(updated.conceptProgress[concept.id]?.bookmarked || false);
  };

  const handleSetUnderstanding = (level: Understanding) => {
    const newLevel = understanding === level ? 'unknown' : level;
    setConceptUnderstanding(concept.id, newLevel);
    setUnderstanding(newLevel);
  };

  const handleSaveNote = () => {
    saveConceptNote(concept.id, userNote);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2000);
  };

  // Group blocks by semantic type
  const conceptBlocks = concept.blocks.filter(b => b.type === 'concept');
  const exampleBlocks = concept.blocks.filter(b => b.type === 'example');
  const answerBlocks = concept.blocks.filter(b => b.type === 'answer');
  const followupBlocks = concept.blocks.filter(b => b.type === 'followup');
  const trapBlocks = concept.blocks.filter(b => b.type === 'trap');
  const sourceBlocks = concept.blocks.filter(b => b.tag === 'Nguồn' || b.markdown.startsWith('**Nguồn:**'));
  const proseBlocks = concept.blocks.filter(b => b.type === 'prose' && b.tag !== 'Nguồn' && !b.markdown.startsWith('**Nguồn:**'));

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="space-y-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-ink">Trang chủ</Link>
            <span>/</span>
            {isDpl ? (
              <>
                <Link to="/dpl302m" className="hover:text-ink font-semibold text-purple-700">
                  DPL302m
                </Link>
                <span>/</span>
                <Link to={`/dpl302m/${concept.chapterId}`} className="hover:text-ink font-mono font-medium text-ink">
                  {concept.chapterTitle ? concept.chapterTitle.split(/[:\-]/)[0].trim() : concept.groupTitle}
                </Link>
              </>
            ) : (
              <>
                <Link to={`/subjects/${concept.subjectId}`} className="hover:text-ink font-semibold" style={{ color: sInfo.color }}>
                  {sInfo.name}
                </Link>
                <span>/</span>
                <span className="text-ink font-mono">{concept.groupTitle}</span>
              </>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              isBookmarked
                ? 'bg-amber-50 text-warning-ink border-warning-ink/40 shadow-xs'
                : 'bg-surface border-border text-muted hover:text-ink'
            }`}
            title={isBookmarked ? 'Đã lưu để ôn' : 'Lưu câu này vào danh sách cần ôn'}
          >
            {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 fill-current" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isBookmarked ? 'Đã lưu ôn' : 'Lưu để ôn'}</span>
          </button>
        </div>

        {/* Concept Title & Badges */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-extrabold px-2 py-0.5 rounded bg-surface-muted text-ink border border-border">
              {concept.id}
            </span>

            {/* Collection & Priority / StudyLevel Badge */}
            {isDpl ? (
              <>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  DPL302m
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  concept.studyLevel === 'core'
                    ? 'bg-green-100 text-[#27624a] border border-green-200'
                    : 'bg-blue-100 text-[#2b5c8f] border border-blue-200'
                }`}>
                  {concept.studyLevel === 'core' ? 'Cốt lõi' : 'Đọc tiếp'}
                </span>
                <span className="text-xs text-muted">
                  Câu {concept.order} • {concept.chapterTitle || concept.groupTitle}
                </span>
              </>
            ) : (
              <>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  concept.priority === 'A'
                    ? 'bg-green-100 text-[#27624a] border border-green-200'
                    : concept.priority === 'B'
                    ? 'bg-blue-100 text-[#2b5c8f] border border-blue-200'
                    : 'bg-amber-100 text-[#8a4b16] border border-amber-200'
                }`}>
                  {concept.priority === 'A' ? 'Mức A: Nền tảng' : concept.priority === 'B' ? 'Mức B: Mở rộng' : 'Mức C: Nhận diện'}
                </span>
                <span className="text-xs text-muted">
                  Câu {concept.order}/35 chuyên đề {sInfo.shortName}
                </span>
              </>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-ink leading-tight">
            {concept.title}
          </h1>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center justify-between pt-2">
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-surface-muted text-xs">
            <button
              onClick={() => { setReadingMode('read'); setIsAnswerRevealed(false); }}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md font-semibold transition-all ${
                readingMode === 'read' ? 'bg-surface text-ink shadow-xs' : 'text-muted hover:text-ink'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Chế độ Đọc hiểu</span>
            </button>
            <button
              onClick={() => { setReadingMode('practice'); setIsAnswerRevealed(false); }}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md font-semibold transition-all ${
                readingMode === 'practice' ? 'bg-surface text-accent shadow-xs' : 'text-muted hover:text-ink'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Chế độ Tự trả lời</span>
            </button>
          </div>

          <div className="text-xs text-muted hidden sm:block">
            {readingMode === 'read' ? 'Nội dung mở sẵn để đọc và hiểu' : 'Đóng đáp án, tự nói thành tiếng rồi đối chiếu'}
          </div>
        </div>
      </div>

      {/* Main Body Content */}
      {readingMode === 'practice' && !isAnswerRevealed ? (
        /* PRACTICE MODE: Question only, scratchpad, reveal button */
        <div className="bg-surface border-2 border-accent/30 rounded-xl p-5 space-y-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-accent uppercase tracking-wider">
                Câu hỏi vấn đáp:
              </div>
              <h2 className="text-lg font-bold text-ink leading-snug">
                {concept.title}
              </h2>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted block">
              Tập trả lời miệng thành tiếng, hoặc gõ ý chính vào đây trước khi mở đáp án:
            </label>
            <textarea
              value={scratchpad}
              onChange={e => setScratchpad(e.target.value)}
              placeholder="Ghi nhanh 2-3 ý chính: Định nghĩa là gì? Ví dụ minh họa? Điều kiện hoặc bẫy cần nhớ?..."
              rows={4}
              className="w-full text-sm border border-border rounded-lg p-3 bg-surface-muted/30 focus:outline-hidden focus:border-accent font-sans"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border">
            <span className="text-xs text-muted">
              Hãy nói to thành lời ít nhất 1 phút trước khi xem giải thích.
            </span>
            <button
              onClick={() => setIsAnswerRevealed(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-bold hover:bg-accent-dark shadow-sm transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Xem giải thích & Mẫu trả lời miệng</span>
            </button>
          </div>
        </div>
      ) : (
        /* READ MODE OR REVEALED PRACTICE MODE: Render Full Blocks */
        <div className="space-y-6">
          {readingMode === 'practice' && isAnswerRevealed && (
            <div className="bg-green-50/70 border border-green-200 rounded-lg p-3 text-xs text-[#27624a] flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Đã mở đáp án! Hãy đối chiếu câu trả lời của bạn với mẫu giải thích bên dưới.
              </span>
              <button
                onClick={() => setIsAnswerRevealed(false)}
                className="text-xs underline hover:text-[#1b4534]"
              >
                Ẩn lại
              </button>
            </div>
          )}

          {/* Semantic Blocks */}
          <div className="reader-content space-y-4">
            {/* 1. Spoken Answer Model (Crucial for oral exam - placed at the very top, above Nguồn) */}
            {answerBlocks.map((b, i) => (
              <div key={`ans-${i}`} className="bg-accent/10 border-2 border-accent/40 rounded-xl p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider mb-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Mẫu trả lời miệng khi thầy hỏi:</span>
                </div>
                <div className="text-ink font-medium leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {b.markdown}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {/* 2. Source references display (directly below Spoken Answer Model) */}
            {isDpl && concept.sourceReferences && concept.sourceReferences.length > 0 ? (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface border border-border text-xs text-muted shadow-2xs">
                <BookOpen className="w-4 h-4 text-accent shrink-0" />
                <span className="font-semibold text-ink">Nguồn tham chiếu slide:</span>
                <span className="text-muted font-mono text-[11px]">
                  {concept.sourceReferences.map(r => `${r.file}${r.slideMarkers ? ` (${r.slideMarkers})` : ''}`).join('; ')}
                </span>
              </div>
            ) : sourceBlocks.length > 0 ? (
              sourceBlocks.map((b, i) => (
                <div key={`src-${i}`} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface border border-border text-xs text-muted shadow-2xs">
                  <BookOpen className="w-4 h-4 text-accent shrink-0" />
                  <div className="text-muted">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {b.markdown}
                    </ReactMarkdown>
                  </div>
                </div>
              ))
            ) : null}

            {/* 3. Concept / Definition blocks */}
            {conceptBlocks.map((b, i) => (
              <div key={`c-${i}`} className="bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-2xs">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {b.markdown}
                </ReactMarkdown>
              </div>
            ))}

            {/* 4. Prose blocks if any */}
            {proseBlocks.map((b, i) => (
              <div key={`p-${i}`} className="bg-surface border border-border rounded-xl p-4 sm:p-5 shadow-2xs">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {b.markdown}
                </ReactMarkdown>
              </div>
            ))}

            {/* 5. Example blocks */}
            {exampleBlocks.map((b, i) => (
              <div key={`ex-${i}`} className="bg-surface-muted/70 border-l-4 border-xs-dark rounded-r-xl p-4 sm:p-5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-xs-dark uppercase tracking-wider mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Ví dụ minh họa cụ thể:</span>
                </div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {b.markdown}
                </ReactMarkdown>
              </div>
            ))}

            {/* Interactive Simulation Embedded if linked */}
            {concept.simulationIds.map(simId => (
              <SimulationContainer key={simId} simulationId={simId} />
            ))}

            {/* Followup / Traps blocks */}
            {followupBlocks.map((b, i) => (
              <div key={`f-${i}`} className="bg-amber-50/70 border border-warning-ink/30 rounded-xl p-4 sm:p-5 text-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-warning-ink uppercase tracking-wider mb-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Câu hỏi tiếp nối đào sâu:</span>
                </div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {b.markdown}
                </ReactMarkdown>
              </div>
            ))}

            {trapBlocks.map((b, i) => (
              <div key={`t-${i}`} className="bg-red-50/70 border border-danger-ink/30 rounded-xl p-4 sm:p-5 text-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-danger-ink uppercase tracking-wider mb-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Bẫy dễ nhầm lẫn cần tránh:</span>
                </div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {b.markdown}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Self Assessment Bar */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-2.5">
        <div className="text-xs font-bold text-ink flex items-center justify-between">
          <span>Tự đánh giá mức hiểu của bạn sau khi đọc:</span>
          <span className="text-[11px] text-muted font-normal">(Đánh giá độc lập của người học)</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleSetUnderstanding('unknown')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
              understanding === 'unknown'
                ? 'bg-red-100 text-danger-ink border-danger-ink ring-2 ring-danger-ink/20'
                : 'bg-surface border-border text-muted hover:bg-surface-muted hover:text-ink'
            }`}
          >
            Chưa hiểu (Cần học lại)
          </button>

          <button
            onClick={() => handleSetUnderstanding('partial')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
              understanding === 'partial'
                ? 'bg-amber-100 text-warning-ink border-warning-ink ring-2 ring-warning-ink/20'
                : 'bg-surface border-border text-muted hover:bg-surface-muted hover:text-ink'
            }`}
          >
            Hiểu một phần
          </button>

          <button
            onClick={() => handleSetUnderstanding('confident')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
              understanding === 'confident'
                ? 'bg-green-100 text-[#27624a] border-[#27624a] ring-2 ring-[#27624a]/20'
                : 'bg-surface border-border text-muted hover:bg-surface-muted hover:text-ink'
            }`}
          >
            Tự giải thích được (Vững)
          </button>
        </div>
      </div>

      {/* Personal Note Editor */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-ink">
          <span className="flex items-center gap-1.5">
            <FileEdit className="w-3.5 h-3.5 text-accent" />
            Ghi chú cá nhân cho câu này:
          </span>
          {noteSavedFeedback && (
            <span className="text-[11px] text-[#27624a] flex items-center gap-1 font-normal">
              <Check className="w-3 h-3" /> Đã lưu tự động!
            </span>
          )}
        </div>
        <textarea
          value={userNote}
          onChange={e => setUserNote(e.target.value)}
          onBlur={handleSaveNote}
          placeholder="Ghi lại các từ khóa của riêng bạn, lỗi hay quên, hoặc liên hệ thực tế..."
          rows={3}
          className="w-full text-xs font-sans border border-border rounded-lg p-2.5 bg-surface-muted/30 focus:outline-hidden focus:border-accent"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSaveNote}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-surface-muted text-muted hover:text-ink border border-border"
          >
            <Save className="w-3 h-3" /> Lưu ghi chú
          </button>
        </div>
      </div>

      {/* Related Concepts & Prerequisites Chips */}
      {(concept.prerequisiteIds.length > 0 || concept.relatedIds.length > 0) && (
        <div className="bg-surface-muted/40 border border-border rounded-xl p-4 space-y-3 text-xs">
          {concept.prerequisiteIds.length > 0 && (
            <div className="space-y-1">
              <span className="font-semibold text-muted block">Khái niệm tiền đề (Nên đọc trước):</span>
              <div className="flex flex-wrap gap-1.5">
                {concept.prerequisiteIds.map(pId => {
                  const target = conceptMap.get(pId);
                  return (
                    <Link
                      key={pId}
                      to={`/learn/${pId}`}
                      className="px-2 py-1 rounded bg-surface border border-border text-ink hover:border-accent font-mono transition-colors"
                    >
                      {pId}: {target?.title || pId}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {concept.relatedIds.length > 0 && (
            <div className="space-y-1">
              <span className="font-semibold text-muted block">Kiến thức liên quan trong bộ 140 câu:</span>
              <div className="flex flex-wrap gap-1.5">
                {concept.relatedIds.map(rId => {
                  const target = conceptMap.get(rId);
                  return (
                    <Link
                      key={rId}
                      to={`/learn/${rId}`}
                      className="px-2 py-1 rounded bg-surface border border-border text-ink hover:border-accent font-mono transition-colors"
                    >
                      {rId}: {target?.title || rId}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Footer (Previous / Next Concept) */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
        {prevConcept ? (
          <Link
            to={`/learn/${prevConcept.id}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface border border-border text-xs text-ink hover:bg-surface-muted transition-colors max-w-[45%]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <div className="truncate text-left">
              <span className="text-[10px] text-muted block">Câu trước</span>
              <span className="font-bold truncate">{prevConcept.id}: {prevConcept.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextConcept && (
          <Link
            to={`/learn/${nextConcept.id}`}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-dark transition-colors max-w-[45%] text-right ml-auto"
          >
            <div className="truncate text-right">
              <span className="text-[10px] opacity-80 block">Câu tiếp theo</span>
              <span className="font-bold truncate">{nextConcept.id}: {nextConcept.title}</span>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        )}
      </div>
    </article>
  );
};
