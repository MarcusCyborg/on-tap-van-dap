import React, { useState } from 'react';
import { RotateCcw, HelpCircle, AlertCircle } from 'lucide-react';

export interface DataPoint {
  x: number;
  y: number;
}

// 12 Train points generated from y = sin(pi * x) + noise with fixed seed
export const TRAIN_POINTS: DataPoint[] = [
  { x: -0.90, y: -0.35 },
  { x: -0.75, y: -0.72 },
  { x: -0.55, y: -0.98 },
  { x: -0.35, y: -0.89 },
  { x: -0.15, y: -0.45 },
  { x: 0.05, y: 0.18 },
  { x: 0.25, y: 0.72 },
  { x: 0.45, y: 0.99 },
  { x: 0.65, y: 0.88 },
  { x: 0.80, y: 0.58 },
  { x: 0.92, y: 0.22 },
  { x: -0.05, y: -0.12 }
];

// 8 Validation points (fixed, unseen during fit)
export const VAL_POINTS: DataPoint[] = [
  { x: -0.82, y: -0.52 },
  { x: -0.45, y: -0.99 },
  { x: -0.25, y: -0.70 },
  { x: 0.15, y: 0.46 },
  { x: 0.35, y: 0.89 },
  { x: 0.55, y: 0.98 },
  { x: 0.72, y: 0.77 },
  { x: 0.85, y: 0.45 }
];

/**
 * Fit polynomial coefficients of degree `d` on `train` points using Ridge regression
 * (X^T * X + lambda * I)^(-1) * X^T * y with small lambda for numerical stability.
 */
export function fitPolynomial(points: DataPoint[], degree: number): number[] {
  const m = points.length;
  const n = degree + 1;
  const lambda = 1e-4; // small ridge stabilizer to prevent ill-conditioned inversion

  // Build Vandermonde matrix X [m x n] and y [m x 1]
  const X: number[][] = [];
  const y: number[] = [];

  for (const pt of points) {
    const row: number[] = [];
    let cur = 1;
    for (let j = 0; j <= degree; j++) {
      row.push(cur);
      cur *= pt.x;
    }
    X.push(row);
    y.push(pt.y);
  }

  // Compute A = X^T * X + lambda * I [n x n]
  const A: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const b: number[] = Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < m; k++) {
        sum += X[k][i] * X[k][j];
      }
      if (i === j) sum += lambda;
      A[i][j] = sum;
    }

    let bSum = 0;
    for (let k = 0; k < m; k++) {
      bSum += X[k][i] * y[k];
    }
    b[i] = bSum;
  }

  // Gaussian elimination with partial pivoting to solve A * weights = b
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }

    // Swap rows in A and b
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [b[i], b[maxRow]] = [b[maxRow], b[i]];

    // Zero out column below pivot
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[i][i]) < 1e-12) continue;
      const factor = A[k][i] / A[i][i];
      for (let j = i; j < n; j++) {
        A[k][j] -= factor * A[i][j];
      }
      b[k] -= factor * b[i];
    }
  }

  // Back substitution
  const weights: number[] = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = b[i];
    for (let j = i + 1; j < n; j++) {
      sum -= A[i][j] * weights[j];
    }
    weights[i] = Math.abs(A[i][i]) > 1e-12 ? sum / A[i][i] : 0;
  }

  return weights;
}

export function evalPoly(weights: number[], x: number): number {
  let res = 0;
  let term = 1;
  for (let i = 0; i < weights.length; i++) {
    res += weights[i] * term;
    term *= x;
  }
  return isFinite(res) ? res : 0;
}

export function computeMSE(points: DataPoint[], weights: number[]): number {
  if (points.length === 0) return 0;
  let sumSq = 0;
  for (const pt of points) {
    const pred = evalPoly(weights, pt.x);
    sumSq += Math.pow(pred - pt.y, 2);
  }
  return sumSq / points.length;
}

