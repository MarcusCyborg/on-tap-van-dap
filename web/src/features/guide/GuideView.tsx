import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Compass, BookOpen, Clock, Lightbulb, MessageSquare, Bot, ArrowRight } from 'lucide-react';
import { guide } from '../../content/generated';

export const GuideView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Title Header */}
      <div className="space-y-3 border-b border-border pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>Chuyên đề 00</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
          {guide.title}
        </h1>
        <p className="text-sm text-muted">
          Hướng dẫn định hướng, phương pháp tiếp cận từ số 0, quan hệ liên môn và phân bổ thời gian cấp tốc.
        </p>
      </div>

      {/* Purpose & Relations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5 shadow-2xs space-y-2">
          <h2 className="text-sm font-bold text-ink flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent" />
            Bộ tài liệu này giải quyết việc gì?
          </h2>
          <div className="text-xs sm:text-sm text-muted leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {guide.overview}
            </ReactMarkdown>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-2xs space-y-2">
          <h2 className="text-sm font-bold text-ink flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            Bốn mảng liên quan với nhau ra sao?
          </h2>
          <div className="text-xs sm:text-sm text-muted leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {guide.relations}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 8 Core Concepts */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-ink">
            Tám Khái Niệm Nhỏ Để Đỡ Bị Ngợp
          </h2>
          <p className="text-xs text-muted">
            Những viên gạch nền móng xuất hiện xuyên suốt cả 4 chuyên đề.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {guide.eightConcepts.map((item, idx) => (
            <div key={idx} className="bg-surface border border-border rounded-xl p-4 shadow-2xs space-y-1.5">
              <span className="text-xs font-bold text-accent block">
                {item.title}
              </span>
              <p className="text-xs text-ink/80 leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Hour Study Schedule */}
      <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 shadow-2xs space-y-3">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          Gợi Ý Phân Bổ Nếu Còn Khoảng 4 Giờ Ôn Thi
        </h2>
        <div className="reader-content text-xs sm:text-sm overflow-x-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {guide.fourHourScheduleTable}
          </ReactMarkdown>
        </div>
        <p className="text-xs text-muted italic">
          * Đây là lịch chọn lọc, không phải cam kết đọc và hiểu hết 140 câu trong 4 giờ. Cắt phần mở rộng trước, giữ thời gian tự trả lời.
        </p>
      </div>

      {/* Answering Strategy & Moving on criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-accent/10 border-2 border-accent/30 rounded-xl p-5 space-y-2">
          <h2 className="text-sm font-bold text-accent flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Cách Trả Lời Một Câu Vấn Đáp
          </h2>
          <div className="text-xs sm:text-sm text-ink leading-relaxed font-sans">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {guide.answerMethod}
            </ReactMarkdown>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 space-y-2">
          <h2 className="text-sm font-bold text-ink flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-warning-ink" />
            Khi nào được chuyển sang câu tiếp theo?
          </h2>
          <div className="text-xs sm:text-sm text-muted leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {guide.whenToMoveOn}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* AI Practice Prompt Template */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-ink">
          <Bot className="w-4 h-4 text-accent" />
          <span>Mẫu câu lệnh (Prompt) nhờ AI hỏi thi thử:</span>
        </div>
        <div className="p-3.5 bg-surface-muted rounded-lg font-mono text-xs text-ink/90 leading-relaxed border border-border">
          {guide.aiPromptTemplate}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Link to="/" className="text-xs text-muted hover:text-ink">
          Về trang chủ
        </Link>
        <Link
          to="/learn/XS01"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent-dark"
        >
          <span>Bắt đầu câu đầu tiên (XS01)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
