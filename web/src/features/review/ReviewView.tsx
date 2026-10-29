import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookmarkCheck,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Filter,
  CheckCircle2,
  FileEdit
} from 'lucide-react';
import { loadUserData } from '../../lib/storage';
import { concepts, conceptMap } from '../../content/generated';
import type { Concept, SubjectId, Priority } from '../../content/types';
import { SUBJECT_INFO } from '../../content/metadata';

export const ReviewView: React.FC = () => {
  const [userData, setUserData] = useState(loadUserData());
  const [filterSubject, setFilterSubject] = useState<SubjectId | 'ALL'>('ALL');

  useEffect(() => {
    const handleStorage = () => setUserData(loadUserData());
    window.addEventListener('on-van-dap-storage-updated', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('on-van-dap-storage-updated', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Collect all concepts needing review: unknown, partial, or bookmarked
  // Priority ordering: unknown -> partial -> bookmarked
  const unknownList: Concept[] = [];
  const partialList: Concept[] = [];
  const bookmarkedOnlyList: Concept[] = [];

  const seenIds = new Set<string>();

  // 1. Unknown
  for (const c of concepts) {
    const p = userData.conceptProgress[c.id];
    if (p?.understanding === 'unknown') {
      unknownList.push(c);
      seenIds.add(c.id);
    }
  }

  // 2. Partial
  for (const c of concepts) {
    const p = userData.conceptProgress[c.id];
    if (p?.understanding === 'partial' && !seenIds.has(c.id)) {
      partialList.push(c);
      seenIds.add(c.id);
    }
  }

  // 3. Bookmarked only
  for (const c of concepts) {
    const p = userData.conceptProgress[c.id];
    if (p?.bookmarked && !seenIds.has(c.id)) {
      bookmarkedOnlyList.push(c);
      seenIds.add(c.id);
    }
  }

  const filterFn = (c: Concept) => {
    if (filterSubject === 'ALL') return true;
    return c.subjectId === filterSubject;
  };

  const filteredUnknown = unknownList.filter(filterFn);
  const filteredPartial = partialList.filter(filterFn);
  const filteredBookmarked = bookmarkedOnlyList.filter(filterFn);

  const totalReviewCount = filteredUnknown.length + filteredPartial.length + filteredBookmarked.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-5 h-5 text-warning-ink" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-ink">
            Danh Sách Cần Ôn Lại ({totalReviewCount} câu)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted">
          Sắp xếp theo thứ tự ưu tiên ôn tập: <strong>Chưa hiểu</strong> → <strong>Hiểu một phần</strong> → <strong>Đã lưu bookmark</strong>.
          Mỗi câu chỉ xuất hiện một lần duy nhất, không đếm trùng lặp.
        </p>

        {/* Filter by subject */}
        <div className="flex flex-wrap gap-1.5 pt-2 text-xs font-semibold">
          <button
            onClick={() => setFilterSubject('ALL')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filterSubject === 'ALL'
                ? 'bg-ink text-white border-ink'
                : 'bg-surface border-border text-muted hover:text-ink'
            }`}
          >
            Tất cả mảng ({seenIds.size})
          </button>
          {(['xs', 'ml', 'dl', 'gt'] as SubjectId[]).map(sId => {
            const s = SUBJECT_INFO[sId];
            return (
              <button
                key={sId}
                onClick={() => setFilterSubject(sId)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  filterSubject === sId
                    ? 'bg-ink text-white border-ink'
                    : 'bg-surface border-border text-muted hover:text-ink'
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {totalReviewCount === 0 ? (
        <div className="p-12 text-center bg-surface border border-border rounded-xl space-y-3">
          <CheckCircle2 className="w-10 h-10 text-[#27624a] mx-auto" />
          <h3 className="text-base font-bold text-ink">Danh sách cần ôn đang trống!</h3>
          <p className="text-xs text-muted max-w-md mx-auto">
            Khi đọc tài liệu hoặc luyện đề, bạn hãy đánh dấu các câu chưa tự giải thích được để quay lại ôn tập tập trung tại đây.
          </p>
          <Link
            to="/learn/XS01"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent-dark"
          >
            Bắt đầu đọc chuyên đề
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. Unknown group */}
          {filteredUnknown.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-danger-ink uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>1. Chưa hiểu — Cần ưu tiên đọc lại bản chất ({filteredUnknown.length} câu)</span>
              </div>
              <div className="bg-surface border border-border rounded-xl divide-y divide-border overflow-hidden">
                {filteredUnknown.map(c => renderReviewItem(c, userData))}
              </div>
            </div>
          )}

          {/* 2. Partial group */}
          {filteredPartial.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-warning-ink uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>2. Hiểu một phần — Cần củng cố ví dụ và mẫu trả lời ({filteredPartial.length} câu)</span>
              </div>
              <div className="bg-surface border border-border rounded-xl divide-y divide-border overflow-hidden">
                {filteredPartial.map(c => renderReviewItem(c, userData))}
              </div>
            </div>
          )}

          {/* 3. Bookmarked only group */}
          {filteredBookmarked.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#2b5c8f] uppercase tracking-wider">
                <BookmarkCheck className="w-4 h-4" />
                <span>3. Đã lưu Bookmark ({filteredBookmarked.length} câu)</span>
              </div>
              <div className="bg-surface border border-border rounded-xl divide-y divide-border overflow-hidden">
                {filteredBookmarked.map(c => renderReviewItem(c, userData))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function renderReviewItem(c: Concept, userData: any) {
  const p = userData.conceptProgress[c.id];
  const sInfo = SUBJECT_INFO[c.subjectId];

  return (
    <Link
      key={c.id}
      to={`/learn/${c.id}`}
      className="p-3.5 sm:px-4 sm:py-3 flex items-start justify-between gap-3 hover:bg-surface-muted/60 transition-colors group"
    >
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-surface-muted text-ink border border-border shrink-0">
            {c.id}
          </span>
          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
            c.priority === 'A' ? 'bg-green-100 text-[#27624a]' :
            c.priority === 'B' ? 'bg-blue-100 text-[#2b5c8f]' :
            'bg-amber-100 text-[#8a4b16]'
          }`}>
            Mức {c.priority}
          </span>
          <span className="text-[11px] text-muted font-medium">
            {sInfo.name}
          </span>
        </div>

        <h4 className="text-sm font-semibold text-ink group-hover:text-accent leading-snug">
          {c.title}
        </h4>

        {p?.note?.trim() && (
          <div className="text-xs text-muted flex items-center gap-1.5 pt-0.5 font-sans">
            <FileEdit className="w-3 h-3 text-accent shrink-0" />
            <span className="line-clamp-1 italic">&ldquo;{p.note}&rdquo;</span>
          </div>
        )}
      </div>

      <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent shrink-0 mt-1" />
    </Link>
  );
}