export const SimOverfitting: React.FC = () => {
  const [degree, setDegree] = useState<number>(3);

  const weights = fitPolynomial(TRAIN_POINTS, degree);
  const trainMSE = computeMSE(TRAIN_POINTS, weights);
  const valMSE = computeMSE(VAL_POINTS, weights);

  const reset = () => {
    setDegree(3);
  };

  // SVG dimensions
  const width = 500;
  const height = 240;
  const toSvgX = (x: number) => 30 + ((x + 1) / 2) * (width - 60);
  const toSvgY = (y: number) => height - 30 - ((y + 1.5) / 3) * (height - 60);

  // Generate polynomial curve path
  const curvePoints: string[] = [];
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const x = -1 + (i / steps) * 2;
    const y = evalPoly(weights, x);
    const clampedY = Math.max(-1.8, Math.min(1.8, y));
    const sx = toSvgX(x);
    const sy = toSvgY(clampedY);
    curvePoints.push(`${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
  }
  const pathD = curvePoints.join(' ');

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4 my-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-ml-light text-ml-dark border border-ml-border">
            Mô phỏng ML16, ML17 & ML18
          </span>
          <h3 className="text-base font-bold text-ink mt-1">Độ phức tạp mô hình, Underfitting & Overfitting</h3>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink border border-border rounded px-2.5 py-1 bg-surface-muted transition-colors"
          title="Đặt lại bậc 3"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt lại mặc định
        </button>
      </div>

      <div className="bg-ml-light/60 border border-ml-border rounded-lg p-3 text-sm text-ink flex gap-2">
        <HelpCircle className="w-4 h-4 text-xs shrink-0 mt-0.5" />
        <div>
          <strong>Câu hỏi gợi mở:</strong> Bậc đa thức nào (từ 1 đến 7) giúp khớp tập Train tốt nhất? Bậc nào cho kết quả tốt nhất trên tập Validation? Vì sao hai giá trị này có thể khác nhau?
        </div>
      </div>

      {/* Degree Selector Buttons */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-ink flex justify-between">
          <span>Chọn bậc đa thức (Độ phức tạp mô hình):</span>
          <span className="font-mono text-sm text-accent font-bold">Bậc {degree}</span>
        </label>
        <div className="grid grid-cols-7 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map(d => (
            <button
              key={d}
              onClick={() => setDegree(d)}
              className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                degree === d
                  ? 'bg-accent text-white border-accent shadow-sm'
                  : 'bg-surface border-border text-ink hover:bg-surface-muted'
              }`}
            >
              Bậc {d}
              <span className="block text-[10px] font-normal opacity-80">
                {d === 1 ? 'Tuyến tính' : d === 3 ? 'Cân bằng' : d >= 6 ? 'Phức tạp' : ''}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SVG Coordinate Space & Curve */}
      <div className="bg-surface-muted rounded-lg p-3 border border-border">
        <div className="flex items-center justify-between text-xs text-muted mb-1 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2b5c8f] inline-block"></span>
              Train (12 điểm)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8a4b16] inline-block"></span>
              Validation (8 điểm)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-0.5 bg-[#27624a] inline-block"></span>
              Đường dự đoán f(x)
            </span>
          </div>
          <span className="text-[11px] font-mono">Dữ liệu tổng hợp (Synthetic 1D)</span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 max-w-full">
          {/* Grid lines */}
          <line x1="30" y1={toSvgY(0)} x2={width - 30} y2={toSvgY(0)} stroke="#ccd5cb" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={toSvgX(0)} y1="30" x2={toSvgX(0)} y2={height - 30} stroke="#ccd5cb" strokeWidth="1" strokeDasharray="3 3" />

          {/* Fitted Polynomial Curve */}
          <path d={pathD} fill="none" stroke="#27624a" strokeWidth="2.5" />

          {/* Validation Points */}
          {VAL_POINTS.map((pt, i) => (
            <circle
              key={`val-${i}`}
              cx={toSvgX(pt.x)}
              cy={toSvgY(pt.y)}
              r="4.5"
              fill="#8a4b16"
              stroke="#fff"
              strokeWidth="1.5"
            />
          ))}

          {/* Train Points */}
          {TRAIN_POINTS.map((pt, i) => (
            <circle
              key={`tr-${i}`}
              cx={toSvgX(pt.x)}
              cy={toSvgY(pt.y)}
              r="4"
              fill="#2b5c8f"
              stroke="#fff"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      {/* MSE Comparison Row */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className={`p-3.5 rounded-lg border transition-all ${
          degree >= 5 ? 'bg-green-50/50 border-green-200' : 'bg-surface border-border'
        }`}>
          <div className="text-xs text-muted font-medium">Sai số Train (MSE Huấn luyện)</div>
          <div className="text-2xl font-bold font-mono text-[#2b5c8f] mt-0.5">
            {trainMSE.toFixed(4)}
          </div>
          <div className="text-[11px] text-muted mt-1">
            {degree === 1 ? 'Underfit: mô hình quá đơn giản' : degree >= 6 ? 'Khớp gần như tuyệt đối tập train' : 'Giảm dần khi tăng bậc'}
          </div>
        </div>

        <div className={`p-3.5 rounded-lg border transition-all ${
          valMSE > 0.08 && degree >= 5
            ? 'bg-red-50/50 border-danger-ink/40'
            : degree === 3 || degree === 4
            ? 'bg-green-50/50 border-green-200'
            : 'bg-surface border-border'
        }`}>
          <div className="text-xs text-muted font-medium">Sai số Validation (MSE Kiểm chứng)</div>
          <div className={`text-2xl font-bold font-mono mt-0.5 ${
            valMSE > 0.08 && degree >= 5 ? 'text-danger-ink' : 'text-[#8a4b16]'
          }`}>
            {valMSE.toFixed(4)}
          </div>
          <div className="text-[11px] text-muted mt-1">
            {degree >= 6
              ? 'Tăng vọt: Overfitting (mất tổng quát hóa)'
              : degree === 3 || degree === 4
              ? 'Tối ưu: sai số validation thấp nhất'
              : 'Cao do underfit'}
          </div>
        </div>
      </div>

      {/* Conditional Conclusion */}
      <div className="bg-surface-muted p-3.5 rounded-lg text-xs sm:text-sm text-ink border-l-4 border-accent">
        <div className="font-semibold text-accent-dark flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          Bài học kinh điển về Bias–Variance Tradeoff:
        </div>
        <p className="mt-1">
          {degree <= 2 ? (
            <>
              <strong>Bậc {degree} (Underfitting / High Bias):</strong> Mô hình đường thẳng/parabol quá cứng nhắc, không đủ năng lực biểu diễn dạng sóng của dữ liệu. Cả Train MSE và Validation MSE đều cao.
            </>
          ) : degree <= 4 ? (
            <>
              <strong>Bậc {degree} (Điểm cân bằng tốt):</strong> Mô hình học được đúng xu hướng tổng thể của hàm sóng mà không bị nhiễu chi phối. <strong>Validation MSE ({valMSE.toFixed(4)}) đạt mức thấp nhất</strong>.
            </>
          ) : (
            <>
              <strong>Bậc {degree} (Overfitting / High Variance):</strong> Mô hình đa thức bậc cao uốn lượn dữ dội để đi qua từng điểm Train (Train MSE giảm xuống <strong>{trainMSE.toFixed(4)}</strong>), nhưng lại sai lệch rất xa ở các điểm Validation chưa từng thấy (Validation MSE tăng vọt lên <strong>{valMSE.toFixed(4)}</strong>).
            </>
          )}
        </p>
      </div>
    </div>
  );
};
