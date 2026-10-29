import React, { useState } from 'react';
import { RotateCcw, HelpCircle, AlertCircle, Info } from 'lucide-react';

export function calculateBayes(
  prevalence: number, // 0 to 1
  sensitivity: number, // 0 to 1
  fpr: number, // 0 to 1
  population: number = 10000
) {
  const diseased = population * prevalence;
  const healthy = population * (1 - prevalence);

  const tp = diseased * sensitivity;
  const fn = diseased * (1 - sensitivity);
  const fp = healthy * fpr;
  const tn = healthy * (1 - fpr);

  const totalPositive = tp + fp;
  const posterior = totalPositive > 0 ? (tp / totalPositive) : null;

  return {
    population,
    diseased,
    healthy,
    tp,
    fn,
    fp,
    tn,
    totalPositive,
    posterior
  };
}

export const SimBayes: React.FC = () => {
  // Default preset: p = 1% (0.01), sensitivity = 90% (0.9), fpr = 10% (0.1)
  const [prevalencePct, setPrevalencePct] = useState<number>(1);
  const [sensitivityPct, setSensitivityPct] = useState<number>(90);
  const [fprPct, setFprPct] = useState<number>(10);

  const p = prevalencePct / 100;
  const sens = sensitivityPct / 100;
  const fpr = fprPct / 100;

  const stats = calculateBayes(p, sens, fpr, 10000);

  const reset = () => {
    setPrevalencePct(1);
    setSensitivityPct(90);
    setFprPct(10);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4 my-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-xs-light text-xs-dark border border-xs-border">
            Mô phỏng XS11, XS12 & XS13
          </span>
          <h3 className="text-base font-bold text-ink mt-1">Bayes và Nghịch lý Tỷ lệ nền (Base Rate Fallacy)</h3>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink border border-border rounded px-2.5 py-1 bg-surface-muted transition-colors"
          title="Đặt lại về p=1%, Độ nhạy=90%, Dương tính giả=10%"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt lại mặc định
        </button>
      </div>

      <div className="bg-xs-light/60 border border-xs-border rounded-lg p-3 text-sm text-ink flex gap-2">
        <HelpCircle className="w-4 h-4 text-xs shrink-0 mt-0.5" />
        <div>
          <strong>Câu hỏi gợi mở:</strong> Một xét nghiệm có độ nhạy rất cao (90%), nhưng vì sao khi nhận kết quả dương tính, xác suất một người thực sự mắc bệnh lại chỉ có khoảng <strong>8.33%</strong>?
        </div>
      </div>

      {/* 3 Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-muted/60 p-3.5 rounded-lg border border-border">
        {/* Prevalence */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-ink">1. Tỷ lệ mắc (P(Bệnh)):</span>
            <span className="font-mono text-accent font-bold">{prevalencePct.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="20"
            step="0.1"
            value={prevalencePct}
            onChange={e => setPrevalencePct(Number(e.target.value))}
            className="w-full accent-accent cursor-pointer"
            aria-label="Tỷ lệ mắc bệnh trong quần thể"
          />
          <div className="text-[11px] text-muted">Tỷ lệ người thực sự có bệnh trong cộng đồng (tỷ lệ nền).</div>
        </div>

        {/* Sensitivity */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-ink">2. Độ nhạy (P(+ | Bệnh)):</span>
            <span className="font-mono text-xs-dark font-bold">{sensitivityPct.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="99.9"
            step="0.5"
            value={sensitivityPct}
            onChange={e => setSensitivityPct(Number(e.target.value))}
            className="w-full accent-xs-dark cursor-pointer"
            aria-label="Độ nhạy của xét nghiệm"
          />
          <div className="text-[11px] text-muted">Khả năng test báo dương tính khi người đó thật sự có bệnh.</div>
        </div>

        {/* False Positive Rate */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-ink">3. Dương tính giả (P(+ | Khỏe)):</span>
            <span className="font-mono text-danger-ink font-bold">{fprPct.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="30"
            step="0.5"
            value={fprPct}
            onChange={e => setFprPct(Number(e.target.value))}
            className="w-full accent-danger-ink cursor-pointer"
            aria-label="Tỷ lệ dương tính giả"
          />
          <div className="text-[11px] text-muted">Tỷ lệ test báo dương tính nhầm ở người hoàn toàn khỏe mạnh.</div>
        </div>
      </div>

      {/* 2x2 Contingency Table for N = 10,000 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">
            Bảng phân loại trên quần thể giả định N = 10.000 người:
          </span>
          <span className="text-xs text-muted">Đơn vị: người (kỳ vọng)</span>
        </div>

        <div className="overflow-x-auto border border-border rounded-lg bg-surface">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-surface-muted border-b border-border text-ink">
                <th className="p-2.5 font-bold">Thực tế \ Kết quả xét nghiệm</th>
                <th className="p-2.5 font-bold text-accent">Dương tính (+)</th>
                <th className="p-2.5 font-bold text-muted">Âm tính (-)</th>
                <th className="p-2.5 font-bold">Tổng số thực tế</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-2.5 font-semibold bg-surface-muted/40 text-danger-ink">Có bệnh</td>
                <td className="p-2.5 font-mono font-bold bg-green-50/60 text-[#1b6b68]">
                  TP = {stats.tp.toFixed(1)}
                  <span className="block text-[10px] text-muted font-normal">Dương tính thật</span>
                </td>
                <td className="p-2.5 font-mono text-muted">
                  FN = {stats.fn.toFixed(1)}
                  <span className="block text-[10px] text-muted font-normal">Bỏ sót</span>
                </td>
                <td className="p-2.5 font-mono font-semibold">{stats.diseased.toFixed(0)} người</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold bg-surface-muted/40 text-accent">Khỏe mạnh</td>
                <td className="p-2.5 font-mono font-bold bg-red-50/60 text-danger-ink">
                  FP = {stats.fp.toFixed(1)}
                  <span className="block text-[10px] text-muted font-normal">Báo động nhầm</span>
                </td>
                <td className="p-2.5 font-mono text-muted">
                  TN = {stats.tn.toFixed(1)}
                  <span className="block text-[10px] text-muted font-normal">Đúng người khỏe</span>
                </td>
                <td className="p-2.5 font-mono font-semibold">{stats.healthy.toFixed(0)} người</td>
              </tr>
              <tr className="bg-surface-muted font-semibold text-ink">
                <td className="p-2.5">Tổng số test báo</td>
                <td className="p-2.5 font-mono font-bold text-accent-dark">
                  Tổng (+) = {stats.totalPositive.toFixed(1)}
                </td>
                <td className="p-2.5 font-mono text-muted">
                  {(stats.fn + stats.tn).toFixed(1)}
                </td>
                <td className="p-2.5 font-mono font-bold">10.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bayes Probability Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3.5 bg-accent/10 border-2 border-accent rounded-lg">
          <div className="text-xs font-bold text-accent uppercase tracking-wide">
            Xác suất hậu nghiệm Bayes: P(Có bệnh | Dương tính)
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-ink">
              {stats.posterior !== null ? `${(stats.posterior * 100).toFixed(2)}%` : '—'}
            </span>
            <span className="text-xs text-muted">
              {stats.totalPositive > 0
                ? `= ${stats.tp.toFixed(1)} / (${stats.tp.toFixed(1)} + ${stats.fp.toFixed(1)})`
                : 'Không xác định vì mẫu số bằng 0'}
            </span>
          </div>
          <div className="text-xs text-ink/80 mt-1">
            <strong>Mẫu số:</strong> Toàn bộ những người nhận kết quả dương tính ({stats.totalPositive.toFixed(1)} người).
          </div>
        </div>

        <div className="p-3.5 bg-xs-light border border-xs-border rounded-lg">
          <div className="text-xs font-bold text-xs-dark uppercase tracking-wide">
            Độ nhạy kiểm nghiệm: P(Dương tính | Có bệnh)
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-xs-dark">
              {sensitivityPct.toFixed(1)}%
            </span>
            <span className="text-xs text-muted">
              = {stats.tp.toFixed(1)} / {stats.diseased.toFixed(0)}
            </span>
          </div>
          <div className="text-xs text-ink/80 mt-1">
            <strong>Mẫu số:</strong> Toàn bộ những người thật sự có bệnh ({stats.diseased.toFixed(0)} người).
          </div>
        </div>
      </div>

      {/* Conditional Conclusion & Math Disclaimer */}
      <div className="bg-surface-muted p-3.5 rounded-lg text-xs sm:text-sm text-ink border-l-4 border-warning-ink space-y-1.5">
        <div className="font-semibold text-warning-ink flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          Bản chất xác suất cần nhớ khi vấn đáp:
        </div>
        <p>
          Hai điều kiện khác nhau tạo ra <strong>hai mẫu số hoàn toàn khác nhau</strong>:
          <br />
          - <code>P(+ | Bệnh)</code> xét trong nhóm <strong>có bệnh</strong> (mẫu số {stats.diseased.toFixed(0)} người).
          <br />
          - <code>P(Bệnh | +)</code> xét trong nhóm <strong>nhận kết quả dương tính</strong> (mẫu số {stats.totalPositive.toFixed(1)} người, gồm cả người bệnh thật lẫn người khỏe bị báo nhầm).
          <br />
          Vì bệnh hiếm ({prevalencePct}%), số người khỏe rất lớn ({stats.healthy.toFixed(0)} người), nên dù tỷ lệ dương tính giả chỉ {fprPct}%, lượng báo động nhầm ({stats.fp.toFixed(1)} người) vẫn áp đảo số ca bệnh thật ({stats.tp.toFixed(1)} người).
        </p>
        <div className="text-[11px] text-muted flex items-center gap-1 pt-1 border-t border-border">
          <Info className="w-3.5 h-3.5 shrink-0" />
          Đây là bài toán xác suất minh họa lý thuyết toán học giả định, không phải công cụ chẩn đoán y tế thực tế.
        </div>
      </div>
    </div>
  );
};
