import React, { useState } from 'react';
import { Header } from './components/Header';
import { UseCaseInput } from './components/UseCaseInput';
import { ProviderHeroCard, PrimaryRecommendation } from './components/ProviderHeroCard';
import { ComparisonMatrix, ComparisonMatrixData, RunnerUp } from './components/ComparisonMatrix';
import { AdvisorChat, ChatMessage } from './components/AdvisorChat';
import { ProviderCatalogue } from './components/ProviderCatalogue';
import { CloudProviderInfo } from './data/cloudProviders';
import { 
  Sparkles, 
  Award, 
  Table, 
  MessageSquare, 
  Grid, 
  ShieldCheck, 
  Cpu, 
  Coins, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

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

  // Submit initial workload diagnosis
  const handleDiagnose = async (useCaseText: string, params: any) => {
    setIsLoading(true);
    setError(null);
    setCurrentUseCase(useCaseText);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useCase: useCaseText, workloadParams: params })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const resJson = await response.json();
      if (!resJson.success || !resJson.data) {
        throw new Error(resJson.error || 'Failed to generate recommendation');
      }

      const recData: RecommendationResponse = resJson.data;
      setData(recData);

      // Initialize chat dialogue with system diagnosis
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
      console.error('Diagnosis failed:', err);
      setError(err.message || 'An error occurred while evaluating cloud providers');
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

    // Switch to chat tab so user sees response
    setActiveTab('chat');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
          context: data
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
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
      console.error('Chat inquiry failed:', err);
      const errorMsg: ChatMessage = {
        id: `advisor-err-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an issue retrieving the analysis: ${err.message}. Please try asking again or refining your question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...nextMessages, errorMsg]);
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
        {/* Error notification */}
        {error && (
          <div className="paper-box bg-[#FDECEF] border-[#D50C2D] text-[#A1051F] p-3 sm:p-4 flex items-center justify-between text-xs font-mono">
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
          <div className="space-y-5 sm:space-y-8 animate-in fade-in duration-300">
            {/* Editorial Intro Banner */}
            <div className="border-b-[1.5px] border-[#1E232A] pb-4 sm:pb-6">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider font-semibold text-[#2D5A46] bg-[#2D5A46]/10 px-2 py-0.5 rounded border border-[#2D5A46]/20 mb-2 sm:mb-3">
                <Sparkles className="w-3 h-3" />
                <span>Multi-Cloud Selection Engine</span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1E232A]">
                Discover Your Optimal Cloud Provider.
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-[#565E69] mt-1.5 sm:mt-2 max-w-3xl leading-relaxed">
                Describe your application’s architecture, scale, latency targets, and budget. Our advisor evaluates AWS, GCP, Azure, Cloudflare, Supabase, and Hetzner to recommend the best-in-class fit with honest trade-offs and real pricing in Indian Rupee (₹).
              </p>
            </div>

            {/* Input Form */}
            <UseCaseInput
              onSubmit={handleDiagnose}
              isLoading={isLoading}
              initialUseCase={currentUseCase}
            />

            {/* 3 Value Pillars (1 column on mobile, 3 on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-1 sm:pt-3">
              <div className="paper-box-subtle p-3.5 sm:p-4 flex sm:flex-col items-start gap-3 sm:gap-1.5">
                <div className="w-8 h-8 rounded bg-[#FAF9F5] border border-[#1E232A] flex items-center justify-center text-[#2D5A46] font-bold text-xs shadow-[1px_1px_0px_#1E232A] flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-[#1E232A]">
                    Zero Vendor Loyalty
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#565E69] mt-0.5 leading-snug">
                    Unbiased recommendations. If a $5 VPS or serverless Workers beats an enterprise AWS cluster, we tell you directly.
                  </p>
                </div>
              </div>

              <div className="paper-box-subtle p-3.5 sm:p-4 flex sm:flex-col items-start gap-3 sm:gap-1.5">
                <div className="w-8 h-8 rounded bg-[#FAF9F5] border border-[#1E232A] flex items-center justify-center text-[#D97746] font-bold text-xs shadow-[1px_1px_0px_#1E232A] flex-shrink-0">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-[#1E232A]">
                    Egress & Traps Flagged
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#565E69] mt-0.5 leading-snug">
                    We expose bandwidth traps, NAT Gateway fees, and idle costs before you deploy to eliminate surprise invoices.
                  </p>
                </div>
              </div>

              <div className="paper-box-subtle p-3.5 sm:p-4 flex sm:flex-col items-start gap-3 sm:gap-1.5">
                <div className="w-8 h-8 rounded bg-[#FAF9F5] border border-[#1E232A] flex items-center justify-center text-[#4A6B82] font-bold text-xs shadow-[1px_1px_0px_#1E232A] flex-shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-[#1E232A]">
                    Interactive Consultation
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#565E69] mt-0.5 leading-snug">
                    Continue comparing in chat: inspect database failovers, obtain Terraform boilerplate, or simulate traffic surges.
                  </p>
                </div>
              </div>
            </div>

            {/* Provider Directory */}
            <ProviderCatalogue onSelectProviderAsQuery={(p) => handleDiagnose(`Evaluate ${p.name} for modern web application`, {})} />
          </div>
        )}

        {/* View 2: Active Diagnosis & Multi-Tab Navigation */}
        {data && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
            {/* Workload Subheader & Mobile-Optimized Tab Bar */}
            <div className="paper-box bg-[#FAF9F5] p-2.5 sm:p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-mono text-[10px] sm:text-xs font-bold uppercase text-[#2D5A46] bg-[#2D5A46]/10 px-1.5 py-0.5 rounded border border-[#2D5A46]/20 flex-shrink-0">
                  Target
                </span>
                <p className="text-xs text-[#1E232A] truncate italic font-serif">
                  "{currentUseCase}"
                </p>
              </div>

              {/* Navigation Tabs (Compact on Mobile with Icons) */}
              <div className="grid grid-cols-4 sm:flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('recommendation')}
                  className={`paper-btn text-xs py-1.5 px-2 sm:px-3 flex items-center justify-center gap-1 ${
                    activeTab === 'recommendation'
                      ? 'paper-btn-primary'
                      : 'paper-btn-neutral'
                  }`}
                  title="Best Cloud Recommendation"
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
                  <span className="hidden sm:inline">Trade-off Matrix</span>
                  <span className="sm:hidden font-mono font-bold">Matrix</span>
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`paper-btn text-xs py-1.5 px-2 sm:px-3 flex items-center justify-center gap-1 relative ${
                    activeTab === 'chat'
                      ? 'paper-btn-primary'
                      : 'paper-btn-neutral'
                  }`}
                  title="Consultation Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">Consultation Chat</span>
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
                  title="All Cloud Providers"
                >
                  <Grid className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden sm:inline">All Clouds</span>
                  <span className="sm:hidden font-mono font-bold">Clouds</span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'recommendation' && (
              <div className="space-y-4 sm:space-y-6">
                <ProviderHeroCard
                  recommendation={data.primaryProvider}
                  onExploreTopic={handleSendChatMessage}
                />

                {/* Transition to Chat Callout */}
                <div className="paper-box-subtle p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-[#1E232A]">
                      Need to compare alternatives or examine code?
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#565E69]">
                      Ask the advisor about egress fees, database failovers, or Terraform configs.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="paper-btn paper-btn-primary text-xs px-3.5 py-1.5 w-full sm:w-auto flex-shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Consultation Chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'matrix' && (
              <div className="space-y-4 sm:space-y-6">
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
              <div className="space-y-4 sm:space-y-6">
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
              <div className="space-y-4 sm:space-y-6">
                <ProviderCatalogue onSelectProviderAsQuery={handleSelectCatalogueProvider} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Tactile Footer */}
      <footer className="border-t-[1.5px] border-[#1E232A] bg-[#FAF9F5] px-3 sm:px-6 md:px-8 py-3 sm:py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-[11px] text-[#565E69] font-mono text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#1E232A]">Warm Paper Cloud Advisor</span>
            <span>•</span>
            <span>Neo-Brutalist Architecture Engine</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Prices in ₹ INR</span>
            <span>•</span>
            <span className="text-[#2D5A46] font-semibold">Gemini 3.1 Flash Lite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
