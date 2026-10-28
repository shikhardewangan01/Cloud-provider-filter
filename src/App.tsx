import React, { useState } from 'react';
import { Header } from './components/Header';
import { UseCaseInput } from './components/UseCaseInput';
import { ProviderHeroCard, PrimaryRecommendation } from './components/ProviderHeroCard';
import { ComparisonMatrix, ComparisonMatrixData, RunnerUp } from './components/ComparisonMatrix';
import { AdvisorChat, ChatMessage } from './components/AdvisorChat';
import { ProviderCatalogue } from './components/ProviderCatalogue';
import { CloudProviderInfo } from './data/cloudProviders';
import { 
  Award, 
  Table, 
  MessageSquare, 
  Grid, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

import { generateIntelligentFallback, generateFallbackChatReply } from './utils/cloudEngine';

interface RecommendationResponse {
  primaryProvider: PrimaryRecommendation;
  runnerUps: RunnerUp[];
  comparisonMatrix: ComparisonMatrixData;
  initialAdvisorDialogue: string;
  suggestedFollowUps: string[];
}

export default function App() {
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUseCase, setCurrentUseCase] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'recommendation' | 'matrix' | 'chat' | 'catalogue'>('recommendation');

  // Submit workload diagnosis with guaranteed quick completion
  const handleDiagnose = async (useCaseText: string, params: any) => {
    setIsLoading(true);
    setError(null);
    setCurrentUseCase(useCaseText);

    try {
      // 5-second fetch timeout to prevent hanging on serverless cold starts or 404s
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useCase: useCaseText, workloadParams: params }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const resJson = await response.json();
      if (!resJson.success || !resJson.data) {
        throw new Error(resJson.error || 'Invalid API payload');
      }

      const recData: RecommendationResponse = resJson.data;
      setData(recData);

      const initialMsgs: ChatMessage[] = [
        {
          id: 'user-init',
          role: 'user',
          content: useCaseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'advisor-init',
          role: 'assistant',
          content: recData.initialAdvisorDialogue,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          meta: {
            model: resJson.meta?.model,
            latencyMs: resJson.meta?.latencyMs
          }
        }
      ];
      setChatMessages(initialMsgs);
      setActiveTab('recommendation');
    } catch (err: any) {
      console.warn('Backend unavailable, running immediate client-side recommendation engine:', err.message);
      // Fallback engine immediately processes recommendation in browser
      const fallbackRec = generateIntelligentFallback(useCaseText, params) as RecommendationResponse;
      setData(fallbackRec);

      const initialMsgs: ChatMessage[] = [
        {
          id: 'user-init',
          role: 'user',
          content: useCaseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'advisor-init',
          role: 'assistant',
          content: fallbackRec.initialAdvisorDialogue,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setChatMessages(initialMsgs);
      setActiveTab('recommendation');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle continuing conversation in chat
  const handleSendChatMessage = async (msgText: string) => {
    if (!msgText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    setIsChatLoading(true);
    setActiveTab('chat');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
          context: data
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const resJson = await response.json();
      const replyContent = resJson.reply || 'No response generated.';

      const advisorMsg: ChatMessage = {
        id: `advisor-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        meta: {
          model: resJson.meta?.model,
          latencyMs: resJson.meta?.latencyMs
        }
      };

      setChatMessages([...nextMessages, advisorMsg]);
    } catch (err: any) {
      console.warn('Chat API route unavailable, using instant client-side advisor response:', err);
      const fallbackReply = generateFallbackChatReply(msgText, data);
      const advisorMsg: ChatMessage = {
        id: `advisor-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...nextMessages, advisorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAskComparisonFromMatrix = (providerName: string) => {
    const prompt = `Compare ${data?.primaryProvider.name} directly with ${providerName} for our workload. What are the specific trade-offs in pricing, developer experience, and network latency?`;
    handleSendChatMessage(prompt);
  };

  const handleSelectCatalogueProvider = (provider: CloudProviderInfo) => {
    const prompt = `Can you evaluate ${provider.name} for our workload? Why would or wouldn't it be suitable compared to ${data?.primaryProvider.name || 'other clouds'}?`;
    handleSendChatMessage(prompt);
  };

  const handleReset = () => {
    setData(null);
    setCurrentUseCase('');
    setChatMessages([]);
    setError(null);
    setActiveTab('recommendation');
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#1E232A] flex flex-col font-sans">
      <Header onReset={handleReset} hasActiveDiagnosis={!!data} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {error && (
          <div className="paper-box bg-[#FDECEF] border-[#D50C2D] text-[#A1051F] p-3 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="underline font-bold ml-3 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View 1: Initial Empty State & Workload Input */}
        {!data && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
            {/* Clean Hero Header */}
            <div className="border-b-[1.5px] border-[#1E232A] pb-3 sm:pb-4">
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1E232A]">
                Cloud Provider Selector
              </h1>
              <p className="text-xs sm:text-sm text-[#565E69] mt-1">
                Enter your workload to identify the best cloud provider and compare options.
              </p>
            </div>

            {/* Input Form */}
            <UseCaseInput
              onSubmit={handleDiagnose}
              isLoading={isLoading}
              initialUseCase={currentUseCase}
            />

            {/* Provider Directory */}
            <ProviderCatalogue onSelectProviderAsQuery={(p) => handleDiagnose(`Evaluate ${p.name} for our application`, {})} />
          </div>
        )}

        {/* View 2: Active Diagnosis & Multi-Tab Navigation */}
        {data && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
            {/* Workload Header & Tab Bar */}
            <div className="paper-box bg-[#FAF9F5] p-2.5 sm:p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-mono text-[10px] sm:text-xs font-bold uppercase text-[#2D5A46] bg-[#2D5A46]/10 px-1.5 py-0.5 rounded border border-[#2D5A46]/20 flex-shrink-0">
                  Workload
                </span>
                <p className="text-xs text-[#1E232A] truncate italic font-serif">
                  "{currentUseCase}"
                </p>
              </div>

              {/* Navigation Tabs */}
              <div className="grid grid-cols-4 sm:flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('recommendation')}
                  className={`paper-btn text-xs py-1.5 px-2 sm:px-3 flex items-center justify-center gap-1 ${
                    activeTab === 'recommendation'
                      ? 'paper-btn-primary'
                      : 'paper-btn-neutral'
                  }`}
                  title="Recommendation"
                >
                  <Award className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">Recommendation</span>
                  <span className="sm:hidden font-mono font-bold">Best</span>
                </button>

                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`paper-btn text-xs py-1.5 px-2 sm:px-3 flex items-center justify-center gap-1 ${
                    activeTab === 'matrix'
                      ? 'paper-btn-primary'
                      : 'paper-btn-neutral'
                  }`}
                  title="Trade-off Matrix"
                >
                  <Table className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">Comparison Matrix</span>
                  <span className="sm:hidden font-mono font-bold">Matrix</span>
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`paper-btn text-xs py-1.5 px-2 sm:px-3 flex items-center justify-center gap-1 relative ${
                    activeTab === 'chat'
                      ? 'paper-btn-primary'
                      : 'paper-btn-neutral'
                  }`}
                  title="Chat Dialogue"
                >
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">Chat</span>
                  <span className="sm:hidden font-mono font-bold">Chat</span>
                  {chatMessages.length > 2 && (
                    <span className="w-2 h-2 rounded-full bg-[#D97746] absolute -top-1 -right-1" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('catalogue')}
                  className={`paper-btn text-xs py-1.5 px-2 sm:px-3 flex items-center justify-center gap-1 ${
                    activeTab === 'catalogue'
                      ? 'paper-btn-primary'
                      : 'paper-btn-neutral'
                  }`}
                  title="All Clouds"
                >
                  <Grid className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">All Clouds</span>
                  <span className="sm:hidden font-mono font-bold">Clouds</span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'recommendation' && (
              <div className="space-y-4">
                <ProviderHeroCard
                  recommendation={data.primaryProvider}
                  onExploreTopic={handleSendChatMessage}
                />

                <div className="paper-box-subtle p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <p className="text-xs text-[#565E69]">
                    Want to ask follow-up questions or compare providers?
                  </p>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="paper-btn paper-btn-primary text-xs px-3 py-1.5 w-full sm:w-auto flex-shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'matrix' && (
              <div className="space-y-4">
                <ComparisonMatrix
                  primaryName={data.primaryProvider.name}
                  primaryId={data.primaryProvider.id}
                  runnerUps={data.runnerUps}
                  matrix={data.comparisonMatrix}
                  onAskComparison={handleAskComparisonFromMatrix}
                />
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-4">
                <AdvisorChat
                  messages={chatMessages}
                  onSendMessage={handleSendChatMessage}
                  isLoading={isChatLoading}
                  suggestedFollowUps={data.suggestedFollowUps}
                  primaryProviderName={data.primaryProvider.name}
                />
              </div>
            )}

            {activeTab === 'catalogue' && (
              <div className="space-y-4">
                <ProviderCatalogue onSelectProviderAsQuery={handleSelectCatalogueProvider} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t-[1.5px] border-[#1E232A] bg-[#FAF9F5] px-4 md:px-8 py-3 mt-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#565E69] font-mono">
          <span>Cloud Advisor</span>
          <span>INR (₹) Estimates</span>
        </div>
      </footer>
    </div>
  );
}
