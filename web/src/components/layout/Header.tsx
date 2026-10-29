import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, BookOpen, Settings, Menu, X, CheckCircle, HelpCircle, Bookmark, Compass } from 'lucide-react';
import { loadUserData, computeUserStats } from '../../lib/storage';
import type { UserStats } from '../../lib/storage';
import { SUBJECT_INFO } from '../../content/metadata';
import type { SubjectId } from '../../content/types';

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onToggleSidebar,
  isSidebarOpen
}) => {
  const [stats, setStats] = useState<UserStats>(computeUserStats(loadUserData()));
  const location = useLocation();

  useEffect(() => {
    const handleStorage = () => {
      setStats(computeUserStats(loadUserData()));
    };
    window.addEventListener('on-van-dap-storage-updated', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('on-van-dap-storage-updated', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [location.pathname]);

  const subjectKeys: SubjectId[] = ['xs', 'ml', 'dl', 'gt'];

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface-muted transition-colors"
            aria-label={isSidebarOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-accent-dark transition-colors">
              ÔV
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-base tracking-tight text-ink block leading-none">
                Ôn Vấn Đáp
              </span>
              <span className="text-[10px] text-muted font-medium">
                Xác suất • ML • DL • Giải thuật
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Subject Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {subjectKeys.map(sId => {
            const s = SUBJECT_INFO[sId];
            const isActive = location.pathname.startsWith(`/subjects/${sId}`) || location.pathname.startsWith(`/learn/${sId.toUpperCase()}`);
            return (
              <Link
                key={sId}
                to={`/subjects/${sId}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-surface text-ink shadow-xs'
                    : 'text-ink/80 hover:text-ink hover:bg-surface-muted border-transparent'
                }`}
                style={{
                  borderColor: isActive ? s.color : 'transparent'
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className={isActive ? 'text-ink font-extrabold' : 'text-ink/80'}>
                  {s.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Search, Stats pill, Settings */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-muted border border-border text-xs text-muted hover:text-ink hover:border-accent/40 transition-all shadow-2xs"
            aria-label="Tìm kiếm nội dung (Phím tắt: Ctrl+K hoặc /)"
            title="Tìm kiếm khái niệm, thuật ngữ, bài tập (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-muted" />
            <span className="hidden sm:inline">Tìm kiếm...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded text-muted">
              Ctrl K
            </kbd>
          </button>

          {/* User Progress Pill */}
          <Link
            to="/review"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-xs text-accent font-semibold hover:bg-accent/15 transition-colors"
            title="Xem tiến độ và các câu cần ôn lại"
          >
            <CheckCircle className="w-3.5 h-3.5 text-accent" />
            <span>{stats.totalRead}/140</span>
            {stats.understandingCounts.confident > 0 && (
              <span className="text-[11px] text-muted font-normal">
                (Vững: {stats.understandingCounts.confident})
              </span>
            )}
          </Link>

          {/* Settings */}
          <Link
            to="/settings"
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface-muted transition-colors"
            title="Cài đặt cỡ chữ và Sao lưu dữ liệu"
            aria-label="Cài đặt"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
