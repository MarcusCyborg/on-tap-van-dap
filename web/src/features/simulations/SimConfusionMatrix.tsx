import React, { useState } from 'react';
import { RotateCcw, HelpCircle, AlertCircle, Filter } from 'lucide-react';

export interface Sample {
  id: number;
  actual: 0 | 1; // 1 = Spam / Positive, 0 = Normal / Negative
  score: number; // Model confidence [0, 1]
}

// 24 fixed illustrative samples representing both classes
export const ILLUSTRATIVE_SAMPLES: Sample[] = [
  { id: 1, actual: 1, score: 0.95 },
  { id: 2, actual: 1, score: 0.91 },
  { id: 3, actual: 1, score: 0.88 },
  { id: 4, actual: 1, score: 0.82 },
  { id: 5, actual: 0, score: 0.79 }, // High false positive candidate
  { id: 6, actual: 1, score: 0.75 },
  { id: 7, actual: 1, score: 0.71 },
  { id: 8, actual: 0, score: 0.68 },
  { id: 9, actual: 1, score: 0.64 },
  { id: 10, actual: 0, score: 0.58 },
  { id: 11, actual: 1, score: 0.55 },
  { id: 12, actual: 1, score: 0.51 },
  { id: 13, actual: 0, score: 0.48 },
  { id: 14, actual: 0, score: 0.42 },
  { id: 15, actual: 1, score: 0.39 }, // Low true positive candidate
  { id: 16, actual: 0, score: 0.35 },
  { id: 17, actual: 0, score: 0.31 },
  { id: 18, actual: 0, score: 0.28 },
  { id: 19, actual: 1, score: 0.22 }, // Missed false negative candidate
  { id: 20, actual: 0, score: 0.19 },
  { id: 21, actual: 0, score: 0.15 },
  { id: 22, actual: 0, score: 0.11 },
  { id: 23, actual: 0, score: 0.08 },
  { id: 24, actual: 0, score: 0.04 }
];

export function computeConfusionMetrics(samples: Sample[], threshold: number) {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;

  const sampleClassifications = samples.map(s => {
    const predicted = s.score >= threshold ? 1 : 0;
    let category: 'TP' | 'FP' | 'FN' | 'TN';

    if (s.actual === 1 && predicted === 1) {
      tp++;
      category = 'TP';
    } else if (s.actual === 0 && predicted === 1) {
      fp++;
      category = 'FP';
    } else if (s.actual === 1 && predicted === 0) {
      fn++;
      category = 'FN';
    } else {
      tn++;
      category = 'TN';
    }

    return { ...s, predicted, category };
  });

  const total = samples.length;
  const accuracy = total > 0 ? (tp + tn) / total : null;
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : null;
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : null;
  const f1 = (precision !== null && recall !== null && (precision + recall) > 0)
    ? (2 * precision * recall) / (precision + recall)
    : null;

  return {
    tp,
    fp,
    fn,
    tn,
    accuracy,
    precision,
    recall,
    f1,
    sampleClassifications
  };
}

