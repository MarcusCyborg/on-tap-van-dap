import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { SearchModal } from '../features/search/SearchModal';
import { HomeView } from '../features/home/HomeView';
import { GuideView } from '../features/guide/GuideView';
import { SubjectTocView } from '../features/subjects/SubjectTocView';
import { ConceptReader } from '../features/reader/ConceptReader';
import { ReviewView } from '../features/review/ReviewView';
import { PracticeHub } from '../features/practice/PracticeHub';
import { PracticeSessionView } from '../features/practice/PracticeSessionView';
import { ReferenceView } from '../features/reference/ReferenceView';
import { SettingsView } from '../features/settings/SettingsView';
import { DplCourseView } from '../features/dpl/DplCourseView';
import { DplChapterView } from '../features/dpl/DplChapterView';
import { loadUserData } from '../lib/storage';

export const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    // Initialize font size
    const userData = loadUserData();
    document.documentElement.setAttribute('data-font-size', userData.fontSize || 'normal');
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen bg-page text-ink flex flex-col font-sans">
        {/* Top Header */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />

        {/* Main Content Layout with Sidebar */}
        <div className="flex-1 max-w-7xl w-full mx-auto flex">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="flex-1 min-w-0 pb-16">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/dpl302m" element={<DplCourseView />} />
              <Route path="/dpl302m/:chapterId" element={<DplChapterView />} />
              <Route path="/guide" element={<GuideView />} />
              <Route path="/subjects/:subjectId" element={<SubjectTocView />} />
              <Route path="/learn/:conceptId" element={<ConceptReader />} />
              <Route path="/review" element={<ReviewView />} />
              <Route path="/practice" element={<PracticeHub />} />
              <Route path="/practice/:sessionId" element={<PracticeSessionView />} />
              <Route path="/reference/:subjectId" element={<ReferenceView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};
