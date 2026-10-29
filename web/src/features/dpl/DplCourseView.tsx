import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  FileText,
  Clock,
  Award,
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { dplChapters, dplConcepts, conceptMap } from '../../content/generated';
import { loadUserData } from '../../lib/storage';

// 17 lessons mapping from DPL302m/README.md
const LESSON_MAPPING = [
  { lesson: '1.1', name: 'Introduction', concepts: ['DPL1-01', 'DL01', 'DL29'], coverage: 'Dữ liệu, ứng dụng và động lực của DL ở mức cơ bản' },
  { lesson: '1.2', name: 'Basic NN', concepts: ['DPL1-02', 'DPL1-03', 'DPL1-04', 'DPL1-05', 'DPL1-06', 'DPL1-07'], coverage: 'Logistic/BCE, computation graph, vectorization/broadcasting' },
  { lesson: '1.3', name: 'Shallow NN', concepts: ['DPL1-08', 'DPL1-09', 'DPL1-10', 'DPL1-11'], coverage: 'Một tầng ẩn, activation, backprop, phá đối xứng' },
  { lesson: '1.4', name: 'Deep NN', concepts: ['DPL1-07', 'DPL1-10', 'DPL1-11', 'DPL1-12'], coverage: 'Shape, cache, biểu diễn sâu, parameters/hyperparameters' },
  { lesson: '2.1', name: 'Practical aspects', concepts: ['DPL2-01', 'DPL2-02', 'DPL2-03', 'DPL2-04', 'DPL2-05', 'DPL2-06', 'DPL2-07', 'DPL2-08'], coverage: 'Quy trình dữ liệu và kỹ thuật huấn luyện cơ bản' },
  { lesson: '2.2', name: 'Optimization', concepts: ['DPL2-09', 'DPL2-10', 'DPL2-11', 'DPL2-12'], coverage: 'Mini-batch, EWMA, Momentum/RMSprop/Adam, decay' },
  { lesson: '2.3', name: 'Hyperparameters', concepts: ['DPL2-13', 'DPL2-14'], coverage: 'Tuning, BatchNorm, softmax, vai trò các API framework' },
  { lesson: '3.1', name: 'ML strategy', concepts: ['DPL3-01', 'DPL3-02', 'DPL3-03', 'DPL3-04'], coverage: 'Mục tiêu đo lường, dev/test, HLP và avoidable bias' },
  { lesson: '3.2', name: 'Error analysis', concepts: ['DPL3-05', 'DPL3-06', 'DPL3-07', 'DPL3-08', 'DPL3-09', 'DPL3-10'], coverage: 'Error analysis, label, training-dev, transfer/multitask/end-to-end' },
  { lesson: '4.1', name: 'CNN', concepts: ['DPL4-01', 'DPL4-02', 'DPL4-03', 'DPL4-04', 'DPL4-05'], coverage: 'Phép conv, shape/tham số, pooling và luồng ConvNet' },
  { lesson: '4.2', name: 'Case studies', concepts: ['DPL4-06', 'DPL4-07', 'DPL4-08', 'DPL4-09'], coverage: 'Ý tưởng chính của các kiến trúc; chưa học thuộc sơ đồ từng tầng' },
  { lesson: '4.3', name: 'Detection', concepts: ['DPL4-10', 'DPL4-11', 'DPL4-12', 'DPL4-13', 'DPL4-14'], coverage: 'Đầu ra, sliding window, YOLO, IoU/NMS, U-Net' },
  { lesson: '4.4', name: 'Face recognition', concepts: ['DPL4-15', 'DPL4-16', 'DPL4-17', 'DPL4-18'], coverage: 'Verification/recognition, Siamese/triplet, style, conv1D/3D' },
  { lesson: '5.1', name: 'RNN', concepts: ['DPL5-01', 'DPL5-02', 'DPL5-03', 'DPL5-04', 'DPL5-05', 'DPL5-06'], coverage: 'Chuỗi, RNN/BPTT, LSTM/GRU, sinh chuỗi' },
  { lesson: '5.2', name: 'NLP/embeddings', concepts: ['DPL5-07', 'DPL5-08', 'DPL5-09', 'DPL5-10'], coverage: 'Embedding/cosine, Word2Vec, negative sampling/GloVe' },
  { lesson: '5.3', name: 'Seq2Seq/attention', concepts: ['DPL5-11', 'DPL5-12', 'DPL5-13', 'DPL5-14'], coverage: 'Seq2Seq, decoding, đánh giá, attention và âm thanh ở mức nhập môn' },
  { lesson: '5.4', name: 'Transformer', concepts: ['DPL5-15', 'DPL5-16', 'DPL5-17', 'DPL5-18'], coverage: 'QKV, multi-head, positions/mask, cấu trúc và pretrained models' }
];

