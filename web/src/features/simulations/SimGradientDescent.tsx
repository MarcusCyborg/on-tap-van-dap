import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, HelpCircle, Play, Pause, StepForward, AlertCircle, CheckCircle2 } from 'lucide-react';

export function computeLossAndGrad(w: number) {
  const loss = Math.pow(w - 3, 2);
  const grad = 2 * (w - 3);
  return { loss, grad };
}

export function takeGradientStep(w: number, lr: number) {
  const { loss, grad } = computeLossAndGrad(w);
  const nextW = w - lr * grad;
  return { nextW, loss, grad };
}

export const SimGradientDescent: React.FC = () => {
  const [w, setW] = useState<number>(1.0);
  const [lr, setLr] = useState<number>(0.1);
  const [history, setHistory] = useState<{ step: number; w: number; loss: number; grad: number }[]>([
    { step: 0, w: 1.0, ...computeLossAndGrad(1.0) }
  ]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [diverged, setDiverged] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopRun = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  };

  const doStep = () => {
    if (diverged) return;

    setW(prevW => {
      const { nextW, loss, grad } = takeGradientStep(prevW, lr);

      if (Math.abs(nextW) > 50 || isNaN(nextW) || !isFinite(nextW)) {
        setDiverged(true);
        stopRun();
        return nextW;
      }

      setHistory(prevHist => {
        if (prevHist.length >= 50) {
          stopRun();
          return prevHist;
        }
        return [...prevHist, { step: prevHist.length, w: nextW, loss, grad }];
      });

      return nextW;
    });
  };

  const toggleRun = () => {
    if (isRunning) {
      stopRun();
    } else {
      if (diverged || history.length >= 50) return;
      setIsRunning(true);
      timerRef.current = window.setInterval(() => {
        doStep();
      }, 350);
    }
  };

  const reset = (newW: number = 1.0, newLr: number = 0.1) => {
    stopRun();
    setW(newW);
    setLr(newLr);
    setDiverged(false);
    const { loss, grad } = computeLossAndGrad(newW);
    setHistory([{ step: 0, w: newW, loss, grad }]);
  };

  const { loss, grad } = computeLossAndGrad(w);

  // Plot dimensions
  const svgWidth = 500;
  const svgHeight = 200;
  // Domain of w: [-2, 8], range of loss: [0, 25]
  const toX = (val: number) => 30 + ((val + 2) / 10) * (svgWidth - 60);
  const toY = (val: number) => svgHeight - 30 - (val / 25) * (svgHeight - 60);

  // Generate curve L(w) = (w - 3)^2
  const curvePoints: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const curW = -2 + (i / 60) * 10;
    const curL = Math.min(26, Math.pow(curW - 3, 2));
    curvePoints.push(`${i === 0 ? 'M' : 'L'} ${toX(curW).toFixed(1)} ${toY(curL).toFixed(1)}`);
  }
  const pathD = curvePoints.join(' ');

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4 my-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-dl-light text-dl-dark border border-dl-border">
            Mô phỏng DL09, DL10, DL11 & DL13
          </span>
          <h3 className="text-base font-bold text-ink mt-1">
            Gradient Descent Tối ưu một Tham số L(w) = (w - 3)²
          </h3>
        </div>
        <button
          onClick={() => reset(1.0, 0.1)}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink border border-border rounded px-2.5 py-1 bg-surface-muted transition-colors"
          title="Đặt lại w=1.0, lr=0.1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt lại mặc định
        </button>
      </div>

      <div className="bg-dl-light/60 border border-dl-border rounded-lg p-3 text-sm text-ink flex gap-2">
        <HelpCircle className="w-4 h-4 text-xs shrink-0 mt-0.5" />
        <div>
          <strong>Câu hỏi gợi mở:</strong> Tốc độ học (Learning Rate) quá nhỏ, vừa vặn, bằng 1, hoặc lớn hơn 1 ảnh hưởng như thế nào đến khả năng hội tụ về cực tiểu toàn cục <code>w = 3</code>?
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="text-muted font-medium self-center">Kịch bản thử nghiệm:</span>
        <button
          onClick={() => reset(1.0, 0.1)}
          className={`px-2.5 py-1 rounded border ${
            lr === 0.1 && w === 1.0 ? 'bg-accent text-white border-accent' : 'bg-surface border-border hover:bg-surface-muted'
          }`}
        >
          1. Hội tụ mượt mà (lr = 0.1)
        </button>
        <button
          onClick={() => reset(1.0, 0.02)}
          className={`px-2.5 py-1 rounded border ${
            lr === 0.02 ? 'bg-accent text-white border-accent' : 'bg-surface border-border hover:bg-surface-muted'
          }`}
        >
          2. Học quá chậm (lr = 0.02)
        </button>
        <button
          onClick={() => reset(1.0, 1.0)}
          className={`px-2.5 py-1 rounded border ${
            lr === 1.0 ? 'bg-warning-ink text-white border-warning-ink' : 'bg-surface border-border hover:bg-surface-muted'
          }`}
        >
          3. Dao động nhảy cóc (lr = 1.0)
        </button>
        <button
          onClick={() => reset(1.0, 1.05)}
          className={`px-2.5 py-1 rounded border ${
            lr === 1.05 ? 'bg-danger-ink text-white border-danger-ink' : 'bg-surface border-border hover:bg-surface-muted'
          }`}
        >
          4. Phân kỳ văng ra ngoài (lr = 1.05)
        </button>
      </div>

      {/* SVG Curve & Ball */}
      <div className="bg-surface-muted rounded-lg p-3 border border-border">
        <div className="flex items-center justify-between text-xs text-muted mb-1 font-medium">
          <span>Hàm mất mát L(w) = (w - 3)², Cực tiểu tại w* = 3</span>
          <span className="font-mono">Bước: {history.length - 1} / 50</span>
        </div>

        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 max-w-full">
          {/* Coordinate axes */}
          <line x1="30" y1={toY(0)} x2={svgWidth - 30} y2={toY(0)} stroke="#aab4a8" strokeWidth="1.5" />
          <line x1={toX(3)} y1="20" x2={toX(3)} y2={svgHeight - 30} stroke="#27624a" strokeWidth="1" strokeDasharray="3 3" />
          <text x={toX(3)} y="15" fontSize="10" textAnchor="middle" fill="#27624a" fontWeight="bold">
            Cực tiểu w=3
          </text>

          {/* Loss Curve */}
          <path d={pathD} fill="none" stroke="#52615a" strokeWidth="2" />

          {/* Previous steps trajectory */}
          {history.length > 1 && (
            <polyline
              points={history
                .slice(-10)
                .map(h => `${toX(Math.max(-2, Math.min(8, h.w)))},${toY(Math.min(25, h.loss))}`)
                .join(' ')}
              fill="none"
              stroke="#8a4b16"
              strokeWidth="1.5"
              strokeDasharray="2 2"
              opacity="0.6"
            />
          )}

          {/* Current Ball */}
          {!diverged && Math.abs(w) <= 15 && (
            <g>
              <circle
                cx={toX(Math.max(-2, Math.min(8, w)))}
                cy={toY(Math.min(25, loss))}
                r="7"
                fill="#8a4b16"
                stroke="#fff"
                strokeWidth="2"
              />
              <text
                x={toX(Math.max(-2, Math.min(8, w)))}
                y={toY(Math.min(25, loss)) - 12}
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fill="#8a4b16"
              >
                w = {w.toFixed(2)}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Numerical Step Formula Display */}
      <div className="bg-surface border border-border p-3.5 rounded-lg text-xs space-y-1">
        <div className="font-semibold text-muted uppercase tracking-wider">Công thức cập nhật:</div>
        <div className="font-mono text-sm text-ink bg-surface-muted/60 p-2 rounded">
          w_mới = w - lr × ∇L(w)
          <br />
          w_mới = {w.toFixed(3)} - {lr} × ({grad.toFixed(3)}) = <strong>{(w - lr * grad).toFixed(3)}</strong>
        </div>
      </div>

      {/* Step & Run Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-muted/50 p-3 rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={doStep}
            disabled={isRunning || diverged || history.length >= 50}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold hover:bg-surface-muted disabled:opacity-50"
          >
            <StepForward className="w-3.5 h-3.5" />
            Một bước
          </button>
          <button
            onClick={toggleRun}
            disabled={diverged || history.length >= 50}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50 ${
              isRunning ? 'bg-danger-ink hover:bg-red-700' : 'bg-accent hover:bg-accent-dark'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Dừng lại
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Chạy tự động
              </>
            )}
          </button>
        </div>

        {/* Adjust LR */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-muted">Learning Rate:</span>
          <input
            type="number"
            min="0.001"
            max="2"
            step="0.05"
            value={lr}
            onChange={e => {
              const val = Number(e.target.value);
              if (!isNaN(val) && val > 0) setLr(val);
            }}
            disabled={isRunning}
            className="w-20 border border-border rounded px-2 py-1 font-mono text-center bg-surface"
            aria-label="Tốc độ học learning rate"
          />
        </div>
      </div>

      {/* Diverged Warning */}
      {diverged && (
        <div className="p-3 bg-red-50 border border-danger-ink/40 rounded-lg text-xs text-danger-ink flex gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong>Mô hình đã bị phân kỳ (Diverged)!</strong> Giá trị trọng số <code>|w| &gt; 50</code> vượt quá miền biểu diễn do Learning Rate quá lớn ({lr} &gt; 1). Các bước cập nhật không thu hẹp khoảng cách tới cực tiểu mà đẩy w ngày càng xa hơn ra vô cùng.
          </div>
        </div>
      )}

      {/* Conditional Conclusion */}
      <div className="bg-surface-muted p-3.5 rounded-lg text-xs sm:text-sm text-ink border-l-4 border-accent">
        <div className="font-semibold text-accent-dark flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          Nguyên lý Gradient Descent:
        </div>
        <p className="mt-1">
          - <strong>Dấu trừ trong cập nhật:</strong> Gradient chỉ hướng dốc tăng nhanh nhất. Để tìm cực tiểu của Loss, ta phải đi ngược chiều gradient: <code>w = w - lr × ∇L</code>.
          <br />
          - <strong>Preset w=1, lr=0.1:</strong> Đạo hàm tại w=1 là 2(1 - 3) = -4. Bước cập nhật tiếp theo: <code>1 - 0.1×(-4) = 1.4</code>. Nơ-ron đã tiến gần hơn về 3.
          <br />
          - <strong>Tại sao lr = 1 dao động:</strong> Khi lr = 1, bước nhảy bằng đúng 2(w - 3), khiến w nhảy từ 1 sang 5, rồi từ 5 ngược lại 1, lặp vô tận mà không hội tụ.
        </p>
      </div>
    </div>
  );
};
