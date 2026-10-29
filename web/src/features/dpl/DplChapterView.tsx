import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  CheckCircle2,
  BookmarkCheck,
  Bookmark,
  Sparkles,
  Filter,
  ArrowRight,
  BookOpen,
  Info,
  Layers,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { dplChapters, conceptMap } from '../../content/generated';
import type { Concept, StudyLevel, Exercise } from '../../content/types';
import { loadUserData } from '../../lib/storage';

export const DplChapterView: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [filterLevel, setFilterLevel] = useState<'ALL' | StudyLevel | 'REVIEW'>('ALL');
  const [userData, setUserData] = useState(loadUserData());
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleStorage = () => setUserData(loadUserData());
    window.addEventListener('on-van-dap-storage-updated', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('on-van-dap-storage-updated', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const chapter = dplChapters.find(c => c.chapterId.toLowerCase() === chapterId?.toLowerCase());

  if (!chapter) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-ink">Không tìm thấy chương DPL302m</h2>
        <Link to="/dpl302m" className="text-sm text-accent underline">Quay lại danh mục DPL302m</Link>
      </div>
    );
  }

  // Helper to check if concept needs review
  const needsReview = (conceptId: string) => {
    const p = userData.conceptProgress[conceptId];
    return p?.bookmarked || p?.understanding === 'unknown' || p?.understanding === 'partial';
  };

  // Collect concepts for this chapter
  const chapterConcepts: Concept[] = chapter.conceptIds
    .map(id => conceptMap.get(id))
    .filter((c): c is Concept => !!c);

  // Filter concepts based on tab
  const filteredConcepts = chapterConcepts.filter(c => {
    if (filterLevel === 'ALL') return true;
    if (filterLevel === 'REVIEW') return needsReview(c.id);
    return c.studyLevel === filterLevel;
  });

  // Calculate progress strictly according to current filter
  const currentTotal = filteredConcepts.length;
  const currentRead = filteredConcepts.filter(c => userData.conceptProgress[c.id]?.readAt).length;
  const currentPct = currentTotal > 0 ? Math.round((currentRead / currentTotal) * 100) : 0;

  const countCore = chapterConcepts.filter(c => c.studyLevel === 'core').length;
  const countFurther = chapterConcepts.filter(c => c.studyLevel === 'further').length;
  const countReview = chapterConcepts.filter(c => needsReview(c.id)).length;

  const toggleSolution = (exId: string) => {
    setRevealedSolutions(prev => ({ ...prev, [exId]: !prev[exId] }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Chapter Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm bg-purple-900">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <Link to="/dpl302m" className="text-xs font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded transition-colors">
              ← Khóa học DPL302m
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded">
              {chapter.chapterId.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {chapter.title}
          </h1>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium opacity-90">
            <span>Tổng số: <strong>{chapter.totalCount} câu hỏi</strong></span>
            <span>•</span>
            <span>Cốt lõi: <strong>{chapter.coreCount} câu</strong></span>
            <span>•</span>
            <span>Đọc tiếp: <strong>{chapter.furtherCount} câu</strong></span>
            <span>•</span>
            <span>Bài tự kiểm tra: <strong>{chapter.exercises.length} bài</strong></span>
          </div>

          {/* Dynamic Progress Indicator */}
          <div className="pt-3 max-w-md space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span>Tiến độ ({filterLevel === 'ALL' ? 'Tất cả' : filterLevel === 'core' ? 'Cốt lõi' : filterLevel === 'further' ? 'Đọc tiếp' : 'Cần ôn'}):</span>
              <span><strong>{currentRead} / {currentTotal}</strong> ({currentPct}%)</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all"
                style={{ width: `${currentPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setFilterLevel('ALL')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterLevel === 'ALL'
                  ? 'bg-purple-800 text-white border-purple-800 shadow-2xs'
                  : 'bg-surface border-border text-muted hover:text-ink hover:bg-surface-muted'
              }`}
            >
              Tất cả ({chapter.totalCount})
            </button>
            <button
              onClick={() => setFilterLevel('core')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterLevel === 'core'
                  ? 'bg-green-700 text-white border-green-700 shadow-2xs'
                  : 'bg-surface border-border text-muted hover:text-ink hover:bg-surface-muted'
              }`}
            >
              Cốt lõi ({countCore})
            </button>
            <button
              onClick={() => setFilterLevel('further')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterLevel === 'further'
                  ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                  : 'bg-surface border-border text-muted hover:text-ink hover:bg-surface-muted'
              }`}
            >
              Đọc tiếp ({countFurther})
            </button>
            <button
              onClick={() => setFilterLevel('REVIEW')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterLevel === 'REVIEW'
                  ? 'bg-danger-ink text-white border-danger-ink shadow-2xs'
                  : 'bg-surface border-border text-muted hover:text-ink hover:bg-surface-muted'
              }`}
            >
              Cần ôn lại ({countReview})
            </button>
          </div>

          <div className="text-[11px] text-muted flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>&ldquo;Cốt lõi / Đọc tiếp&rdquo; là thứ tự ưu tiên học đề xuất, không dự báo đề thi.</span>
          </div>
        </div>
      </div>

      {/* Concepts List */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-2xs">
        <div className="px-4 py-3 bg-surface-muted border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">
            Danh sách câu hỏi theo thứ tự nguồn
          </h3>
          <span className="text-xs text-muted font-mono font-medium">
            {filteredConcepts.length} câu
          </span>
        </div>

        <div className="divide-y divide-border">
          {filteredConcepts.map(c => {
            const p = userData.conceptProgress[c.id];
            const isRead = !!p?.readAt;
            const understanding = p?.understanding;
            const isBookmarked = p?.bookmarked;

            return (
              <Link
                key={c.id}
                to={`/learn/${c.id}`}
                className="p-3.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3 hover:bg-surface-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Read Checkbox Icon */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                      isRead
                        ? 'bg-green-100 border-[#27624a] text-[#27624a]'
                        : 'border-border text-transparent'
                    }`}
                    title={isRead ? 'Đã đọc' : 'Chưa đọc'}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                  </div>

                  {/* ID Badge */}
                  <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-surface-muted text-ink border border-border shrink-0">
                    {c.id}
                  </span>

                  {/* Study Level Badge */}
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                    c.studyLevel === 'core'
                      ? 'bg-green-100 text-[#27624a] border border-green-200'
                      : 'bg-blue-100 text-[#2b5c8f] border border-blue-200'
                  }`}>
                    {c.studyLevel === 'core' ? 'Cốt lõi' : 'Đọc tiếp'}
                  </span>

                  {/* Concept Title */}
                  <span className="text-sm text-ink group-hover:text-purple-700 font-medium truncate">
                    {c.title}
                  </span>
                </div>

                {/* Right indicators */}
                <div className="flex items-center gap-2 shrink-0">
                  {understanding && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      understanding === 'confident'
                        ? 'bg-green-100 text-[#27624a]'
                        : understanding === 'partial'
                        ? 'bg-amber-100 text-warning-ink'
                        : 'bg-red-100 text-danger-ink'
                    }`}>
                      {understanding === 'confident' ? 'Vững' : understanding === 'partial' ? 'Hiểu 1 phần' : 'Chưa hiểu'}
                    </span>
                  )}

                  {isBookmarked && (
                    <BookmarkCheck className="w-4 h-4 text-warning-ink fill-current" />
                  )}

                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-purple-700 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Chapter Exercises Section */}
      {chapter.exercises.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-ink flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-700" />
              Bài Tự Kiểm Tra Có Lời Giải ({chapter.exercises.length} bài)
            </h3>
            <p className="text-xs text-muted">
              Tập giải và suy nghĩ đáp án trước khi bấm mở xem lời giải đối chiếu.
            </p>
          </div>

          <div className="space-y-3">
            {chapter.exercises.map((ex, idx) => {
              const isRevealed = !!revealedSolutions[ex.id];
              return (
                <div
                  key={ex.id}
                  className="border border-border rounded-xl p-4 space-y-3 bg-surface-muted/30"
                >
                  <div className="text-xs font-bold text-purple-800">
                    {ex.title}
                  </div>

                  {/* Question */}
                  <div className="text-xs sm:text-sm text-ink leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {ex.questionMarkdown}
                    </ReactMarkdown>
                  </div>

                  {/* Solution toggle button */}
                  {ex.solutionMarkdown && (
                    <div className="pt-2 border-t border-border/60">
                      <button
                        onClick={() => toggleSolution(ex.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900"
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" /> Ẩn lời giải
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" /> Xem lời giải đối chiếu
                          </>
                        )}
                      </button>

                      {isRevealed && (
                        <div className="mt-2 p-3 rounded-lg bg-green-50/80 border border-green-200 text-xs sm:text-sm text-ink leading-relaxed prose prose-sm max-w-none">
                          <div className="text-[11px] font-bold text-[#27624a] uppercase tracking-wider mb-1">
                            Lời giải đối chiếu:
                          </div>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {ex.solutionMarkdown}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chapter Glossary Section */}
      {chapter.glossary.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-5 space-y-3 shadow-2xs">
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-700" />
            Từ Khóa & Thuật Ngữ ({chapter.glossary.length} mục)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-muted/60 text-muted font-bold">
                  <th className="py-2 px-3 whitespace-nowrap">Thuật ngữ</th>
                  <th className="py-2 px-3">Ý nghĩa cần nhớ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {chapter.glossary.map((g, i) => (
                  <tr key={i} className="hover:bg-surface-muted/30">
                    <td className="py-2 px-3 font-semibold text-ink whitespace-nowrap">
                      {g.term}
                    </td>
                    <td className="py-2 px-3 text-muted">
                      {g.meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
