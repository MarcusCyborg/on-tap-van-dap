import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  Award,
  BookmarkCheck,
  FileText,
  Sliders,
  ChevronRight,
  Code2,
  Sparkles,
  Home,
  BrainCircuit,
  Layers
} from 'lucide-react';
import { SUBJECT_INFO, SIMULATIONS_META } from '../../content/metadata';
import type { SubjectId } from '../../content/types';
import { loadUserData } from '../../lib/storage';
import { dplChapters, dplConcepts } from '../../content/generated';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [readCounts, setReadCounts] = useState<Record<SubjectId, number>>({
    xs: 0,
    ml: 0,
    dl: 0,
    gt: 0
  });
  const [dplReadCount, setDplReadCount] = useState<number>(0);

  useEffect(() => {
    const updateStats = () => {
      const data = loadUserData();
      const counts: Record<SubjectId, number> = { xs: 0, ml: 0, dl: 0, gt: 0 };
      for (let i = 1; i <= 35; i++) {
        for (const pfx of ['XS', 'ML', 'DL', 'GT'] as const) {
          const id = `${pfx}${i.toString().padStart(2, '0')}`;
          const sId = pfx.toLowerCase() as SubjectId;
          if (data.conceptProgress[id]?.readAt) {
            counts[sId]++;
          }
        }
      }
      setReadCounts(counts);

      let dplCount = 0;
      for (const c of dplConcepts) {
        if (data.conceptProgress[c.id]?.readAt) {
          dplCount++;
        }
      }
      setDplReadCount(dplCount);
    };

    updateStats();
    window.addEventListener('on-van-dap-storage-updated', updateStats);
    window.addEventListener('storage', updateStats);
    return () => {
      window.removeEventListener('on-van-dap-storage-updated', updateStats);
      window.removeEventListener('storage', updateStats);
    };
  }, [location.pathname]);

  const subjectKeys: SubjectId[] = ['xs', 'ml', 'dl', 'gt'];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 bg-surface border-r border-border overflow-y-auto transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-xl md:shadow-none' : '-translate-x-full'
        }`}
      >
        <div className="p-3.5 space-y-5">
          {/* Main Navigation */}
          <div className="space-y-1">
            <Link
              to="/"
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname === '/'
                  ? 'bg-accent !text-white shadow-2xs font-bold'
                  : 'text-ink hover:bg-surface-muted'
              }`}
            >
              <Home className={`w-4 h-4 shrink-0 ${location.pathname === '/' ? '!text-white' : 'text-accent'}`} />
              <span className={location.pathname === '/' ? '!text-white font-bold' : ''}>Trang chủ học tập</span>
            </Link>

            <Link
              to="/guide"
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname === '/guide'
                  ? 'bg-accent !text-white shadow-2xs font-bold'
                  : 'text-ink hover:bg-surface-muted'
              }`}
            >
              <Compass className={`w-4 h-4 shrink-0 ${location.pathname === '/guide' ? '!text-white' : 'text-accent'}`} />
              <span className={location.pathname === '/guide' ? '!text-white font-bold' : ''}>Bản đồ kiến thức & Lộ trình</span>
            </Link>

            <Link
              to="/practice"
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname.startsWith('/practice')
                  ? 'bg-accent !text-white shadow-2xs font-bold'
                  : 'text-ink hover:bg-surface-muted'
              }`}
            >
              <Award className={`w-4 h-4 shrink-0 ${location.pathname.startsWith('/practice') ? '!text-white' : 'text-accent'}`} />
              <span className={location.pathname.startsWith('/practice') ? '!text-white font-bold' : ''}>Luyện vấn đáp (5-7 câu)</span>
            </Link>

            <Link
              to="/review"
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname === '/review'
                  ? 'bg-accent !text-white shadow-2xs font-bold'
                  : 'text-ink hover:bg-surface-muted'
              }`}
            >
              <BookmarkCheck className={`w-4 h-4 shrink-0 ${location.pathname === '/review' ? '!text-white' : 'text-accent'}`} />
              <span className={location.pathname === '/review' ? '!text-white font-bold' : ''}>Danh sách cần ôn lại</span>
            </Link>
          </div>

          {/* PRIORITIZED DPL302M COURSE ENTRY */}
          <div className="space-y-1.5 p-2 rounded-xl bg-purple-50/70 border border-purple-200">
            <div className="text-[11px] font-bold text-purple-900 uppercase tracking-wider px-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-700" />
                Môn học chính DPL302m
              </span>
              <span className="text-[10px] font-mono bg-purple-200/80 text-purple-900 px-1.5 py-0.2 rounded font-bold">
                {dplReadCount}/72
              </span>
            </div>

            <Link
              to="/dpl302m"
              onClick={onClose}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                location.pathname === '/dpl302m'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'text-purple-950 hover:bg-purple-100/70'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-bold">Deep Learning: DPL302m</span>
                <span className="text-[10px] opacity-80 font-normal">
                  72 câu theo 5 chương
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
            </Link>

            {/* 5 Chapters sublinks */}
            <div className="space-y-0.5 pt-1 border-t border-purple-200/60 pl-1.5">
              {dplChapters.map(ch => {
                const isActive = location.pathname === `/dpl302m/${ch.chapterId}`;
                return (
                  <Link
                    key={ch.chapterId}
                    to={`/dpl302m/${ch.chapterId}`}
                    onClick={onClose}
                    className={`flex items-center justify-between px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-200 text-purple-900 font-bold'
                        : 'text-purple-900/80 hover:text-purple-950 hover:bg-purple-100/60'
                    }`}
                  >
                    <span className="truncate">{ch.chapterId.toUpperCase()}: {ch.title.split(/[:\-]/)[1]?.trim() || ch.title}</span>
                    <span className="text-[10px] font-mono text-purple-700 shrink-0 ml-1">
                      {ch.totalCount}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 4 Foundation Subjects List */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider px-2">
              Nền tảng chung (140 câu)
            </div>
            {subjectKeys.map(sId => {
              const s = SUBJECT_INFO[sId];
              const isActive = location.pathname === `/subjects/${sId}`;
              const count = readCounts[sId];

              return (
                <div key={sId} className="space-y-0.5">
                  <Link
                    to={`/subjects/${sId}`}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-surface-muted text-ink shadow-2xs font-bold'
                        : 'text-ink hover:bg-surface-muted/60'
                    }`}
                    style={{
                      borderLeft: `3px solid ${s.color}`
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{s.name}</span>
                      <span className="text-[10px] text-muted font-normal">
                        35 câu (18A • 12B • 5C)
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
                      {count}/35
                    </span>
                  </Link>

                  {/* Reference link under subject */}
                  <div className="pl-6">
                    <Link
                      to={`/reference/${sId}`}
                      onClick={onClose}
                      className="text-[11px] text-muted hover:text-ink flex items-center gap-1 py-0.5 transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Bài tập & Tra cứu {s.shortName}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 8 Interactive Simulations Quick List */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider px-2 flex items-center justify-between">
              <span>8 Mô phỏng tương tác</span>
              <Sparkles className="w-3 h-3 text-accent" />
            </div>
            <div className="space-y-1">
              {SIMULATIONS_META.map(sim => (
                <Link
                  key={sim.id}
                  to={`/learn/${sim.conceptIds[0]}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-muted hover:text-ink hover:bg-surface-muted/70 transition-colors"
                >
                  <span className="truncate">{sim.title}</span>
                  <span className="text-[10px] font-mono text-muted bg-surface-muted px-1 rounded shrink-0">
                    {sim.conceptIds[0]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
