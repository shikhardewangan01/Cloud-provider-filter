import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Sparkles, User, Bot, HelpCircle, Terminal } from 'lucide-react';
import { marked } from 'marked';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  meta?: {
    model?: string;
    latencyMs?: number;
  };
}

interface AdvisorChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  suggestedFollowUps?: string[];
  primaryProviderName?: string;
}

export const AdvisorChat: React.FC<AdvisorChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  suggestedFollowUps = [],
  primaryProviderName
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderMarkdown = (content: string) => {
    const rawHtml = marked.parse(content, { breaks: true, gfm: true }) as string;
    return { __html: rawHtml };
  };

  return (
    <div className="paper-box bg-[#FAF9F5] p-3 sm:p-5 md:p-7 flex flex-col h-[520px] sm:h-[620px] md:h-[720px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E232A]/20 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#2D5A46] border border-[#1E232A] flex items-center justify-center text-[#F7F4EE] shadow-[1.5px_1.5px_0px_#1E232A] flex-shrink-0">
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-xs sm:text-base text-[#1E232A] truncate">
              Architecture Consultation Dialogue
            </h3>
            <p className="text-[10px] sm:text-xs text-[#565E69] truncate">
              Deep-dive into costs, lock-in, latency, or deployment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[11px] text-[#2D5A46] bg-[#2D5A46]/10 px-2 py-0.5 rounded border border-[#2D5A46]/20 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A46] animate-pulse" />
          <span className="hidden sm:inline">Context Active</span>
          <span className="sm:hidden">Active</span>
        </div>
      </div>

      {/* Messages Scrollable Container */}
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-3 sm:space-y-4">
        {messages.map((msg) => {
          const isAdvisor = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAdvisor ? 'items-start' : 'items-end'}`}
            >
              {/* Role & Timestamp Header */}
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-[#565E69] flex items-center gap-1">
                  {isAdvisor ? (
                    <>
                      <Bot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#2D5A46]" />
                      <span>Advisor</span>
                    </>
                  ) : (
                    <>
                      <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1E232A]" />
                      <span>You</span>
                    </>
                  )}
                </span>

                {isAdvisor && msg.meta?.latencyMs && (
                  <span className="text-[9px] font-mono text-[#565E69] bg-[#EFECE6] px-1 py-0.2 rounded border border-[#1E232A]/20">
                    {msg.meta.latencyMs}ms
                  </span>
                )}
                <span className="text-[9px] text-[#565E69]/70 font-mono">
                  {msg.timestamp}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[95%] sm:max-w-[85%] rounded-md p-3 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  isAdvisor
                    ? 'bg-[#FAF9F5] border border-[#1E232A] shadow-[1.5px_1.5px_0px_#1E232A] text-[#1E232A]'
                    : 'bg-[#EFECE6] border border-[#1E232A] text-[#1E232A]'
                }`}
              >
                {isAdvisor ? (
                  <div
                    className="prose prose-sm max-w-none text-xs sm:text-sm font-sans 
                      prose-headings:font-display prose-headings:font-bold prose-headings:text-[#1E232A] prose-headings:mb-1 prose-headings:mt-2.5
                      prose-h3:text-xs sm:prose-h3:text-sm prose-h3:border-b prose-h3:border-[#1E232A]/20 prose-h3:pb-0.5
                      prose-p:mb-1.5 prose-p:leading-relaxed
                      prose-ul:my-1 prose-ul:pl-3.5 prose-li:my-0.5
                      prose-code:font-mono prose-code:bg-[#EFECE6] prose-code:px-1 prose-code:py-0.2 rounded prose-code:text-[#1E232A] prose-code:text-[11px]
                      prose-pre:bg-[#1E232A] prose-pre:text-[#FAF9F5] prose-pre:p-2.5 prose-pre:rounded-md prose-pre:my-1.5 prose-pre:text-[10px] sm:prose-pre:text-xs prose-pre:overflow-x-auto
                      prose-table:text-[11px] prose-table:my-1.5 prose-th:bg-[#EFECE6] prose-th:p-1 prose-td:p-1"
                    dangerouslySetInnerHTML={renderMarkdown(msg.content)}
                  />
                ) : (
                  <p className="whitespace-pre-wrap font-sans text-xs sm:text-sm">{msg.content}</p>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[9px] font-mono font-bold uppercase text-[#2D5A46] flex items-center gap-1">
                <Bot className="w-2.5 h-2.5 text-[#2D5A46]" />
                <span>Advisor thinking...</span>
              </span>
            </div>
            <div className="bg-[#FAF9F5] border border-[#1E232A] shadow-[1.5px_1.5px_0px_#1E232A] rounded-md p-3 max-w-[90%] text-xs flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 border-2 border-[#2D5A46] border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="text-[#565E69] font-mono text-[11px]">
                Consulting cloud catalogs & benchmarks...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-up Chips (Swipeable on Mobile) */}
      {suggestedFollowUps.length > 0 && (
        <div className="py-2 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-semibold text-[#565E69] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#2D5A46]" />
              <span>Suggested Inquiries:</span>
            </span>
            <span className="text-[9px] font-mono text-[#565E69] sm:hidden">Swipe →</span>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-1 -mx-1 px-1">
            {suggestedFollowUps.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSendMessage(chip)}
                disabled={isLoading}
                className="flex-shrink-0 text-[11px] font-sans px-2.5 py-1 rounded bg-[#EFECE6] hover:bg-[#FAF9F5] text-[#1E232A] border border-[#1E232A] shadow-[1px_1px_0px_#1E232A] transition-all text-left cursor-pointer whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Input Form */}
      <form onSubmit={handleSubmit} className="pt-1.5 flex-shrink-0">
        <div className="paper-box bg-[#FAF9F5] p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2 border-[1.5px] border-[#1E232A] shadow-[2px_2px_0px_#1E232A]">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask a follow-up about ${primaryProviderName || 'this cloud'}...`}
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent px-2 text-xs sm:text-sm font-sans focus:outline-none resize-none placeholder-[#565E69]/60 max-h-20 py-1"
          />

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <span className="text-[10px] font-mono text-[#565E69] hidden md:inline">
              <kbd className="px-1 py-0.5 bg-[#EFECE6] border border-[#1E232A] rounded">⌘↵</kbd>
            </span>
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`paper-btn paper-btn-primary px-2.5 sm:px-3 py-1.5 text-xs ${
                !inputText.trim() || isLoading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              title="Send inquiry"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Inquire</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
