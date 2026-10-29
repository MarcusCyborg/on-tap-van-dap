import React, { useState, useId } from 'react';
import { RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';

export function calculateStats(data: number[], isSample: boolean = false) {
  const n = data.length;
  if (n === 0) return { mean: 0, median: 0, variance: 0, sd: 0 };

  const sorted = [...data].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  let median = 0;
  const mid = Math.floor(n / 2);
  if (n % 2 !== 0) {
    median = sorted[mid];
  } else {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  }

  const sumSqDiff = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  const divisor = isSample ? Math.max(1, n - 1) : n;
  const variance = sumSqDiff / divisor;
  const sd = Math.sqrt(variance);

  return { mean, median, variance, sd };
}

export const SimMeanMedian: React.FC = () => {
  const [outlierVal, setOutlierVal] = useState<number>(10);
  const [isSample, setIsSample] = useState<boolean>(false);
  const sliderId = useId();

  const data = [1, 2, 3, 4, outlierVal];
  const { mean, median, variance, sd } = calculateStats(data, isSample);
  const sampleStats = calculateStats(data, true);
  const popStats = calculateStats(data, false);

  const reset = () => {
    setOutlierVal(10);
    setIsSample(false);
  };

  // Dot plot scaling: range [0, 100]
  const plotWidth = 500;
  const plotHeight = 70;
  const getX = (val: number) => 30 + (val / 100) * (plotWidth - 60);

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4 my-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-xs-light text-xs-dark border border-xs-border">
            Mô phỏng XS05 & XS06
          </span>
          <h3 className="text-base font-bold text-ink mt-1">Mean, Median và Ngoại lệ (Outlier)</h3>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink border border-border rounded px-2.5 py-1 bg-surface-muted transition-colors"
          title="Đặt lại về [1, 2, 3, 4, 10]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt lại mặc định
        </button>
      </div>

      <div className="bg-xs-light/60 border border-xs-border rounded-lg p-3 text-sm text-ink flex gap-2">
        <HelpCircle className="w-4 h-4 text-xs shrink-0 mt-0.5" />
        <div>
          <strong>Câu hỏi gợi mở:</strong> Khi kéo điểm cuối cùng ra rất xa (từ 10 lên 100), trung bình hay trung vị thay đổi mạnh hơn? Vì sao?
        </div>
      </div>

      {/* Visual Dot Plot */}
      <div className="bg-surface-muted rounded-lg p-3 overflow-x-auto">
        <div className="text-xs text-muted mb-1 font-medium">Trục số biểu diễn tập dữ liệu [1, 2, 3, 4, {outlierVal}]:</div>
        <svg viewBox={`0 0 ${plotWidth} ${plotHeight}`} className="w-full h-20 max-w-full">
          {/* Base Axis Line */}
          <line x1="30" y1="45" x2={plotWidth - 30} y2="45" stroke="#aab4a8" strokeWidth="2" />

          {/* Axis Ticks */}
          {[0, 20, 40, 60, 80, 100].map(tick => (
            <g key={tick}>
              <line x1={getX(tick)} y1="42" x2={getX(tick)} y2="48" stroke="#718279" strokeWidth="1.5" />
              <text x={getX(tick)} y="62" fontSize="10" textAnchor="middle" fill="#52615a">
                {tick}
              </text>
            </g>
          ))}

          {/* Data Points */}
          {[1, 2, 3, 4].map((pt, idx) => (
            <circle key={idx} cx={getX(pt)} cy="32" r="5" fill="#2b5c8f" opacity="0.8" />
          ))}
          {/* Outlier Point */}
          <circle cx={getX(outlierVal)} cy="32" r="6.5" fill="#a33c32" stroke="#fff" strokeWidth="1.5" />
          <text x={getX(outlierVal)} y="20" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#a33c32">
            {outlierVal}
          </text>

          {/* Median line */}
          <line x1={getX(median)} y1="15" x2={getX(median)} y2="45" stroke="#27624a" strokeWidth="2" strokeDasharray="3 3" />
          <text x={getX(median)} y="12" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#27624a">
            Median: {median}
          </text>

          {/* Mean line */}
          <line x1={getX(mean)} y1="28" x2={getX(mean)} y2="52" stroke="#8a4b16" strokeWidth="2" />
          <text x={getX(mean)} y="58" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#8a4b16">
            Mean: {mean.toFixed(1)}
          </text>
        </svg>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-surface border border-border p-3.5 rounded-lg">
        <div className="space-y-1.5">
          <label htmlFor={sliderId} className="text-xs font-semibold text-ink flex justify-between">
            <span>Kéo điểm ngoại lệ (4 → 100):</span>
            <span className="font-mono text-sm text-danger-ink font-bold">{outlierVal}</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id={sliderId}
              type="range"
              min="4"
              max="100"
              value={outlierVal}
              onChange={e => setOutlierVal(Number(e.target.value))}
              className="w-full accent-danger-ink cursor-pointer"
            />
            <input
              type="number"
              min="4"
              max="100"
              value={outlierVal}
              onChange={e => {
                const val = Number(e.target.value);
                if (!isNaN(val) && val >= 4 && val <= 100) setOutlierVal(val);
              }}
              className="w-16 border border-border rounded px-2 py-1 text-sm font-mono text-center bg-surface"
              aria-label="Nhập giá trị điểm ngoại lệ"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 justify-center">
          <span className="text-xs font-semibold text-muted">Phương pháp tính phương sai:</span>
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-surface-muted text-xs">
            <button
              onClick={() => setIsSample(false)}
              className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all ${
                !isSample ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              Phương sai tổng thể (chia n=5)
            </button>
            <button
              onClick={() => setIsSample(true)}
              className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all ${
                isSample ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              Phương sai mẫu (chia n-1=4)
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Result Display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-surface border border-border rounded-lg text-center">
          <div className="text-xs text-muted font-medium">Trung bình (Mean)</div>
          <div className="text-xl font-bold text-[#8a4b16] mt-0.5 font-mono">{mean.toFixed(2)}</div>
          <div className="text-[11px] text-muted mt-1">Tổng chia 5</div>
        </div>
        <div className="p-3 bg-surface border border-border rounded-lg text-center">
          <div className="text-xs text-muted font-medium">Trung vị (Median)</div>
          <div className="text-xl font-bold text-[#27624a] mt-0.5 font-mono">{median}</div>
          <div className="text-[11px] text-muted mt-1">Phần tử thứ 3</div>
        </div>
        <div className="p-3 bg-surface border border-border rounded-lg text-center">
          <div className="text-xs text-muted font-medium">
            Phương sai ({isSample ? 'mẫu s²' : 'tổng thể σ²'})
          </div>
          <div className="text-xl font-bold text-ink mt-0.5 font-mono">{variance.toFixed(2)}</div>
          <div className="text-[11px] text-muted mt-1">{isSample ? 'Chia n-1 = 4' : 'Chia n = 5'}</div>
        </div>
        <div className="p-3 bg-surface border border-border rounded-lg text-center">
          <div className="text-xs text-muted font-medium">
            Độ lệch chuẩn ({isSample ? 's' : 'σ'})
          </div>
          <div className="text-xl font-bold text-ink mt-0.5 font-mono">{sd.toFixed(2)}</div>
          <div className="text-[11px] text-muted mt-1">Căn bậc 2 phương sai</div>
        </div>
      </div>

      {/* Conditional Conclusion */}
      <div className="bg-surface-muted p-3.5 rounded-lg text-sm text-ink border-l-4 border-accent">
        <div className="font-semibold flex items-center gap-1.5 text-accent-dark">
          <CheckCircle2 className="w-4 h-4" />
          Kết luận quan sát:
        </div>
        <p className="mt-1 text-xs sm:text-sm text-ink">
          {outlierVal > 20 ? (
            <>
              Khi điểm cuối tăng lên <strong>{outlierVal}</strong>, trung bình bị kéo vọt lên <strong>{mean.toFixed(1)}</strong> (tăng gấp {(mean / 4).toFixed(1)} lần), trong khi trung vị vẫn <strong>giữ nguyên ở mức 3</strong>. Điều này chứng minh <strong>Median có tính bền vững (robust)</strong> trước các ngoại lệ cực đoan, còn <strong>Mean rất nhạy cảm</strong>.
            </>
          ) : (
            <>
              Tại giá trị mặc định 10, trung bình là <strong>4</strong>, trung vị là <strong>3</strong>, phương sai tổng thể là <strong>10</strong> và phương sai mẫu hiệu chỉnh là <strong>12.5</strong>. Khi kéo thanh trượt sang phải, quan sát trung bình dịch chuyển liên tục theo điểm ngoại lệ còn trung vị không đổi.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
