import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Sparkles, Filter, Clock, ArrowRight, Play, BookOpen, AlertCircle } from 'lucide-react';
import { exams } from '../../content/generated';
import type { SubjectId, Priority } from '../../content/types';
import { createPresetExamSession, createCustomPracticeSession } from '../../lib/sampling';
import { saveExamSession, loadUserData } from '../../lib/storage';
import { SUBJECT_INFO } from '../../content/metadata';

export const PracticeHub: React.FC = () => {
  const navigate = useNavigate();

  // Custom generator state
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectId[]>(['xs', 'ml', 'dl', 'gt']);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>(['A']);
  const [onlyNeedsReview, setOnlyNeedsReview] = useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<5 | 7>(7);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startPresetExam = (examNumber: number) => {
    const session = createPresetExamSession(examNumber);
    saveExamSession(session);
    navigate(`/practice/${session.id}`);
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

  const startCustomExam = () => {
    setErrorMessage(null);
    if (selectedSubjects.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một chuyên đề.');
      return;
    }
    if (selectedPriorities.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất một mức ưu tiên.');
      return;
    }

    const res = createCustomPracticeSession({
      subjects: selectedSubjects,
      priorities: selectedPriorities,
      onlyNeedsReview,
      questionCount
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

      {/* Part 1: Four Preset Exams */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block"></span>
            1. Bốn Đề Tổng Hợp Có Sẵn (Mỗi Đề 7 Câu)
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

      {/* Part 2: Custom Random Round Generator */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="space-y-1 border-b border-border pb-3">
          <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            2. Tạo Lượt Luyện Tùy Biến (5 hoặc 7 Câu)
          </h2>
          <p className="text-xs text-muted">
            Chọn mảng, mức ưu tiên hoặc chỉ lấy các câu cần ôn lại. Lượt tổng hợp sẽ chọn ít nhất 1 câu cho mỗi mảng được chọn.
          </p>
        </div>

        {errorMessage && (
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
                onClick={() => setQuestionCount(5)}
                className={`flex-1 py-2 rounded-lg border font-bold text-xs transition-all ${
                  questionCount === 5 ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-muted hover:text-ink'
                }`}
              >
                5 câu
              </button>
              <button
                type="button"
                onClick={() => setQuestionCount(7)}
                className={`flex-1 py-2 rounded-lg border font-bold text-xs transition-all ${
                  questionCount === 7 ? 'bg-accent text-white border-accent' : 'bg-surface border-border text-muted hover:text-ink'
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
                checked={onlyNeedsReview}
                onChange={e => setOnlyNeedsReview(e.target.checked)}
                className="mt-0.5 rounded accent-accent"
              />
              <span className="text-ink leading-tight">
                Chỉ lấy trong các câu <strong>Cần ôn lại</strong> (Đã đánh dấu Chưa hiểu, Hiểu 1 phần, hoặc Bookmark).
              </span>
            </label>
          </div>
        </div>

        {/* Generate button */}
        <div className="pt-3 border-t border-border flex justify-end">
          <button
            onClick={startCustomExam}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-dark transition-all shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            Tạo và bắt đầu làm bài ngay
          </button>
        </div>
      </div>
    </div>
  );
};
