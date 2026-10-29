import React, { useState } from 'react';
import { RotateCcw, HelpCircle, ArrowRight, Zap } from 'lucide-react';

export function calculateNeuron(
  x1: number,
  x2: number,
  w1: number,
  w2: number,
  b: number,
  activation: 'linear' | 'relu' | 'sigmoid'
) {
  // Linear combination
  const z = w1 * x1 + w2 * x2 + b;

  // Activation output
  let a = 0;
  if (activation === 'linear') {
    a = z;
  } else if (activation === 'relu') {
    a = Math.max(0, z);
  } else if (activation === 'sigmoid') {
    a = 1 / (1 + Math.exp(-z));
  }

  return { z, a };
}

export const SimNeuron: React.FC = () => {
  // Preset defaults: x1=2, x2=1, w1=3, w2=-1, b=0 -> z = 5
  const [x1, setX1] = useState<number>(2);
  const [x2, setX2] = useState<number>(1);
  const [w1, setW1] = useState<number>(3);
  const [w2, setW2] = useState<number>(-1);
  const [b, setB] = useState<number>(0);
  const [activation, setActivation] = useState<'linear' | 'relu' | 'sigmoid'>('relu');

  const { z, a } = calculateNeuron(x1, x2, w1, w2, b, activation);

  const reset = () => {
    setX1(2);
    setX2(1);
    setW1(3);
    setW2(-1);
    setB(0);
    setActivation('relu');
  };

  const loadNegativeZPreset = () => {
    setX1(1);
    setX2(4);
    setW1(1);
    setW2(-2);
    setB(0); // z = 1 - 8 = -7
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4 my-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-dl-light text-dl-dark border border-dl-border">
            Mô phỏng DL03, DL05 & DL06
          </span>
          <h3 className="text-base font-bold text-ink mt-1">Một Nơ-ron Nhân tạo Tính gì?</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadNegativeZPreset}
            className="text-xs text-muted hover:text-ink border border-border rounded px-2.5 py-1 bg-surface-muted transition-colors"
            title="Thử giá trị z âm để quan sát tính chất ReLU dập tắt về 0"
          >
            Thử ví dụ z &lt; 0
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink border border-border rounded px-2.5 py-1 bg-surface-muted transition-colors"
            title="Đặt lại x1=2, x2=1, w1=3, w2=-1, b=0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Đặt lại mặc định
          </button>
        </div>
      </div>

      <div className="bg-dl-light/60 border border-dl-border rounded-lg p-3 text-sm text-ink flex gap-2">
        <HelpCircle className="w-4 h-4 text-xs shrink-0 mt-0.5" />
        <div>
          <strong>Câu hỏi gợi mở:</strong> Nơ-ron nhận đầu vào và biến đổi qua trọng số, bias rồi hàm kích hoạt phi tuyến ra sao? Tại sao không được nhầm lẫn giá trị tuyến tính <code>z</code> với đầu ra kích hoạt <code>a</code>?
        </div>
      </div>

      {/* Visual Diagram */}
      <div className="bg-surface-muted/60 p-4 rounded-xl border border-border">
        <div className="text-xs text-muted font-semibold uppercase tracking-wider mb-3">
          Sơ đồ dòng chảy dữ liệu qua một Nơ-ron:
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center text-xs">
          {/* Inputs */}
          <div className="flex flex-col gap-2 w-full md:w-36">
            <div className="p-2.5 bg-surface border border-border rounded-lg shadow-sm">
              <span className="text-muted block text-[11px]">Đầu vào x₁</span>
              <span className="font-mono text-base font-bold text-ink">{x1}</span>
            </div>
            <div className="p-2.5 bg-surface border border-border rounded-lg shadow-sm">
              <span className="text-muted block text-[11px]">Đầu vào x₂</span>
              <span className="font-mono text-base font-bold text-ink">{x2}</span>
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-muted rotate-90 md:rotate-0 shrink-0" />

          {/* Summation Node (z) */}
          <div className="p-4 bg-surface border-2 border-border rounded-xl shadow-sm flex-1 w-full max-w-xs">
            <div className="text-muted font-semibold text-[11px]">Tổ hợp tuyến tính (Affine Sum)</div>
            <div className="font-mono text-xs text-muted mt-1">
              z = ({w1} × {x1}) + ({w2} × {x2}) + ({b})
            </div>
            <div className="text-3xl font-extrabold font-mono text-[#8a4b16] mt-1">
              z = {z.toFixed(2)}
            </div>
            <div className="text-[10px] text-muted mt-1">Tổng trọng số + bias</div>
          </div>

          <ArrowRight className="w-5 h-5 text-muted rotate-90 md:rotate-0 shrink-0" />

          {/* Activation Node (a) */}
          <div className="p-4 bg-dl-light border-2 border-dl-border rounded-xl shadow-sm flex-1 w-full max-w-xs">
            <div className="text-dl-dark font-semibold text-[11px] flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Kích hoạt ({activation.toUpperCase()})
            </div>
            <div className="font-mono text-xs text-muted mt-1">
              {activation === 'linear' && 'a = z'}
              {activation === 'relu' && 'a = max(0, z)'}
              {activation === 'sigmoid' && 'a = 1 / (1 + e⁻ᶻ)'}
            </div>
            <div className="text-3xl font-extrabold font-mono text-[#27624a] mt-1">
              a = {a.toFixed(4)}
            </div>
            <div className="text-[10px] text-muted mt-1">
              {activation === 'sigmoid'
                ? 'Đầu ra xác suất trong (0, 1)'
                : activation === 'relu'
                ? 'Đầu ra phi tuyến (không âm)'
                : 'Đầu ra tuyến tính'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls (Inputs, Weights, Bias, Activation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-surface p-4 rounded-xl border border-border">
        {/* Weights */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-ink block">Trọng số (Weights):</span>
          <div>
            <label className="text-[11px] text-muted flex justify-between">
              <span>Trọng số w₁:</span>
              <span className="font-mono font-bold text-ink">{w1}</span>
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={w1}
              onChange={e => setW1(Number(e.target.value))}
              className="w-full accent-[#8a4b16] cursor-pointer"
              aria-label="Trọng số w1"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted flex justify-between">
              <span>Trọng số w₂:</span>
              <span className="font-mono font-bold text-ink">{w2}</span>
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={w2}
              onChange={e => setW2(Number(e.target.value))}
              className="w-full accent-[#8a4b16] cursor-pointer"
              aria-label="Trọng số w2"
            />
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-ink block">Đầu vào (Inputs):</span>
          <div>
            <label className="text-[11px] text-muted flex justify-between">
              <span>Đầu vào x₁:</span>
              <span className="font-mono font-bold text-ink">{x1}</span>
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={x1}
              onChange={e => setX1(Number(e.target.value))}
              className="w-full accent-[#2b5c8f] cursor-pointer"
              aria-label="Đầu vào x1"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted flex justify-between">
              <span>Đầu vào x₂:</span>
              <span className="font-mono font-bold text-ink">{x2}</span>
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={x2}
              onChange={e => setX2(Number(e.target.value))}
              className="w-full accent-[#2b5c8f] cursor-pointer"
              aria-label="Đầu vào x2"
            />
          </div>
        </div>

        {/* Bias */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-ink block">Độ lệch (Bias b):</span>
          <div>
            <label className="text-[11px] text-muted flex justify-between">
              <span>Bias b:</span>
              <span className="font-mono font-bold text-ink">{b}</span>
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.5"
              value={b}
              onChange={e => setB(Number(e.target.value))}
              className="w-full accent-muted cursor-pointer"
              aria-label="Độ lệch bias b"
            />
          </div>
          <div className="text-[11px] text-muted">
            Bias dịch chuyển đường kích hoạt sang trái hoặc phải trên trục số.
          </div>
        </div>

        {/* Activation Function Choice */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-ink block">Hàm kích hoạt:</span>
          <div className="flex flex-col gap-1.5">
            {[
              { id: 'relu', label: 'ReLU: max(0, z)' },
              { id: 'sigmoid', label: 'Sigmoid: 1/(1+e⁻ᶻ)' },
              { id: 'linear', label: 'Linear: z (Tuyến tính)' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setActivation(opt.id as any)}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                  activation === opt.id
                    ? 'bg-dl-light text-dl-dark border-dl-border font-bold'
                    : 'bg-surface border-border text-muted hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conditional Conclusion */}
      <div className="bg-surface-muted p-3.5 rounded-lg text-xs sm:text-sm text-ink border-l-4 border-accent">
        <div className="font-semibold text-accent-dark">Ghi nhớ khi trả lời vấn đáp:</div>
        <p className="mt-1">
          - <strong>Tổ hợp tuyến tính:</strong> Nơ-ron trước hết tính <code>z = Σ wᵢxᵢ + b</code>. Nếu chỉ có bước này, dù xếp chồng bao nhiêu tầng nơ-ron cũng chỉ tương đương <em>một phép biến đổi affine duy nhất</em>.
          <br />
          - <strong>Hàm kích hoạt phi tuyến:</strong> Biến đổi <code>a = f(z)</code> cho phép mạng học các quan hệ phi tuyến phức tạp.
          <br />
          - <strong>Phân biệt z và a:</strong> Với <code>z = {z.toFixed(2)}</code>, đầu ra ReLU là <strong>{Math.max(0, z).toFixed(2)}</strong> (chặn số âm về 0), trong khi Sigmoid nén về <strong>{(1 / (1 + Math.exp(-z))).toFixed(4)}</strong> trong khoảng (0, 1). <em>Không bao giờ gọi đầu ra ReLU là xác suất!</em>
        </p>
      </div>
    </div>
  );
};
