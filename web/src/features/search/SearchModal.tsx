import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, FileText, Award, Bookmark, ArrowRight } from 'lucide-react';
import { searchKnowledgeBase } from '../../lib/search';
import type { SearchResult } from '../../lib/search';
import { SUBJECT_INFO } from '../../content/metadata';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Global keydown listener for shortcut: Ctrl+K / Cmd+K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea';

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === '/' && !isInputFocused && !isOpen) {
        e.preventDefault();
        setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced / immediate search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    const res = searchKnowledgeBase(query);
    setResults(res);
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation within results
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      goToResult(results[selectedIndex]);
    }
  };

  const goToResult = (result: SearchResult) => {
    onClose();
    // Url is formatted like `#/learn/XS01` or `#/reference/xs`
    const path = result.url.replace(/^#/, '');
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-ink/50 backdrop-blur-xs">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Dialog Box */}
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface">
          <Search className="w-5 h-5 text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Tìm theo ID (ML30, XS05), tiêu đề, nội dung, thuật ngữ (Bayes, variance, Big-O)..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-hidden"
            aria-label="Nhập từ khóa tìm kiếm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-muted hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-surface-muted border border-border rounded text-muted">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-border/50">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-xs text-muted space-y-2">
              <p>Nhập từ khóa để tìm kiếm trong toàn bộ 140 concept, 72 thuật ngữ và 20 bài tập.</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2 font-mono text-[11px]">
                <button onClick={() => setQuery('XS05')} className="px-2 py-1 rounded bg-surface-muted hover:bg-border/60">XS05</button>
                <button onClick={() => setQuery('ML30')} className="px-2 py-1 rounded bg-surface-muted hover:bg-border/60">ML30</button>
                <button onClick={() => setQuery('do lech chuan')} className="px-2 py-1 rounded bg-surface-muted hover:bg-border/60">độ lệch chuẩn</button>
                <button onClick={() => setQuery('overfitting')} className="px-2 py-1 rounded bg-surface-muted hover:bg-border/60">overfitting</button>
                <button onClick={() => setQuery('backprop')} className="px-2 py-1 rounded bg-surface-muted hover:bg-border/60">backprop</button>
                <button onClick={() => setQuery('binary search')} className="px-2 py-1 rounded bg-surface-muted hover:bg-border/60">binary search</button>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted">
              Không tìm thấy kết quả nào phù hợp với &ldquo;<strong>{query}</strong>&rdquo;. Vui lòng thử từ khóa khác hoặc tìm không dấu.
            </div>
          ) : (
            results.map((r, idx) => {
              const isSelected = idx === selectedIndex;
              const sInfo = r.subjectId ? SUBJECT_INFO[r.subjectId] : undefined;

              return (
                <div
                  key={`${r.type}-${r.id}`}
                  onClick={() => goToResult(r)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                    isSelected ? 'bg-surface-muted ring-1 ring-accent/30' : 'hover:bg-surface-muted/50'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {/* Type Badge */}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        r.type === 'concept'
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : r.type === 'glossary'
                          ? 'bg-blue-50 text-[#2b5c8f] border border-blue-200'
                          : r.type === 'exercise'
                          ? 'bg-amber-50 text-[#8a4b16] border border-amber-200'
                          : 'bg-surface-muted text-muted'
                      }`}>
                        {r.type === 'concept' ? 'Concept' : r.type === 'glossary' ? 'Thuật ngữ' : r.type === 'exercise' ? 'Bài tập' : 'Đề thi'}
                      </span>

                      {/* Collection / Chapter badge */}
                      {r.collectionId === 'dpl302m' ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          DPL302m{r.chapterId ? ` • ${r.chapterId.toUpperCase()}` : ''}
                        </span>
                      ) : null}

                      {/* Priority or Study Level badge */}
                      {r.collectionId === 'dpl302m' && r.studyLevel ? (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          r.studyLevel === 'core'
                            ? 'bg-green-100 text-[#27624a] border border-green-200'
                            : 'bg-blue-100 text-[#2b5c8f] border border-blue-200'
                        }`}>
                          {r.studyLevel === 'core' ? 'Cốt lõi' : 'Đọc tiếp'}
                        </span>
                      ) : r.priority ? (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          r.priority === 'A' ? 'bg-green-100 text-[#27624a]' :
                          r.priority === 'B' ? 'bg-blue-100 text-[#2b5c8f]' :
                          'bg-amber-100 text-[#8a4b16]'
                        }`}>
                          Mức {r.priority}
                        </span>
                      ) : null}

                      {/* Subject Name for Foundations */}
                      {r.collectionId !== 'dpl302m' && sInfo && (
                        <span className="text-[11px] text-muted font-medium">
                          {sInfo.shortName}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-ink leading-snug">
                      {r.title}
                    </h4>

                    {r.snippet && (
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                        {r.snippet}
                      </p>
                    )}
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition-opacity mt-1 ${
                    isSelected ? 'opacity-100 text-accent' : 'opacity-0'
                  }`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-surface-muted border-t border-border text-[11px] text-muted flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Dùng <kbd className="font-mono bg-surface px-1 py-0.5 rounded border border-border">↑</kbd> <kbd className="font-mono bg-surface px-1 py-0.5 rounded border border-border">↓</kbd> để di chuyển</span>
            <span><kbd className="font-mono bg-surface px-1 py-0.5 rounded border border-border">↵ Enter</kbd> để mở</span>
          </div>
          <span>{results.length} kết quả</span>
        </div>
      </div>
    </div>
  );
};
