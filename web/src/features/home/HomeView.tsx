import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  Award,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Clock,
  FileText,
  HelpCircle,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { loadUserData, computeUserStats } from '../../lib/storage';
import type { UserStats } from '../../lib/storage';
import { subjects, conceptMap, exams } from '../../content/generated';
import { SUBJECT_INFO, SIMULATIONS_META } from '../../content/metadata';
import type { SubjectId } from '../../content/types';

export const HomeView: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(computeUserStats(loadUserData()));
  const [lastConceptId, setLastConceptId] = useState<string | undefined>(loadUserData().lastStudiedConceptId);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorage = () => {
      const data = loadUserData();
      setStats(computeUserStats(data));
      setLastConceptId(data.lastStudiedConceptId);
    };
    window.addEventListener('on-van-dap-storage-updated', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('on-van-dap-storage-updated', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const lastConcept = lastConceptId ? conceptMap.get(lastConceptId) : undefined;
  const isReturningUser = stats.totalRead > 0 || !!lastConcept;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phương pháp học vấn đáp từ số 0</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight leading-tight">
            Ôn Vấn Đáp — 140 Câu & 8 Mô Phỏng Trực Quan
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Chuẩn bị vấn đáp 5–7 câu về <strong>Xác suất thống kê</strong>, <strong>Machine Learning</strong>, <strong>Deep Learning</strong> và <strong>Giải thuật</strong>.
            Học theo chu trình: <em>Chọn concept → đọc hiểu → thử mô phỏng → đóng đáp án và tự trả lời → đối chiếu → đánh dấu phần cần ôn.</em>
          </p>

          {/* Call to action buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            {isReturningUser && lastConcept ? (
              <Link
                to={`/learn/${lastConcept.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-dark shadow-sm transition-all"
              >
                <span>Tiếp tục học: {lastConcept.id} — {lastConcept.title}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/learn/XS01"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-dark shadow-sm transition-all"
              >
                <span>Bắt đầu từ nền tảng (XS01)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              to="/guide"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-muted border border-border text-xs sm:text-sm font-semibold text-ink hover:bg-border/60 transition-colors"
            >
              <Compass className="w-4 h-4 text-muted" />
              <span>Bản đồ kiến thức & Lộ trình 4h</span>
            </Link>

            <Link
              to="/practice"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-muted border border-border text-xs sm:text-sm font-semibold text-ink hover:bg-border/60 transition-colors"
            >
              <Award className="w-4 h-4 text-warning-ink" />
              <span>Luyện đề thi thử</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Real Progress Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-surface border border-border rounded-xl">
          <span className="text-xs text-muted font-medium block">Tiến độ đã đọc</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-ink">{stats.totalRead}</span>
            <span className="text-xs text-muted font-mono">/ 140 câu</span>
          </div>
          <div className="w-full bg-surface-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-accent h-full rounded-full transition-all"
              style={{ width: `${(stats.totalRead / 140) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-surface border border-border rounded-xl">
          <span className="text-xs text-muted font-medium block">Tự tin giải thích</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-[#27624a]">
              {stats.understandingCounts.confident}
            </span>
            <span className="text-xs text-muted">câu</span>
          </div>
          <span className="text-[11px] text-muted block mt-2">Đã tự giải thích được</span>
        </div>

        <div className="p-4 bg-surface border border-border rounded-xl">
          <span className="text-xs text-muted font-medium block">Hiểu một phần</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-warning-ink">
              {stats.understandingCounts.partial}
            </span>
            <span className="text-xs text-muted">câu</span>
          </div>
          <span className="text-[11px] text-muted block mt-2">Cần ôn lại ví dụ/bẫy</span>
        </div>

        <Link
          to="/review"
          className="p-4 bg-amber-50/70 border border-warning-ink/30 rounded-xl hover:bg-amber-100/60 transition-colors block group"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-warning-ink">
            <span>Cần ôn lại</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-warning-ink">
              {stats.needsReviewCount}
            </span>
            <span className="text-xs text-muted">câu</span>
          </div>
          <span className="text-[11px] text-muted block mt-2">Đánh dấu hoặc chưa vững</span>
        </Link>
      </div>

      {/* 4 Subjects Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Bốn Chuyên Đề Cốt Lõi</h2>
          <span className="text-xs text-muted">Mỗi chuyên đề đúng 35 câu (18A • 12B • 5C)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map(subject => {
            const sInfo = SUBJECT_INFO[subject.id];
            return (
              <div
                key={subject.id}
                className="bg-surface border border-border rounded-xl p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-accent/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-0.5 rounded text-xs font-bold text-white"
                      style={{ backgroundColor: sInfo.color }}
                    >
                      {subject.name}
                    </span>
                    <span className="text-xs font-mono text-muted">35 câu</span>
                  </div>

                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    {subject.description}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-muted font-medium pt-1">
                    <span>Mức A: <strong>18 câu</strong></span>
                    <span>•</span>
                    <span>Mức B: <strong>12 câu</strong></span>
                    <span>•</span>
                    <span>Mức C: <strong>5 câu</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <Link
                    to={`/reference/${subject.id}`}
                    className="text-muted hover:text-ink flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Bài tập & Tra cứu</span>
                  </Link>

                  <Link
                    to={`/subjects/${subject.id}`}
                    className="font-bold text-accent hover:underline flex items-center gap-1"
                  >
                    Vào học <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8 Simulations Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-ink flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accent" />
              Tám Mô Phỏng Trực Quan Bắt Buộc
            </h2>
            <p className="text-xs text-muted">
              Mỗi mảng hai mô phỏng có tính toán thật, điều khiển tương tác và kết luận có điều kiện.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SIMULATIONS_META.map(sim => {
            const sInfo = SUBJECT_INFO[sim.subjectId];
            return (
              <Link
                key={sim.id}
                to={`/learn/${sim.conceptIds[0]}`}
                className="p-3.5 bg-surface border border-border rounded-xl hover:bg-surface-muted/60 transition-all flex flex-col justify-between group space-y-2 shadow-2xs"
              >
                <div className="space-y-1">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white inline-block"
                    style={{ backgroundColor: sInfo.color }}
                  >
                    {sInfo.shortName}
                  </span>
                  <h4 className="text-xs font-bold text-ink group-hover:text-accent leading-snug">
                    {sim.title}
                  </h4>
                  <p className="text-[11px] text-muted line-clamp-2">
                    {sim.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted font-mono pt-1 border-t border-border/50">
                  <span>{sim.conceptIds.join(', ')}</span>
                  <span className="text-accent font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                    Mở thử <ArrowRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4 Practice Exams Quick Access */}
      <div className="bg-surface-muted/60 border border-border rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-1.5">
              <Award className="w-4 h-4 text-accent" />
              Bốn Đề Vấn Đáp Tổng Hợp Thực Chiến
            </h2>
            <p className="text-xs text-muted">
              Đúng 7 câu xen kẽ 4 mảng, có gợi ý kiểm tra và rubric tự chấm 0 / 1 / 2.
            </p>
          </div>
          <Link to="/practice" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {exams.map(e => (
            <Link
              key={e.id}
              to="/practice"
              className="p-3.5 bg-surface border border-border rounded-xl hover:border-accent/40 transition-colors space-y-1 block shadow-2xs"
            >
              <div className="text-xs font-extrabold text-ink">
                Đề {e.number}
              </div>
              <div className="text-xs text-muted truncate">
                {e.subtitle}
              </div>
              <div className="text-[11px] text-accent font-medium pt-1">
                7 câu vấn đáp đối chiếu
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