export const DplCourseView: React.FC = () => {
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

  // Compute DPL302m specific stats
  let dplTotalRead = 0;
  let dplCoreRead = 0;
  let dplFurtherRead = 0;
  let dplConfident = 0;
  let dplPartial = 0;
  let dplUnknown = 0;
  let dplReviewCount = 0;

  for (const c of dplConcepts) {
    const p = userData.conceptProgress[c.id];
    if (p?.readAt) {
      dplTotalRead++;
      if (c.studyLevel === 'core') dplCoreRead++;
      else dplFurtherRead++;
    }
    if (p?.understanding === 'confident') dplConfident++;
    else if (p?.understanding === 'partial') dplPartial++;
    else if (p?.understanding === 'unknown') dplUnknown++;

    if (p?.bookmarked || p?.understanding === 'unknown' || p?.understanding === 'partial') {
      dplReviewCount++;
    }
  }

  const coreTotal = 57;
  const furtherTotal = 15;
  const totalQuestions = 72;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
            <BrainCircuit className="w-4 h-4 text-purple-300" />
            <span>Môn học chính — DPL302m Deep Learning</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Khóa Học DPL302m — 72 Câu Theo 5 Chương
          </h1>

          <p className="text-sm opacity-90 leading-relaxed max-w-2xl">
            Biên soạn chuẩn theo 17 file text slide môn Deep Learning (DPL302m). Bao gồm <strong>57 câu Cốt lõi</strong>, <strong>15 câu Đọc tiếp</strong> và <strong>19 bài tự kiểm tra có lời giải chi tiết</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/learn/DPL1-01"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <span>Bắt đầu học Chương 1 (DPL1-01)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/practice"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-semibold transition-colors"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Luyện vấn đáp DPL302m</span>
            </Link>
          </div>
        </div>
      </div>

      {/* DPL Progress Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-surface border border-border rounded-xl">
          <span className="text-xs text-muted font-medium block">Tổng tiến độ DPL</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-purple-700">{dplTotalRead}</span>
            <span className="text-xs text-muted font-mono">/ {totalQuestions} câu</span>
          </div>
          <div className="w-full bg-surface-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all"
              style={{ width: `${(dplTotalRead / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-surface border border-border rounded-xl">
          <span className="text-xs text-muted font-medium block">Cốt lõi hoàn thành</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-[#27624a]">{dplCoreRead}</span>
            <span className="text-xs text-muted font-mono">/ {coreTotal} câu</span>
          </div>
          <div className="w-full bg-surface-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#27624a] h-full rounded-full transition-all"
              style={{ width: `${(dplCoreRead / coreTotal) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-surface border border-border rounded-xl">
          <span className="text-xs text-muted font-medium block">Đọc tiếp</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-[#2b5c8f]">{dplFurtherRead}</span>
            <span className="text-xs text-muted font-mono">/ {furtherTotal} câu</span>
          </div>
          <div className="w-full bg-surface-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#2b5c8f] h-full rounded-full transition-all"
              style={{ width: `${(dplFurtherRead / furtherTotal) * 100}%` }}
            />
          </div>
        </div>

        <Link
          to="/review"
          className="p-4 bg-amber-50/70 border border-warning-ink/30 rounded-xl hover:bg-amber-100/60 transition-colors block group"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-warning-ink">
            <span>DPL cần ôn lại</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold font-mono text-warning-ink">{dplReviewCount}</span>
            <span className="text-xs text-muted">câu</span>
          </div>
          <span className="text-[11px] text-muted block mt-2">Đánh dấu hoặc chưa vững</span>
        </Link>
      </div>

      {/* 5 Chapters Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-700" />
              Năm Chương Học DPL302m
            </h2>
            <p className="text-xs text-muted">
              Mỗi chương có câu hỏi, bài tập tự kiểm tra có lời giải và bảng thuật ngữ tra cứu.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dplChapters.map((ch, idx) => {
            const chapReadCount = ch.conceptIds.filter(id => userData.conceptProgress[id]?.readAt).length;
            const chapPct = Math.round((chapReadCount / ch.totalCount) * 100);

            return (
              <div
                key={ch.chapterId}
                className="bg-surface border border-border rounded-xl p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-purple-400 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      Chương {idx + 1}
                    </span>
                    <span className="text-xs font-mono text-muted">
                      {ch.totalCount} câu ({ch.coreCount} cốt lõi • {ch.furtherCount} đọc tiếp)
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-ink leading-snug line-clamp-2">
                    {ch.title}
                  </h3>

                  <div className="text-[11px] text-muted space-y-1">
                    <div><strong>Bài học nguồn:</strong> {ch.sourceLessons.map(l => `Bài ${l}`).join(', ')}</div>
                    <div><strong>Bài tự kiểm tra:</strong> {ch.exercises.length} bài có lời giải</div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                      <span>Tiến độ đã đọc</span>
                      <span>{chapReadCount} / {ch.totalCount} ({chapPct}%)</span>
                    </div>
                    <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all"
                        style={{ width: `${chapPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted text-[11px]">
                    {ch.idPrefix}01 – {ch.idPrefix}{ch.totalCount.toString().padStart(2, '0')}
                  </span>
                  <Link
                    to={`/dpl302m/${ch.chapterId}`}
                    className="font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                  >
                    Vào học <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson to Concept Mapping Table */}
      <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 space-y-4 shadow-2xs">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-700" />
            Bảng Nối 17 Bài Học Nguồn Với Câu Hỏi Vấn Đáp
          </h2>
          <p className="text-xs text-muted">
            Tra cứu trực tiếp từ bài giảng trên lớp (1.1 → 5.4) sang câu hỏi cần ôn, không cần tạo bản sao nội dung.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60 text-muted font-bold">
                <th className="py-2.5 px-3 whitespace-nowrap">Bài nguồn</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Câu nên đọc</th>
                <th className="py-2.5 px-3">Mức bao phủ trọng tâm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LESSON_MAPPING.map((item, i) => (
                <tr key={i} className="hover:bg-surface-muted/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-ink whitespace-nowrap">
                    Bài {item.lesson} ({item.name})
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {item.concepts.map(cId => (
                        <Link
                          key={cId}
                          to={`/learn/${cId}`}
                          className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 hover:bg-purple-200 border border-purple-200 text-[11px]"
                        >
                          {cId}
                        </Link>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-muted leading-relaxed">
                    {item.coverage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