export const SimConfusionMatrix: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(0.50);
  const [selectedCell, setSelectedCell] = useState<'ALL' | 'TP' | 'FP' | 'FN' | 'TN'>('ALL');

  const { tp, fp, fn, tn, accuracy, precision, recall, f1, sampleClassifications } =
    computeConfusionMetrics(ILLUSTRATIVE_SAMPLES, threshold);

  const reset = () => {
    setThreshold(0.50);
    setSelectedCell('ALL');
  };

  const filteredSamples = selectedCell === 'ALL'
    ? sampleClassifications
    : sampleClassifications.filter(s => s.category === selectedCell);

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4 my-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-ml-light text-ml-dark border border-ml-border">
            Mô phỏng ML29, ML30 & ML31
          </span>
          <h3 className="text-base font-bold text-ink mt-1">Confusion Matrix & Ngưỡng quyết định (Threshold)</h3>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink border border-border rounded px-2.5 py-1 bg-surface-muted transition-colors"
          title="Đặt lại ngưỡng 0.50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt lại mặc định
        </button>
      </div>

      <div className="bg-ml-light/60 border border-ml-border rounded-lg p-3 text-sm text-ink flex gap-2">
        <HelpCircle className="w-4 h-4 text-xs shrink-0 mt-0.5" />
        <div>
          <strong>Câu hỏi gợi mở:</strong> Khi bạn <strong>hạ thấp ngưỡng</strong> từ 0.80 xuống 0.30, điều gì xảy ra với số lượng ca bị bỏ sót (FN) và số ca báo động nhầm (FP)? Recall và Precision thay đổi như thế nào?
        </div>
      </div>

      {/* Threshold Slider */}
      <div className="bg-surface-muted/60 p-4 rounded-lg border border-border space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-ink">Ngưỡng quyết định phân loại (Threshold):</span>
          <span className="font-mono text-base font-bold text-accent">{threshold.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0.05"
          max="0.95"
          step="0.01"
          value={threshold}
          onChange={e => setThreshold(Number(e.target.value))}
          className="w-full accent-accent cursor-pointer"
          aria-label="Điều chỉnh ngưỡng quyết định threshold"
        />
        <div className="flex justify-between text-[11px] text-muted font-mono">
          <span>0.05 (Dễ dự đoán Dương)</span>
          <span>Mặc định: 0.50</span>
          <span>0.95 (Chỉ dự đoán Dương khi rất chắc)</span>
        </div>
      </div>

      {/* Confusion Matrix (Clickable cells) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-muted uppercase tracking-wider">
          <span>Ma trận nhầm lẫn (Click vào ô để lọc các mẫu tương ứng):</span>
          {selectedCell !== 'ALL' && (
            <button
              onClick={() => setSelectedCell('ALL')}
              className="text-accent underline lowercase font-normal"
            >
              Xem toàn bộ {sampleClassifications.length} mẫu
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          {/* TP */}
          <button
            onClick={() => setSelectedCell(selectedCell === 'TP' ? 'ALL' : 'TP')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedCell === 'TP'
                ? 'bg-green-100 border-[#27624a] ring-2 ring-[#27624a]'
                : 'bg-green-50/70 border-green-200 hover:bg-green-100/60'
            }`}
          >
            <div className="text-[11px] text-muted font-medium">True Positive (TP)</div>
            <div className="text-2xl font-bold font-mono text-[#27624a]">{tp}</div>
            <div className="text-[10px] text-muted">Dương thật & Đoán Dương</div>
          </button>

          {/* FP */}
          <button
            onClick={() => setSelectedCell(selectedCell === 'FP' ? 'ALL' : 'FP')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedCell === 'FP'
                ? 'bg-red-100 border-danger-ink ring-2 ring-danger-ink'
                : 'bg-red-50/70 border-red-200 hover:bg-red-100/60'
            }`}
          >
            <div className="text-[11px] text-danger-ink font-medium">False Positive (FP - Báo nhầm)</div>
            <div className="text-2xl font-bold font-mono text-danger-ink">{fp}</div>
            <div className="text-[10px] text-muted">Âm thật nhưng Đoán Dương</div>
          </button>

          {/* FN */}
          <button
            onClick={() => setSelectedCell(selectedCell === 'FN' ? 'ALL' : 'FN')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedCell === 'FN'
                ? 'bg-amber-100 border-warning-ink ring-2 ring-warning-ink'
                : 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/60'
            }`}
          >
            <div className="text-[11px] text-warning-ink font-medium">False Negative (FN - Bỏ sót)</div>
            <div className="text-2xl font-bold font-mono text-warning-ink">{fn}</div>
            <div className="text-[10px] text-muted">Dương thật nhưng Bỏ sót</div>
          </button>

          {/* TN */}
          <button
            onClick={() => setSelectedCell(selectedCell === 'TN' ? 'ALL' : 'TN')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedCell === 'TN'
                ? 'bg-blue-100 border-[#2b5c8f] ring-2 ring-[#2b5c8f]'
                : 'bg-blue-50/70 border-blue-200 hover:bg-blue-100/60'
            }`}
          >
            <div className="text-[11px] text-muted font-medium">True Negative (TN)</div>
            <div className="text-2xl font-bold font-mono text-[#2b5c8f]">{tn}</div>
            <div className="text-[10px] text-muted">Âm thật & Đoán Âm</div>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="p-3 bg-surface border border-border rounded-lg">
          <div className="text-xs text-muted font-medium">Precision (Độ chính xác)</div>
          <div className="text-xl font-bold font-mono text-ink mt-0.5">
            {precision !== null ? `${(precision * 100).toFixed(1)}%` : '—'}
          </div>
          <div className="text-[10px] text-muted">
            {precision !== null ? `TP / (TP + FP) = ${tp}/${tp + fp}` : 'Chưa đoán dương ca nào'}
          </div>
        </div>

        <div className="p-3 bg-surface border border-border rounded-lg">
          <div className="text-xs text-muted font-medium">Recall (Độ nhạy / Thu hồi)</div>
          <div className="text-xl font-bold font-mono text-[#27624a] mt-0.5">
            {recall !== null ? `${(recall * 100).toFixed(1)}%` : '—'}
          </div>
          <div className="text-[10px] text-muted">
            {recall !== null ? `TP / (TP + FN) = ${tp}/${tp + fn}` : 'Không có ca dương thật'}
          </div>
        </div>

        <div className="p-3 bg-surface border border-border rounded-lg">
          <div className="text-xs text-muted font-medium">F1-Score</div>
          <div className="text-xl font-bold font-mono text-[#8a4b16] mt-0.5">
            {f1 !== null ? `${(f1 * 100).toFixed(1)}%` : '—'}
          </div>
          <div className="text-[10px] text-muted">Trung bình điều hòa P & R</div>
        </div>

        <div className="p-3 bg-surface border border-border rounded-lg">
          <div className="text-xs text-muted font-medium">Accuracy (Độ chuẩn xác)</div>
          <div className="text-xl font-bold font-mono text-ink mt-0.5">
            {accuracy !== null ? `${(accuracy * 100).toFixed(1)}%` : '—'}
          </div>
          <div className="text-[10px] text-muted">
            (TP + TN) / Tổng = {tp + tn}/{sampleClassifications.length}
          </div>
        </div>
      </div>

      {/* Data Samples Table (Fall-back for accessibility and inspection) */}
      <div className="border border-border rounded-lg overflow-hidden bg-surface">
        <div className="p-2.5 bg-surface-muted border-b border-border text-xs flex justify-between items-center">
          <span className="font-semibold text-ink flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Danh sách mẫu {selectedCell !== 'ALL' ? `(Đang lọc: ${selectedCell})` : `(24 mẫu)`}:
          </span>
          <span className="text-muted text-[11px]">Dự đoán Dương khi Score ≥ {threshold.toFixed(2)}</span>
        </div>
        <div className="max-h-48 overflow-y-auto divide-y divide-border text-xs">
          {filteredSamples.map(s => {
            const isCorrect = s.actual === s.predicted;
            return (
              <div key={s.id} className="p-2 flex items-center justify-between hover:bg-surface-muted/40">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted w-6">#{s.id}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    s.category === 'TP' ? 'bg-green-100 text-[#27624a]' :
                    s.category === 'FP' ? 'bg-red-100 text-danger-ink' :
                    s.category === 'FN' ? 'bg-amber-100 text-warning-ink' :
                    'bg-blue-100 text-[#2b5c8f]'
                  }`}>
                    {s.category}
                  </span>
                  <span className="text-ink">
                    Thực tế: <strong>{s.actual === 1 ? 'Dương (1)' : 'Âm (0)'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-muted">Score: <strong>{s.score.toFixed(2)}</strong></span>
                  <span className={isCorrect ? 'text-[#27624a] font-semibold' : 'text-danger-ink font-semibold'}>
                    Đoán: {s.predicted === 1 ? 'Dương (1)' : 'Âm (0)'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conditional Explanation */}
      <div className="bg-surface-muted p-3.5 rounded-lg text-xs sm:text-sm text-ink border-l-4 border-accent">
        <div className="font-semibold text-accent-dark flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          Quy luật về ngưỡng phân loại:
        </div>
        <p className="mt-1">
          - <strong>Hạ thấp ngưỡng</strong> (sang trái) giúp mô hình dễ dự đoán Dương tính hơn → <strong>Recall tăng</strong> (giảm bỏ sót FN), nhưng thường làm <strong>báo động nhầm FP tăng</strong>.
          <br />
          - <strong>Nâng cao ngưỡng</strong> (sang phải) làm mô hình thận trọng hơn → chỉ dự đoán Dương khi rất tự tin → <strong>giảm báo nhầm FP</strong>, nhưng <strong>Recall giảm</strong> (bỏ sót FN tăng).
          <br />
          - <em>Lưu ý vấn đáp:</em> Recall luôn biến thiên đơn điệu theo ngưỡng trên tập cố định, nhưng <strong>Precision không bắt buộc biến thiên đơn điệu</strong> vì cả tử số (TP) và mẫu số (TP+FP) đều cùng thay đổi.
        </p>
      </div>
    </div>
  );
};
