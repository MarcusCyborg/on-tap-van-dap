import React, { useState } from 'react';
import { RotateCcw, HelpCircle, StepForward, CheckCircle2, AlertCircle, ArrowDown } from 'lucide-react';

export interface BinarySearchStep {
  stepIndex: number;
  left: number;
  right: number;
  mid: number;
  midVal: number;
  action: 'compare' | 'go_left' | 'go_right' | 'found' | 'not_found';
  explanation: string;
}

export function traceBinarySearch(arr: number[], target: number): BinarySearchStep[] {
  const steps: BinarySearchStep[] = [];
  let left = 0;
  let right = arr.length - 1;

  if (arr.length === 0) {
    steps.push({
      stepIndex: 1,
      left: 0,
      right: -1,
      mid: -1,
      midVal: 0,
      action: 'not_found',
      explanation: 'Mảng rỗng (0 phần tử). Kết thúc: Không tìm thấy mục tiêu.'
    });
    return steps;
  }

  let stepCount = 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = arr[mid];

    if (midVal === target) {
      steps.push({
        stepIndex: stepCount++,
        left,
        right,
        mid,
        midVal,
        action: 'found',
        explanation: `Xét mid = ${mid} (giá trị ${midVal}). midVal == target (${target})! Đã tìm thấy tại chỉ số ${mid}.`
      });
      return steps;
    } else if (midVal < target) {
      steps.push({
        stepIndex: stepCount++,
        left,
        right,
        mid,
        midVal,
        action: 'go_right',
        explanation: `Xét mid = ${mid} (giá trị ${midVal}). Vì ${midVal} < ${target}, toàn bộ nửa trái từ chỉ số 0 đến ${mid} bị loại bỏ. Cập nhật left = mid + 1 = ${mid + 1}.`
      });
      left = mid + 1;
    } else {
      steps.push({
        stepIndex: stepCount++,
        left,
        right,
        mid,
        midVal,
        action: 'go_left',
        explanation: `Xét mid = ${mid} (giá trị ${midVal}). Vì ${midVal} > ${target}, toàn bộ nửa phải từ chỉ số ${mid} đến ${right} bị loại bỏ. Cập nhật right = mid - 1 = ${mid - 1}.`
      });
      right = mid - 1;
    }
  }

  steps.push({
    stepIndex: stepCount,
    left,
    right,
    mid: -1,
    midVal: 0,
    action: 'not_found',
    explanation: `Không gian tìm kiếm thu hẹp rỗng (left=${left} > right=${right}). Kết luận: target ${target} không tồn tại trong mảng.`
  });

  return steps;
}

