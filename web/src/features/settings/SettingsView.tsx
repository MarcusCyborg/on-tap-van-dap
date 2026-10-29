import React, { useState, useEffect } from 'react';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Type,
  HardDrive
} from 'lucide-react';
import {
  loadUserData,
  setReaderFontSize,
  exportDataAsJSON,
  validateImportData,
  applyImportedData,
  resetUserData
} from '../../lib/storage';
import type { ImportPreview } from '../../lib/storage';

export const SettingsView: React.FC = () => {
  const [userData, setUserData] = useState(loadUserData());
  const [currentFontSize, setCurrentFontSize] = useState<'normal' | 'large' | 'xlarge'>(
    loadUserData().fontSize
  );

  // Import flow state
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // Reset confirmation state
  const [isConfirmingReset, setIsConfirmingReset] = useState<boolean>(false);

  useEffect(() => {
    const handleStorage = () => {
      const data = loadUserData();
      setUserData(data);
      setCurrentFontSize(data.fontSize);
    };
    window.addEventListener('on-van-dap-storage-updated', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('on-van-dap-storage-updated', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleFontSizeChange = (size: 'normal' | 'large' | 'xlarge') => {
    setCurrentFontSize(size);
    setReaderFontSize(size);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `on-van-dap-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      setImportJsonText(content);
      const preview = validateImportData(content);
      setImportPreview(preview);
      setImportSuccessMsg(null);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = (mode: 'merge' | 'overwrite') => {
    if (!importPreview?.dataToImport) return;
    const ok = applyImportedData(importPreview.dataToImport, mode);
    if (ok) {
      setImportSuccessMsg(
        mode === 'overwrite'
          ? 'Đã thay thế toàn bộ dữ liệu thành công!'
          : 'Đã hợp nhất tiến độ và ghi chú thành công!'
      );
      setImportPreview(null);
      setImportJsonText('');
      setUserData(loadUserData());
    }
  };

  const handleExecuteReset = () => {
    resetUserData();
    setIsConfirmingReset(false);
    setUserData(loadUserData());
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-accent" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-ink">
            Cài Đặt & Sao Lưu Dữ Liệu
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted">
          Quản lý hiển thị cỡ chữ, xuất/nhập file sao lưu tiến độ và ghi chú cá nhân.
        </p>
      </div>

      {/* Font Size Selector */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-bold text-ink">Cỡ Chữ Đọc Bài (Reader Font Size)</h2>
        </div>
        <p className="text-xs text-muted">
          Điều chỉnh kích thước chữ cho các bài đọc khái niệm và bài tập để tối ưu trải nghiệm đọc sách.
        </p>

        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {[
            { id: 'normal', label: 'Bình thường (17px)', size: '17px' },
            { id: 'large', label: 'Cỡ lớn (19px)', size: '19px' },
            { id: 'xlarge', label: 'Rất lớn (21px)', size: '21px' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => handleFontSizeChange(opt.id as any)}
              className={`p-3 rounded-lg border text-left transition-all ${
                currentFontSize === opt.id
                  ? 'bg-accent/10 text-accent border-accent font-bold ring-2 ring-accent/20'
                  : 'bg-surface border-border text-muted hover:bg-surface-muted hover:text-ink'
              }`}
            >
              <span className="block text-xs font-semibold">{opt.label}</span>
              <span className="text-[11px] opacity-75 mt-0.5 block">Mẫu: Văn bản đọc thử</span>
            </button>
          ))}
        </div>
      </div>

      {/* Local Storage Info & Export */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-bold text-ink">Lưu trữ & Xuất Sao lưu (Backup)</h2>
        </div>

        <div className="p-3 bg-surface-muted/60 rounded-lg text-xs text-muted leading-relaxed">
          Toàn bộ tiến độ học (đã đọc, mức hiểu, bookmark), các ghi chú cá nhân và các bài thi thử được lưu trữ hoàn toàn cục bộ trong <strong>localStorage</strong> của trình duyệt trên máy bạn. Không có dữ liệu nào bị gửi lên máy chủ bên ngoài.
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-muted">
            Lần cập nhật gần nhất: <strong>{new Date(userData.updatedAt).toLocaleString('vi-VN')}</strong>
          </div>
          <button
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent-dark transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Tải file sao lưu (.json)
          </button>
        </div>
      </div>

      {/* Import / Restore Progress */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-bold text-ink">Khôi Phục Tiến Độ Từ File Backup</h2>
        </div>

        <p className="text-xs text-muted">
          Chọn file <code>.json</code> đã sao lưu trước đó để khôi phục tiến độ hoặc đồng bộ sang trình duyệt khác.
        </p>

        <input
          type="file"
          accept=".json,application/json"
          onChange={handleFileUpload}
          className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-surface-muted file:text-ink hover:file:bg-border cursor-pointer"
        />

        {/* Import Preview Result */}
        {importPreview && (
          <div className="p-4 rounded-xl border space-y-3 text-xs bg-surface-muted/60 border-border">
            {importPreview.valid ? (
              <div className="space-y-2">
                <span className="font-bold text-[#27624a] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  File hợp lệ! Thông tin dữ liệu sao lưu:
                </span>
                <ul className="list-disc pl-5 space-y-0.5 text-ink">
                  <li>Số concept hợp lệ: <strong>{importPreview.totalValidConcepts}</strong> câu</li>
                  <li>Số ghi chú: <strong>{importPreview.notesCount}</strong> ghi chú</li>
                  <li>Số bookmark: <strong>{importPreview.bookmarksCount}</strong> mục</li>
                  <li>Số bài thi thử đã lưu: <strong>{importPreview.totalExams}</strong> lượt</li>
                  {importPreview.unknownConceptIds.length > 0 && (
                    <li className="text-warning-ink">
                      {importPreview.unknownConceptIds.length} ID không thuộc bộ 140 câu hiện tại (sẽ được bỏ qua).
                    </li>
                  )}
                </ul>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => handleExecuteImport('merge')}
                    className="px-3.5 py-1.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent-dark"
                  >
                    Hợp nhất dữ liệu (Giữ ghi chú cũ)
                  </button>
                  <button
                    onClick={() => handleExecuteImport('overwrite')}
                    className="px-3.5 py-1.5 rounded-lg bg-surface border border-border text-danger-ink font-semibold hover:bg-red-50"
                  >
                    Ghi đè hoàn toàn
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-danger-ink flex items-start gap-1.5 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{importPreview.error}</span>
              </div>
            )}
          </div>
        )}

        {importSuccessMsg && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-[#27624a] font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{importSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="bg-surface border border-red-200 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-danger-ink flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Vùng Nguy Hiểm: Đặt Lại Tiến Độ
        </h2>
        <p className="text-xs text-muted">
          Xóa toàn bộ đánh dấu đã đọc, đánh giá mức hiểu, ghi chú cá nhân và lịch sử làm bài thi thử trên trình duyệt này.
        </p>

        {!isConfirmingReset ? (
          <button
            onClick={() => setIsConfirmingReset(true)}
            className="px-4 py-2 rounded-lg bg-red-50 text-danger-ink border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors"
          >
            Đặt lại toàn bộ dữ liệu
          </button>
        ) : (
          <div className="p-3 bg-red-50 border border-danger-ink/40 rounded-lg space-y-2">
            <span className="text-xs font-bold text-danger-ink block">
              Bạn có chắc chắn muốn xóa? Thao tác này không thể hoàn tác nếu bạn chưa xuất file sao lưu.
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleExecuteReset}
                className="px-3.5 py-1.5 rounded-lg bg-danger-ink text-white text-xs font-bold hover:bg-red-700"
              >
                Xác nhận xóa sạch
              </button>
              <button
                onClick={() => setIsConfirmingReset(false)}
                className="px-3.5 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium hover:bg-surface-muted"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
