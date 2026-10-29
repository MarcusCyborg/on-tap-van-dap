import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Filter,
  ArrowRight,
  BookOpen,
  Info,
  X
} from 'lucide-react';
import { subjects, conceptMap } from '../../content/generated';
import type { SubjectId, Priority, Concept } from '../../content/types';
import { SUBJECT_INFO } from '../../content/metadata';
import { loadUserData } from '../../lib/storage';

export const SubjectTocView: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [filterPriority, setFilterPriority] = useState<'ALL' | Priority | 'REVIEW'>('ALL');
  const [userData, setUserData] = useState(loadUserData());

  useEffect(() => {
    const handleStorage = () => setUserData(loadUserData());
    window.addEventListener('on-van-dap-storage-updated', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('on-van-dap-storage-updated', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const subject = subjects.find(s => s.id === subjectId?.toLowerCase());

  if (!subject) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-ink">Không tìm thấy chuyên đề</h2>
        <Link to="/" className="text-sm text-accent underline">Quay lại trang chủ</Link>
      </div>
    );
  }

  const sInfo = SUBJECT_INFO[subject.id];

  // Helper to check if concept needs review
  const needsReview = (conceptId: string) => {
    const p = userData.conceptProgress[conceptId];
    return p?.bookmarked || p?.understanding === 'unknown' || p?.understanding === 'partial';
  };

  // Collect all concepts for this subject
  const subjectConcepts: Concept[] = [];
  for (let i = 1; i <= 35; i++) {
    const pfx = subject.id.toUpperCase();
    const id = `${pfx}${i.toString().padStart(2, '0')}`;
    const c = conceptMap.get(id);
    if (c) subjectConcepts.push(c);
  }

  // Count metrics for filters
  const countA = subjectConcepts.filter(c => c.priority === 'A').length;
  const countB = subjectConcepts.filter(c => c.priority === 'B').length;
  const countC = subjectConcepts.filter(c => c.priority === 'C').length;
  const countReview = subjectConcepts.filter(c => needsReview(c.id)).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Subject Header Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm"
        style={{ backgroundColor: sInfo.color }}
      >
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded">
            Chuyên đề {sInfo.order} / 4
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {subject.name}
          </h1>
          <p className="text-sm opacity-90 leading-relaxed">
            {subject.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
            <span>Tổng số: <strong>35 câu hỏi</strong></span>
            <span>•</span>
            <span>Mức A: <strong>18 câu</strong></span>
            <span>•</span>
            <span>Mức B: <strong>12 câu</strong></span>
            <span>•</span>
            <span>Mức C: <strong>5 câu</strong></span>
          </div>
        </div>
      </div>

      {/* Reading Path Recommendation Banner */}
      <div className="bg-surface border border-border rounded-xl p-4 text-xs sm:text-sm text-ink space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold flex items-center gap-1.5 text-accent-dark">
            <BookOpen className="w-4 h-4 text-accent" />
            Đường đọc tối nay (Ưu tiên mức A):
          </span>
          <Link
            to={`/learn/${subject.readingPathA[0] || 'XS01'}`}
            className="text-xs text-accent font-semibold hover:underline flex items-center gap-1"
          >
            Bắt đầu đọc câu đầu tiên <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-1 font-mono text-xs">
          {subject.readingPathA.map((id, idx) => (
            <React.Fragment key={id}>
              <Link
                to={`/learn/${id}`}
                className="px-2 py-0.5 rounded bg-surface-muted hover:bg-accent/10 hover:text-accent border border-border transition-colors font-semibold"
              >
                {id}
              </Link>
              {idx < subject.readingPathA.length - 1 && <span className="text-muted self-center">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setFilterPriority('ALL')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterPriority === 'ALL'
                  ? 'bg-ink text-white border-ink shadow-2xs'
                  : 'bg-surface border-border text-muted hover:text-ink hover:bg-surface-muted'
              }`}
            >
              Tất cả (35)
            </button>
            <button
              onClick={() => setFilterPriority('A')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterPriority === 'A'
                  ? 'bg-green-700 text-white border-green-700 shadow-2xs'
                  : 'bg-surface border-border text-muted hover:text-ink hover:bg-surface-muted'
              }`}
            >
              Mức A: Nền tảng ({countA})
            </button>
            <button
              onClick={() => setFilterPriority('B')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterPriority === 'B'
                  ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                  : 'bg-surface border-border text-muted hover:text-ink hover:bg-surface-muted'
              }`}
            >
              Mức B: Mở rộng ({countB})
            </button>
            <button
              onClick={() => setFilterPriority('C')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterPriority === 'C'
                  ? 'bg-amber-700 text-white border-amber-700 shadow-2xs'
                  : 'bg-surface border-border text-muted hover:text-ink hover:bg-surface-muted'
              }`}
            >
              Mức C: Nhận diện ({countC})
            </button>
            <button
              onClick={() => setFilterPriority('REVIEW')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterPriority === 'REVIEW'
                  ? 'bg-danger-ink text-white border-danger-ink shadow-2xs'
                  : 'bg-surface border-border text-muted hover:text-ink hover:bg-surface-muted'
              }`}
            >
              Cần ôn lại ({countReview})
            </button>
          </div>

          <div className="text-[11px] text-muted flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>A/B/C là mức ưu tiên học, không phải xác suất ra đề.</span>
          </div>
        </div>
      </div>

      {/* Grouped Concepts List */}
      <div className="space-y-6">
        {subject.groups.map(group => {
          // Filter concepts in this group
          const groupConcepts = group.conceptIds
            .map(id => conceptMap.get(id))
            .filter((c): c is Concept => {
              if (!c) return false;
              if (filterPriority === 'ALL') return true;
              if (filterPriority === 'REVIEW') return needsReview(c.id);
              return c.priority === filterPriority;
            });

          if (groupConcepts.length === 0) return null;

          return (
            <div key={group.id} className="bg-surface border border-border rounded-xl overflow-hidden shadow-2xs">
              <div className="px-4 py-3 bg-surface-muted border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink">
                  {group.title}
                </h3>
                <span className="text-xs text-muted font-mono font-medium">
                  {groupConcepts.length} câu
                </span>
              </div>

              <div className="divide-y divide-border">
                {groupConcepts.map(c => {
                  const p = userData.conceptProgress[c.id];
                  const isRead = !!p?.readAt;
                  const understanding = p?.understanding;
                  const isBookmarked = p?.bookmarked;
                  const hasSimulation = c.simulationIds.length > 0;

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

                        {/* Priority Badge */}
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                          c.priority === 'A' ? 'bg-green-100 text-[#27624a]' :
                          c.priority === 'B' ? 'bg-blue-100 text-[#2b5c8f]' :
                          'bg-amber-100 text-[#8a4b16]'
                        }`}>
                          {c.priority}
                        </span>

                        {/* Concept Title */}
                        <span className="text-sm text-ink group-hover:text-accent font-medium truncate">
                          {c.title}
                        </span>

                        {/* Simulation indicator */}
                        {hasSimulation && (
                          <span
                            className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded shrink-0"
                            title="Có mô phỏng trực quan tương tác"
                          >
                            <Sparkles className="w-3 h-3" /> Mô phỏng
                          </span>
                        )}
                      </div>

                      {/* Right state indicators */}
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

                        <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Empty filter message */}
        {filterPriority === 'REVIEW' && countReview === 0 && (
          <div className="p-8 text-center bg-surface border border-border rounded-xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#27624a] mx-auto" />
            <h4 className="text-base font-bold text-ink">Chưa có câu nào cần ôn lại!</h4>
            <p className="text-xs text-muted max-w-md mx-auto">
              Khi đọc các câu, bạn có thể bấm &ldquo;Chưa hiểu&rdquo;, &ldquo;Hiểu một phần&rdquo; hoặc biểu tượng Bookmark để thêm câu đó vào danh sách cần ôn.
            </p>
            <button
              onClick={() => setFilterPriority('ALL')}
              className="mt-2 text-xs font-semibold text-accent underline"
            >
              Xem tất cả 35 câu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
