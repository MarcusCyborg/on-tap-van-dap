import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  BookOpen,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Search,
  Eye,
  EyeOff,
  Table
} from 'lucide-react';
import { subjects } from '../../content/generated';
import type { SubjectId } from '../../content/types';
import { SUBJECT_INFO } from '../../content/metadata';
import { normalizeVietnamese } from '../../lib/search';

export const ReferenceView: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [activeTab, setActiveTab] = useState<'tables' | 'exercises' | 'code' | 'glossary'>('tables');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [glossaryQuery, setGlossaryQuery] = useState<string>('');
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const currentSubjectId: SubjectId = (subjectId?.toLowerCase() as SubjectId) || 'xs';
  const subject = subjects.find(s => s.id === currentSubjectId) || subjects[0];
  const sInfo = SUBJECT_INFO[subject.id];

  const toggleSolution = (exId: string) => {
    setRevealedSolutions(prev => ({
      ...prev,
      [exId]: !prev[exId]
    }));
  };

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Filter glossary
  const filteredGlossary = subject.glossary.filter(item => {
    if (!glossaryQuery.trim()) return true;
    const q = normalizeVietnamese(glossaryQuery);
    return normalizeVietnamese(item.term).includes(q) || normalizeVietnamese(item.meaning).includes(q);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-ink">
            Tra Cứu & Bài Tập: {subject.name}
          </h1>
        </div>

        {/* Subject tabs */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {(['xs', 'ml', 'dl', 'gt'] as SubjectId[]).map(sId => {
            const s = SUBJECT_INFO[sId];
            const isSelected = sId === subject.id;
            return (
              <Link
                key={sId}
                to={`/reference/${sId}`}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-ink text-white border-ink shadow-2xs font-bold'
                    : 'bg-surface border-border text-muted hover:text-ink'
                }`}
              >
                {s.name}
              </Link>
            );
          })}
        </div>

        {/* Content Type Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tables' ? 'bg-accent text-white' : 'text-muted hover:text-ink hover:bg-surface-muted'
            }`}
          >
            Bảng tra cứu & Sơ đồ ({subject.referenceSections.length})
          </button>

          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'exercises' ? 'bg-accent text-white' : 'text-muted hover:text-ink hover:bg-surface-muted'
            }`}
          >
            5 Bài tự kiểm tra có lời giải ({subject.exercises.length})
          </button>

          {subject.pythonExamples && subject.pythonExamples.length > 0 && (
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'code' ? 'bg-accent text-white' : 'text-muted hover:text-ink hover:bg-surface-muted'
              }`}
            >
              Mã Python mẫu ({subject.pythonExamples.length})
            </button>
          )}

          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'glossary' ? 'bg-accent text-white' : 'text-muted hover:text-ink hover:bg-surface-muted'
            }`}
          >
            Từ điển Anh–Việt ({subject.glossary.length} thuật ngữ)
          </button>
        </div>
      </div>

      {/* TAB 1: REFERENCE TABLES */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          {subject.referenceSections.map((sec, idx) => (
            <div key={idx} className="bg-surface border border-border rounded-xl p-5 shadow-2xs space-y-3">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <Table className="w-4 h-4 text-accent" />
                {sec.title}
              </h3>
              <div className="reader-content text-xs sm:text-sm overflow-x-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {sec.contentMarkdown}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: EXERCISES */}
      {activeTab === 'exercises' && (
        <div className="space-y-5">
          <div className="p-3 bg-surface-muted/60 border border-border rounded-xl text-xs text-muted flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent shrink-0" />
            <span>Hãy che lời giải, tự nhẩm tính hoặc viết nháp ra giấy trước khi bấm nút mở đối chiếu.</span>
          </div>

          {subject.exercises.map(ex => {
            const isRevealed = !!revealedSolutions[ex.id];
            return (
              <div key={ex.id} className="bg-surface border border-border rounded-xl p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-2 border-b border-border pb-2.5">
                  <h3 className="text-sm font-bold text-ink">
                    {ex.title}
                  </h3>
                  <button
                    onClick={() => toggleSolution(ex.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold hover:underline shrink-0"
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isRevealed ? 'Ẩn lời giải' : 'Xem lời giải'}</span>
                  </button>
                </div>

                {/* Problem text */}
                <div className="reader-content text-xs sm:text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {ex.questionMarkdown}
                  </ReactMarkdown>
                </div>

                {/* Collapsible Solution */}
                {isRevealed && (
                  <div className="p-4 bg-green-50/70 border border-green-200 rounded-lg space-y-1.5 text-xs sm:text-sm">
                    <span className="font-bold text-[#27624a] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Lời giải chi tiết:
                    </span>
                    <div className="text-ink leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {ex.solutionMarkdown}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: RUNNABLE PYTHON CODES (GT) */}
      {activeTab === 'code' && subject.pythonExamples && (
        <div className="space-y-6">
          {subject.pythonExamples.map((py, idx) => (
            <div key={idx} className="bg-surface border border-border rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-accent" />
                  {py.title}
                </h3>
                <button
                  onClick={() => copyCode(py.code, idx)}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-surface-muted hover:bg-border text-ink border border-border transition-colors"
                >
                  {copiedCodeIdx === idx ? <Check className="w-3.5 h-3.5 text-[#27624a]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCodeIdx === idx ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                </button>
              </div>

              {py.description && (
                <div className="text-xs text-muted">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {py.description}
                  </ReactMarkdown>
                </div>
              )}

              <div className="relative">
                <pre className="p-4 bg-[#1a221f] text-[#f0f4f2] rounded-xl overflow-x-auto text-xs font-mono leading-relaxed">
                  <code>{py.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: GLOSSARY */}
      {activeTab === 'glossary' && (
        <div className="space-y-4">
          {/* Glossary Search Box */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={glossaryQuery}
              onChange={e => setGlossaryQuery(e.target.value)}
              placeholder="Lọc thuật ngữ tiếng Anh hoặc nghĩa tiếng Việt..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-lg bg-surface focus:outline-hidden focus:border-accent"
            />
          </div>

          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-surface-muted border-b border-border text-ink font-bold">
                  <th className="p-3 w-1/3">Tiếng Anh</th>
                  <th className="p-3">Cách hiểu ngắn tiếng Việt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredGlossary.map((item, i) => (
                  <tr key={i} className="hover:bg-surface-muted/40 transition-colors">
                    <td className="p-3 font-semibold font-mono text-accent">
                      {item.term}
                    </td>
                    <td className="p-3 text-ink">
                      {item.meaning}
                    </td>
                  </tr>
                ))}
                {filteredGlossary.length === 0 && (
                  <tr>
                    <td colSpan={2} className="p-6 text-center text-muted">
                      Không tìm thấy thuật ngữ phù hợp với &ldquo;{glossaryQuery}&rdquo;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
