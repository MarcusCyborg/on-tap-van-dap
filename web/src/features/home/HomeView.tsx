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
  BrainCircuit,
  Layers,
  ChevronRight
} from 'lucide-react';
import { loadUserData, computeUserStats } from '../../lib/storage';
import type { UserStats } from '../../lib/storage';
import { subjects, conceptMap, exams, dplChapters } from '../../content/generated';
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
            Ôn Vấn Đáp — 212 Câu Hỏi & 8 Mô Phỏng Trực Quan
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed">
            Ưu tiên chuẩn bị cho môn <strong>Deep Learning (DPL302m)</strong> với 72 câu theo 5 chương, cùng 140 câu <strong>Nền tảng chung</strong> (Xác suất, ML, DL, Giải thuật).
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
              <>
                <Link
                  to="/learn/DPL1-01"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 text-white text-sm font-bold hover:bg-purple-800 shadow-sm transition-all"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>Vào học DPL302m (DPL1-01)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/learn/XS01"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-semibold text-ink hover:bg-surface-muted transition-colors"
                >
                  <span>Bắt đầu từ nền tảng (XS01)</span>
                </Link>
              </>
            )}

            <Link
              to="/guide"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-muted border border-border text-xs sm:text-sm font-semibold text-ink hover:bg-border/60 transition-colors"
            >
              <Compass className="w-4 h-4 text-muted" />
              <span>Bản đồ kiến thức & Lộ trình</span>
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

      {/* PRIORITIZED DPL302M FEATURE CARD */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Khóa học trọng tâm</span>
            </div>
            <h2 className="text-xl font-extrabold text-ink">
              Deep Learning — DPL302m
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              72 câu theo 5 chương (57 Cốt lõi • 15 Đọc tiếp) • 19 bài tự kiểm tra có lời giải bám sát 17 slide bài giảng.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/dpl302m"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 text-white text-xs sm:text-sm font-bold hover:bg-purple-800 shadow-sm transition-all"
            >
              <span>Vào khóa học DPL302m</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 5 Chapters quick pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
          {dplChapters.map((ch, idx) => {
            const chapRead = ch.conceptIds.filter(id => loadUserData().conceptProgress[id]?.readAt).length;
            return (
              <Link
                key={ch.chapterId}
                to={`/dpl302m/${ch.chapterId}`}
                className="p-3 bg-surface border border-purple-200/80 rounded-xl hover:border-purple-400 hover:shadow-2xs transition-all space-y-1.5 block group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-800 font-mono">
                    CHƯƠNG {idx + 1}
                  </span>
                  <span className="text-[10px] font-mono text-muted">
                    {chapRead}/{ch.totalCount}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-ink group-hover:text-purple-700 line-clamp-1 leading-snug">
                  {ch.title.split('—')[1]?.trim() || ch.title}
                </h4>
                <div className="text-[10px] text-muted">
                  {ch.coreCount} cốt lõi • {ch.furtherCount} đọc tiếp
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Real Progress Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-surface border border-border rounded-xl">
          <span className="text-xs text-muted font-medium block">DPL302m đã đọc</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-purple-700">{stats.dpl302mRead}</span>
            <span className="text-xs text-muted font-mono">/ 72 câu</span>
          </div>
          <div className="w-full bg-surface-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all"
              style={{ width: `${(stats.dpl302mRead / 72) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-surface border border-border rounded-xl">
          <span className="text-xs text-muted font-medium block">Nền tảng chung</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-ink">{stats.foundationsRead}</span>
            <span className="text-xs text-muted font-mono">/ 140 câu</span>
          </div>
          <div className="w-full bg-surface-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-accent h-full rounded-full transition-all"
              style={{ width: `${(stats.foundationsRead / 140) * 100}%` }}
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

      {/* 4 Foundation Subjects Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Nền Tảng Chung — Bốn Chuyên Đề Cốt Lõi</h2>
            <p className="text-xs text-muted">Mỗi chuyên đề đúng 35 câu (18A • 12B • 5C) • 20 bài tự kiểm tra và 4 đề tổng hợp.</p>
          </div>
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
              Tám Mô Phỏng Trực Quan Tương Tác
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
