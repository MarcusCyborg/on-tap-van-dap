import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Sparkles, Filter, Clock, ArrowRight, Play, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { exams, dplChapters } from '../../content/generated';
import type { SubjectId, Priority, StudyLevel, CollectionId } from '../../content/types';
import { createPresetExamSession, createCustomPracticeSession } from '../../lib/sampling';
import { saveExamSession, loadUserData } from '../../lib/storage';
import { SUBJECT_INFO } from '../../content/metadata';

export const PracticeHub: React.FC = () => {
  const navigate = useNavigate();

  // Mode: 'dpl302m' (prioritized) vs 'foundations'
  const [practiceMode, setPracticeMode] = useState<CollectionId>('dpl302m');

  // DPL302m generator state
  const [selectedChapters, setSelectedChapters] = useState<string[]>(['dpl1', 'dpl2', 'dpl3', 'dpl4', 'dpl5']);
  const [selectedStudyLevels, setSelectedStudyLevels] = useState<StudyLevel[]>(['core']);
  const [dplNeedsReview, setDplNeedsReview] = useState<boolean>(false);
  const [dplQuestionCount, setDplQuestionCount] = useState<5 | 7>(5);

  // Foundations custom generator state
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectId[]>(['xs', 'ml', 'dl', 'gt']);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>(['A']);
  const [foundationsNeedsReview, setFoundationsNeedsReview] = useState<boolean>(false);
  const [foundationsQuestionCount, setFoundationsQuestionCount] = useState<5 | 7>(7);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startPresetExam = (examNumber: number) => {
    const session = createPresetExamSession(examNumber);
    saveExamSession(session);
    navigate(`/practice/${session.id}`);
  };

  const handleToggleChapter = (chId: string) => {
    setSelectedChapters(prev =>
      prev.includes(chId) ? prev.filter(id => id !== chId) : [...prev, chId]
    );
  };

  const handleToggleStudyLevel = (lvl: StudyLevel) => {
    setSelectedStudyLevels(prev =>
      prev.includes(lvl) ? prev.filter(x => x !== lvl) : [...prev, lvl]
    );
  };

  const handleToggleSubject = (sId: SubjectId) => {
    setSelectedSubjects(prev =>
      prev.includes(sId) ? prev.filter(id => id !== sId) : [...prev, sId]
    );
  };

  const handleTogglePriority = (p: Priority) => {
    setSelectedPriorities(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const startDplExam = () => {
    setErrorMessage(null);
    if (selectedChapters.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một chương DPL302m.');
      return;
    }
    if (selectedStudyLevels.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một mức học (Cốt lõi hoặc Đọc tiếp).');
      return;
    }

    const res = createCustomPracticeSession({
      collection: 'dpl302m',
      chapters: selectedChapters,
      studyLevels: selectedStudyLevels,
      onlyNeedsReview: dplNeedsReview,
      questionCount: dplQuestionCount
    });

    if (!res.success || !res.session) {
      setErrorMessage(res.message || 'Không thể tạo lượt luyện DPL302m với bộ lọc hiện tại.');
      return;
    }

    saveExamSession(res.session);
    navigate(`/practice/${res.session.id}`);
  };

  const startFoundationsExam = () => {
    setErrorMessage(null);
    if (selectedSubjects.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một chuyên đề nền tảng.');
      return;
    }
    if (selectedPriorities.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một mức ưu tiên.');
      return;
    }

    const res = createCustomPracticeSession({
      collection: 'foundations',
      subjects: selectedSubjects,
      priorities: selectedPriorities,
      onlyNeedsReview: foundationsNeedsReview,
      questionCount: foundationsQuestionCount
    });

    if (!res.success || !res.session) {
      setErrorMessage(res.message || 'Không thể tạo lượt luyện tập với bộ lọc hiện tại.');
      return;
    }

    saveExamSession(res.session);
    navigate(`/practice/${res.session.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-warning-ink" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-ink">
            Luyện Vấn Đáp Thực Chiến (5–7 Câu)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted">
          Rèn luyện khả năng nói thành tiếng và giải thích ví dụ trước khi xem gợi ý. Tự đánh giá theo thang điểm 0 / 1 / 2 sau mỗi câu.
        </p>
      </div>

      {/* Part 1: Prioritized DPL302m Custom Round */}
      <div className="bg-surface border-2 border-purple-300/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ưu tiên môn đang học</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-ink">
              Luyện Vấn Đáp DPL302m (5 hoặc 7 Câu Theo 5 Chương)
            </h2>
            <p className="text-xs text-muted">
              Chọn chương và mức học. Lượt tổng hợp 5–7 câu sẽ ưu tiên lấy tối thiểu 1 câu mỗi chương nếu đủ điều kiện trong pool.
            </p>
          </div>
        </div>

        {errorMessage && practiceMode === 'dpl302m' && (
          <div className="p-3 bg-red-50 border border-danger-ink/30 rounded-lg text-xs text-danger-ink flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Select DPL Chapters */}
          <div className="space-y-2">
            <span className="font-bold text-ink block">1. Chọn Chương DPL:</span>
            <div className="space-y-1.5">
              {dplChapters.map(ch => {
                const checked = selectedChapters.includes(ch.chapterId);
                return (
                  <label
                    key={ch.chapterId}
                    className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-surface-muted transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleChapter(ch.chapterId)}
                      className="rounded accent-purple-600"
                    />
                    <span className="text-ink font-medium truncate" title={ch.title}>
                      {ch.chapterId.toUpperCase()} ({ch.totalCount} câu)
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Select Study Level */}
          <div className="space-y-2">
            <span className="font-bold text-ink block">2. Mức học DPL:</span>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-surface-muted transition-colors">
                <input
                  type="checkbox"
                  checked={selectedStudyLevels.includes('core')}
                  onChange={() => handleToggleStudyLevel('core')}
                  className="rounded accent-purple-600"
                />
                <span className="text-ink font-medium">Cốt lõi (57 câu)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-surface-muted transition-colors">
                <input
                  type="checkbox"
                  checked={selectedStudyLevels.includes('further')}
                  onChange={() => handleToggleStudyLevel('further')}
                  className="rounded accent-purple-600"
                />
                <span className="text-ink font-medium">Đọc tiếp (15 câu)</span>
              </label>
            </div>
          </div>

          {/* Question Count */}
          <div className="space-y-2">
            <span className="font-bold text-ink block">3. Số lượng câu:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDplQuestionCount(5)}
                className={`flex-1 py-2 rounded-lg border font-bold text-xs transition-all ${
                  dplQuestionCount === 5
                    ? 'bg-purple-700 text-white border-purple-700 shadow-2xs'
                    : 'bg-surface border-border text-muted hover:text-ink'
                }`}
              >
                5 câu (1 câu/chương)
              </button>
              <button
                type="button"
                onClick={() => setDplQuestionCount(7)}
                className={`flex-1 py-2 rounded-lg border font-bold text-xs transition-all ${
                  dplQuestionCount === 7
                    ? 'bg-purple-700 text-white border-purple-700 shadow-2xs'
                    : 'bg-surface border-border text-muted hover:text-ink'
                }`}
              >
                7 câu
              </button>
            </div>
          </div>

          {/* Only Needs Review */}
          <div className="space-y-2">
            <span className="font-bold text-ink block">4. Phạm vi câu hỏi:</span>
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg bg-surface-muted/60 border border-border">
              <input
                type="checkbox"
                checked={dplNeedsReview}
                onChange={e => setDplNeedsReview(e.target.checked)}
                className="mt-0.5 rounded accent-purple-600"
              />
              <span className="text-ink leading-tight">
                Chỉ lấy trong các câu DPL <strong>Cần ôn lại</strong> (Đã đánh dấu Chưa hiểu, Hiểu 1 phần, hoặc Bookmark).
              </span>
            </label>
          </div>
        </div>

        {/* Generate button */}
        <div className="pt-3 border-t border-border flex justify-end">
          <button
            onClick={() => { setPracticeMode('dpl302m'); startDplExam(); }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-700 text-white text-sm font-bold hover:bg-purple-800 transition-all shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            Bắt đầu luyện DPL302m ngay
          </button>
        </div>
      </div>

      {/* Part 2: Four Preset Exams */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block"></span>
            Bốn Đề Tổng Hợp Có Sẵn: Nền Tảng Chung (Mỗi Đề 7 Câu)
          </h2>
          <p className="text-xs text-muted">
            Đề bài được biên soạn chuẩn theo cấu trúc phỏng vấn, liên kết bốn mảng và có tiêu chí chấm chi tiết.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map(e => (
            <div
              key={e.id}
              className="bg-surface border border-border rounded-xl p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-accent/40 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-ink">
                    Đề {e.number}
                  </span>
                  <span className="text-[11px] font-mono font-medium text-accent bg-accent/10 px-2 py-0.5 rounded">
                    7 câu • Tổng hợp 4 mảng
                  </span>
                </div>
                <h3 className="text-sm font-bold text-accent-dark">
                  {e.subtitle}
                </h3>
                <p className="text-xs text-muted">
                  Bao gồm các câu hỏi từ cả 4 mảng: Giải thuật, Xác suất, Machine Learning và Deep Learning.
                </p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" /> ~15-20 phút
                </span>
                <button
                  onClick={() => startPresetExam(e.number)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent-dark transition-all shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Bắt đầu làm Đề {e.number}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 3: Custom Random Round Generator (Foundations) */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="space-y-1 border-b border-border pb-3">
          <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            Luyện Tùy Biến: Nền Tảng Chung (4 Mảng)
          </h2>
          <p className="text-xs text-muted">
            Chọn mảng và mức ưu tiên trong 140 câu nền tảng (Xác suất, ML, DL, Giải thuật).
          </p>
        </div>

        {errorMessage && practiceMode === 'foundations' && (
          <div className="p-3 bg-red-50 border border-danger-ink/30 rounded-lg text-xs text-danger-ink flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Select Subjects */}
          <div className="space-y-2">
            <span className="font-bold text-ink block">1. Chọn Chuyên đề:</span>
            <div className="space-y-1.5">
              {(['xs', 'ml', 'dl', 'gt'] as SubjectId[]).map(sId => {
                const s = SUBJECT_INFO[sId];
                const checked = selectedSubjects.includes(sId);
                return (
                  <label
                    key={sId}
                    className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-surface-muted transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleSubject(sId)}
                      className="rounded accent-accent"
                    />
                    <span className="text-ink font-medium">{s.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Select Priorities */}
          <div className="space-y-2">
            <span className="font-bold text-ink block">2. Mức ưu tiên:</span>
            <div className="space-y-1.5">
              {[
                { p: 'A', label: 'Mức A: Nền tảng (72 câu)' },
                { p: 'B', label: 'Mức B: Mở rộng (48 câu)' },
                { p: 'C', label: 'Mức C: Nhận diện (20 câu)' }
              ].map(item => {
                const checked = selectedPriorities.includes(item.p as Priority);
                return (
                  <label
                    key={item.p}
                    className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-surface-muted transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleTogglePriority(item.p as Priority)}
                      className="rounded accent-accent"
                    />
                    <span className="text-ink font-medium">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Question Count & Scope */}
          <div className="space-y-2">
            <span className="font-bold text-ink block">3. Số lượng câu:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFoundationsQuestionCount(5)}
                className={`flex-1 py-2 rounded-lg border font-bold text-xs transition-all ${
                  foundationsQuestionCount === 5 ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-muted hover:text-ink'
                }`}
              >
                5 câu
              </button>
              <button
                type="button"
                onClick={() => setFoundationsQuestionCount(7)}
                className={`flex-1 py-2 rounded-lg border font-bold text-xs transition-all ${
                  foundationsQuestionCount === 7 ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-muted hover:text-ink'
                }`}
              >
                7 câu
              </button>
            </div>
          </div>

          {/* Only needs review toggle */}
          <div className="space-y-2">
            <span className="font-bold text-ink block">4. Phạm vi câu hỏi:</span>
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg bg-surface-muted/60 border border-border">
              <input
                type="checkbox"
                checked={foundationsNeedsReview}
                onChange={e => setFoundationsNeedsReview(e.target.checked)}
                className="mt-0.5 rounded accent-accent"
              />
              <span className="text-ink leading-tight">
                Chỉ lấy trong các câu <strong>Cần ôn lại</strong>.
              </span>
            </label>
          </div>
        </div>

        {/* Generate button */}
        <div className="pt-3 border-t border-border flex justify-end">
          <button
            onClick={() => { setPracticeMode('foundations'); startFoundationsExam(); }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-dark transition-all shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            Bắt đầu lượt nền tảng
          </button>
        </div>
      </div>
    </div>
  );
};
