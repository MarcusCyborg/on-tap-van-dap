import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Award,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  Check
} from 'lucide-react';
import { getExamSession, saveExamSession, loadUserData } from '../../lib/storage';
import type { ExamAttempt } from '../../content/types';
import { conceptMap } from '../../content/generated';

export const PracticeSessionView: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<ExamAttempt | undefined>(
    sessionId ? getExamSession(sessionId) : undefined
  );

  // Timer state
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = window.setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  if (!session) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-ink">Không tìm thấy lượt làm bài này</h2>
        <Link to="/practice" className="text-sm text-accent underline">Quay lại danh sách đề thi</Link>
      </div>
    );
  }

  const currentQIndex = session.currentIndex;
  const currentQ = session.questionData[currentQIndex];
  const isRevealed = !!session.revealedAnswers[currentQ?.id];
  const currentDraft = session.userDrafts[currentQ?.id] || '';
  const currentScore = session.scores[currentQ?.id];

  const updateSessionState = (updates: Partial<ExamAttempt>) => {
    const updated = { ...session, ...updates };
    setSession(updated);
    saveExamSession(updated);
  };

  const handleRevealAnswer = () => {
    updateSessionState({
      revealedAnswers: {
        ...session.revealedAnswers,
        [currentQ.id]: true
      }
    });
  };

  const handleDraftChange = (text: string) => {
    updateSessionState({
      userDrafts: {
        ...session.userDrafts,
        [currentQ.id]: text
      }
    });
  };

  const handleScore = (score: 0 | 1 | 2) => {
    updateSessionState({
      scores: {
        ...session.scores,
        [currentQ.id]: score
      }
    });
  };

  const goToNext = () => {
    if (currentQIndex < session.questionData.length - 1) {
      updateSessionState({ currentIndex: currentQIndex + 1 });
    } else {
      // Complete exam
      updateSessionState({
        status: 'completed',
        completedAt: new Date().toISOString()
      });
    }
  };

  const goToPrev = () => {
    if (currentQIndex > 0) {
      updateSessionState({ currentIndex: currentQIndex - 1 });
    }
  };

  // Timer formatter
  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ================= SUMMARY VIEW IF COMPLETED =================
  if (session.status === 'completed') {
    const totalQuestions = session.questionData.length;
    const scoredQuestions = Object.keys(session.scores).length;
    const skippedCount = totalQuestions - scoredQuestions;

    let totalPoints = 0;
    Object.values(session.scores).forEach(s => (totalPoints += s));
    const maxPoints = scoredQuestions * 2;
    const pct = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

    // Collect all related concepts needing review
    const reviewConceptIds = new Set<string>();
    session.questionData.forEach(q => {
      const score = session.scores[q.id];
      if (score === 0 || score === 1 || score === undefined) {
        if (q.relatedConceptIds) {
          q.relatedConceptIds.forEach(id => reviewConceptIds.add(id));
        }
      }
    });

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-extrabold text-ink">
            Kết Quả Lượt Vấn Đáp
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Hoàn thành trong <strong>{formatTime(seconds)}</strong> • Bạn đã tự đánh giá <strong>{scoredQuestions} / {totalQuestions}</strong> câu.
          </p>

          {/* Score Box */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
            <div className="p-3 bg-surface-muted rounded-xl">
              <span className="text-xs text-muted block">Tổng điểm</span>
              <span className="text-2xl font-extrabold font-mono text-ink">
                {totalPoints} / {maxPoints}
              </span>
            </div>
            <div className="p-3 bg-surface-muted rounded-xl">
              <span className="text-xs text-muted block">Tỷ lệ đạt</span>
              <span className="text-2xl font-extrabold font-mono text-accent">
                {pct}%
              </span>
            </div>
            <div className="p-3 bg-surface-muted rounded-xl">
              <span className="text-xs text-muted block">Bỏ qua</span>
              <span className="text-2xl font-extrabold font-mono text-muted">
                {skippedCount}
              </span>
            </div>
          </div>

          <div className="text-xs text-muted">
            * Điểm số chỉ tính trên các câu đã được tự chấm; câu bỏ qua không bị gán thành 0 điểm.
          </div>
        </div>

        {/* Detailed question review */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-ink">Chi tiết từng câu hỏi trong lượt:</h3>
          <div className="divide-y divide-border text-xs">
            {session.questionData.map((q, idx) => {
              const sc = session.scores[q.id];
              return (
                <div key={q.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-ink">
                      Câu {idx + 1}: {q.questionText}
                    </span>
                    {q.relatedConceptIds && q.relatedConceptIds.length > 0 && (
                      <div className="flex items-center gap-1.5 text-muted">
                        <span>Liên quan:</span>
                        {q.relatedConceptIds.map(rId => (
                          <Link key={rId} to={`/learn/${rId}`} className="font-mono text-accent underline">
                            {rId}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className={`px-2.5 py-1 rounded font-bold shrink-0 ${
                    sc === 2 ? 'bg-green-100 text-[#27624a]' :
                    sc === 1 ? 'bg-amber-100 text-warning-ink' :
                    sc === 0 ? 'bg-red-100 text-danger-ink' :
                    'bg-surface-muted text-muted'
                  }`}>
                    {sc === 2 ? '2 điểm (Vững)' : sc === 1 ? '1 điểm (Cần ôn)' : sc === 0 ? '0 điểm (Sai/Quên)' : 'Bỏ qua'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Concepts needing review */}
        {reviewConceptIds.size > 0 && (
          <div className="bg-surface-muted/60 border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-accent-dark uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-accent" />
              <span>Các concept bạn nên mở xem lại ngay:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Array.from(reviewConceptIds).map(cId => {
                const c = conceptMap.get(cId);
                return (
                  <Link
                    key={cId}
                    to={`/learn/${cId}`}
                    className="p-2.5 rounded-lg bg-surface border border-border hover:border-accent flex items-center justify-between transition-colors"
                  >
                    <span className="font-mono font-bold text-ink">{cId}: {c?.title || cId}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4">
          <Link
            to="/practice"
            className="text-xs font-semibold text-muted hover:text-ink flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Làm lượt khác
          </Link>
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent-dark"
          >
            Về trang chủ học tập
          </Link>
        </div>
      </div>
    );
  }

  // ================= ACTIVE SESSION RUNNER =================
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Session Progress Header */}
      <div className="bg-surface border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div>
          <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
            {session.type === 'preset' ? 'Đề thi chuẩn' : 'Luyện ngẫu nhiên'}
          </span>
          <h2 className="text-base font-extrabold text-ink">
            Câu {currentQIndex + 1} / {session.questionData.length}
          </h2>
        </div>

        {/* Timer Control */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-muted font-mono text-xs font-bold text-ink border border-border">
            <Clock className="w-3.5 h-3.5 text-muted" />
            <span>{formatTime(seconds)}</span>
          </div>

          <button
            onClick={() => setIsTimerRunning(prev => !prev)}
            className="p-1.5 rounded-lg border border-border bg-surface text-muted hover:text-ink"
            title={isTimerRunning ? 'Tạm dừng đồng hồ' : 'Tiếp tục bấm giờ'}
            aria-label={isTimerRunning ? 'Tạm dừng đồng hồ' : 'Tiếp tục bấm giờ'}
          >
            {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-surface border-2 border-border rounded-2xl p-5 sm:p-7 space-y-5 shadow-xs">
        <div className="space-y-2">
          <span className="text-xs font-bold text-muted uppercase tracking-wider block">
            {currentQ.title}
          </span>
          <h1 className="text-lg sm:text-xl font-extrabold text-ink leading-relaxed">
            {currentQ.questionText}
          </h1>
        </div>

        {/* User Scratchpad (Speaking practice) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted block">
            Ghi nháp các ý chính hoặc từ khóa (Tự trả lời miệng thành tiếng trước):
          </label>
          <textarea
            value={currentDraft}
            onChange={e => handleDraftChange(e.target.value)}
            placeholder="Tập giải thích: Định nghĩa → Ví dụ số nhỏ → Điều kiện bẫy..."
            rows={3}
            className="w-full text-xs font-sans border border-border rounded-lg p-3 bg-surface-muted/30 focus:outline-hidden focus:border-accent"
          />
        </div>

        {/* Reveal Answer Button or Revealed Hint Content */}
        {!isRevealed ? (
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleRevealAnswer}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-xs sm:text-sm font-bold hover:bg-accent-dark transition-all shadow-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Xem đáp án đối chiếu & Tiêu chí chấm</span>
            </button>
          </div>
        ) : (
          <div className="bg-surface-muted/70 border border-accent/30 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-accent uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Gợi ý & Đáp án đối chiếu:
              </span>
              <span className="text-[11px] text-muted font-normal lowercase">Đối chiếu với câu nói vừa rồi</span>
            </div>

            <div className="text-xs sm:text-sm text-ink leading-relaxed prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {currentQ.hintText}
              </ReactMarkdown>
            </div>

            {/* Rubric 0 / 1 / 2 self scoring */}
            <div className="pt-3 border-t border-border space-y-2">
              <span className="text-xs font-bold text-ink block">
                Tự chấm điểm cho câu trả lời của bạn:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleScore(0)}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                    currentScore === 0
                      ? 'bg-red-100 text-danger-ink border-danger-ink ring-2 ring-danger-ink/20 font-bold'
                      : 'bg-surface border-border text-muted hover:bg-surface-muted'
                  }`}
                >
                  <div className="font-bold">0 điểm</div>
                  <div className="text-[11px] opacity-80">Sai hoặc chưa nói được</div>
                </button>

                <button
                  onClick={() => handleScore(1)}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                    currentScore === 1
                      ? 'bg-amber-100 text-warning-ink border-warning-ink ring-2 ring-warning-ink/20 font-bold'
                      : 'bg-surface border-border text-muted hover:bg-surface-muted'
                  }`}
                >
                  <div className="font-bold">1 điểm</div>
                  <div className="text-[11px] opacity-80">Đúng ý nhưng chưa giải thích được</div>
                </button>

                <button
                  onClick={() => handleScore(2)}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                    currentScore === 2
                      ? 'bg-green-100 text-[#27624a] border-[#27624a] ring-2 ring-[#27624a]/20 font-bold'
                      : 'bg-surface border-border text-muted hover:bg-surface-muted'
                  }`}
                >
                  <div className="font-bold">2 điểm</div>
                  <div className="text-[11px] opacity-80">Đúng, có lý do / ví dụ cụ thể</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stepping controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={goToPrev}
          disabled={currentQIndex === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-muted disabled:opacity-40"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Câu trước
        </button>

        <button
          onClick={goToNext}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent-dark transition-all shadow-xs"
        >
          <span>{currentQIndex === session.questionData.length - 1 ? 'Hoàn thành lượt thi' : 'Câu tiếp theo'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