export const SimBinarySearch: React.FC = () => {
  // Preset defaults: arr = [1, 3, 5, 7, 9], target = 8
  const [arrayStr, setArrayStr] = useState<string>('1, 3, 5, 7, 9');
  const [targetStr, setTargetStr] = useState<string>('8');
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [sortWarning, setSortWarning] = useState<string | null>(null);

  // Parse array
  const rawNumbers = arrayStr
    .split(',')
    .map(s => Number(s.trim()))
    .filter(n => !isNaN(n));
  const target = Number(targetStr);

  // Check if sorted
  let isSorted = true;
  for (let i = 0; i < rawNumbers.length - 1; i++) {
    if (rawNumbers[i] > rawNumbers[i + 1]) {
      isSorted = false;
      break;
    }
  }

  const steps = (!isNaN(target) && isSorted) ? traceBinarySearch(rawNumbers, target) : [];

  const handleSortArray = () => {
    const sorted = [...rawNumbers].sort((a, b) => a - b);
    setArrayStr(sorted.join(', '));
    setSortWarning('Đã tự động sắp xếp mảng tăng dần để thỏa điều kiện tiền đề của Binary Search.');
    setCurrentStepIdx(0);
  };

  const reset = () => {
    setArrayStr('1, 3, 5, 7, 9');
    setTargetStr('8');
    setCurrentStepIdx(0);
    setSortWarning(null);
  };

  const currentStep = steps[currentStepIdx];

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4 my-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gt-light text-gt-dark border border-gt-border">
            Mô phỏng GT02, GT12 & GT13
          </span>
          <h3 className="text-base font-bold text-ink mt-1">
            Binary Search (Tìm kiếm Nhị phân) Từng bước
          </h3>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink border border-border rounded px-2.5 py-1 bg-surface-muted transition-colors"
          title="Đặt lại mảng [1, 3, 5, 7, 9] và target 8"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt lại mặc định
        </button>
      </div>

      <div className="bg-gt-light/60 border border-gt-border rounded-lg p-3 text-sm text-ink flex gap-2">
        <HelpCircle className="w-4 h-4 text-xs shrink-0 mt-0.5" />
        <div>
          <strong>Câu hỏi gợi mở:</strong> Khi tìm kiếm số <code>8</code> trong mảng <code>[1, 3, 5, 7, 9]</code>, các chỉ số <code>mid</code> lần lượt nhận những giá trị nào trước khi kết luận không tìm thấy?
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface-muted/50 p-3.5 rounded-lg border border-border">
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-ink flex justify-between">
            <span>Mảng số nguyên (phân cách bằng dấu phẩy):</span>
            {!isSorted && (
              <span className="text-danger-ink text-[11px] font-bold">Chưa sắp xếp tăng dần!</span>
            )}
          </label>
          <input
            type="text"
            value={arrayStr}
            onChange={e => {
              setArrayStr(e.target.value);
              setCurrentStepIdx(0);
              setSortWarning(null);
            }}
            className="w-full text-xs font-mono border border-border rounded px-2.5 py-1.5 bg-surface"
            aria-label="Nhập mảng số nguyên"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-ink">Mục tiêu tìm kiếm (Target):</label>
          <input
            type="number"
            value={targetStr}
            onChange={e => {
              setTargetStr(e.target.value);
              setCurrentStepIdx(0);
            }}
            className="w-full text-xs font-mono border border-border rounded px-2.5 py-1.5 bg-surface font-bold text-accent"
            aria-label="Nhập giá trị target cần tìm"
          />
        </div>
      </div>

      {/* Unsorted Array Warning & Quick Fix */}
      {!isSorted && (
        <div className="p-3 bg-red-50 border border-danger-ink/40 rounded-lg text-xs text-danger-ink flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Binary Search <strong>bắt buộc mảng đã được sắp xếp</strong>. Mảng hiện tại chưa có thứ tự!</span>
          </div>
          <button
            onClick={handleSortArray}
            className="px-2.5 py-1 rounded bg-danger-ink text-white font-semibold hover:bg-red-700 shrink-0"
          >
            Sắp xếp mảng ngay
          </button>
        </div>
      )}

      {sortWarning && (
        <div className="p-2.5 bg-amber-50 border border-warning-ink/30 rounded text-xs text-warning-ink">
          {sortWarning}
        </div>
      )}

      {/* Array Element Blocks Visualizer */}
      {isSorted && rawNumbers.length > 0 && currentStep && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-semibold text-ink">
              Trạng thái mảng tại Bước {currentStepIdx + 1} / {steps.length}:
            </span>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[#2b5c8f]">left = {currentStep.left}</span>
              <span className="text-[#8a4b16]">mid = {currentStep.mid !== -1 ? currentStep.mid : '—'}</span>
              <span className="text-[#27624a]">right = {currentStep.right}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 py-3 px-2 bg-surface border border-border rounded-lg justify-center overflow-x-auto">
            {rawNumbers.map((val, idx) => {
              const isMid = idx === currentStep.mid;
              const isLeft = idx === currentStep.left;
              const isRight = idx === currentStep.right;
              const isEliminated = idx < currentStep.left || idx > currentStep.right;

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-[10px] font-mono text-muted mb-1 flex gap-0.5">
                    {isLeft && <span className="text-[#2b5c8f] font-bold">L</span>}
                    {isMid && <span className="text-[#8a4b16] font-bold">M</span>}
                    {isRight && <span className="text-[#27624a] font-bold">R</span>}
                    {!isLeft && !isMid && !isRight && <span className="opacity-0">.</span>}
                  </div>

                  <div
                    className={`w-11 h-12 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm transition-all ${
                      isMid
                        ? currentStep.action === 'found'
                          ? 'bg-green-100 border-[#27624a] text-[#27624a] ring-2 ring-[#27624a]'
                          : 'bg-amber-100 border-[#8a4b16] text-[#8a4b16] ring-2 ring-[#8a4b16]'
                        : isEliminated
                        ? 'bg-surface-muted/50 border-border/60 text-muted/40 opacity-50'
                        : 'bg-surface border-border text-ink'
                    }`}
                  >
                    {val}
                  </div>

                  <span className="text-[10px] font-mono text-muted mt-1">[{idx}]</span>
                </div>
              );
            })}
          </div>

          {/* Current Step Explanation Box */}
          <div className="p-3 bg-surface border border-border rounded-lg text-xs flex gap-2 items-start">
            <ArrowDown className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-accent-dark">
                Giải thích bước {currentStep.stepIndex}:
              </span>
              <p className="text-ink">{currentStep.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stepping Navigation Controls */}
      {isSorted && steps.length > 0 && (
        <div className="flex items-center justify-between gap-3 bg-surface-muted/60 p-3 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
              disabled={currentStepIdx === 0}
              className="px-3 py-1.5 rounded bg-surface border border-border text-xs font-semibold hover:bg-surface-muted disabled:opacity-50"
            >
              Bước trước
            </button>
            <button
              onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStepIdx >= steps.length - 1}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-accent text-white text-xs font-semibold hover:bg-accent-dark disabled:opacity-50"
            >
              <StepForward className="w-3.5 h-3.5" />
              Bước tiếp
            </button>
          </div>

          <span className="text-xs text-muted font-mono">
            Bước {currentStepIdx + 1} / {steps.length}
          </span>
        </div>
      )}

      {/* Text log for accessibility & keyboard readers */}
      <div className="space-y-1">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">
          Nhật ký toàn bộ các bước (Text Log):
        </span>
        <div className="bg-surface border border-border rounded-lg p-2.5 max-h-36 overflow-y-auto text-xs space-y-1.5 font-mono">
          {steps.map((st, i) => (
            <div
              key={i}
              className={`p-1.5 rounded ${
                i === currentStepIdx ? 'bg-surface-muted font-bold text-ink' : 'text-muted'
              }`}
            >
              {st.stepIndex}. {st.explanation}
            </div>
          ))}
        </div>
      </div>

      {/* Conditional Conclusion */}
      <div className="bg-surface-muted p-3.5 rounded-lg text-xs sm:text-sm text-ink border-l-4 border-accent">
        <div className="font-semibold text-accent-dark flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          Điều kiện & Bẫy cần tránh khi vấn đáp:
        </div>
        <p className="mt-1">
          - <strong>Điều kiện tiên quyết:</strong> Mảng bắt buộc phải <strong>đã sắp xếp</strong> và cho phép <strong>truy cập ngẫu nhiên O(1)</strong> (như array, không phải linked list).
          <br />
          - <strong>Độ phức tạp:</strong> Mỗi bước loại bỏ một nửa số phần tử còn lại (n → n/2 → n/4 → ... → 1) nên số lần lặp tối đa là <code>⌊log₂ n⌋ + 1</code>, tức <strong>O(log n)</strong>.
          <br />
          - <strong>Preset [1, 3, 5, 7, 9], target 8:</strong> Lần lượt duyệt mid = 2 (5 &lt; 8) → mid = 3 (7 &lt; 8) → mid = 4 (9 &gt; 8) → kết thúc left &gt; right, không tìm thấy.
        </p>
      </div>
    </div>
  );
};
