import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Code2, 
  Copy, 
  Check, 
  Layers, 
  Database, 
  HardDrive, 
  Globe, 
  Cpu, 
  TrendingDown, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Coins
} from 'lucide-react';
import { CLOUD_PROVIDERS } from '../data/cloudProviders';

export interface PrimaryRecommendation {
  id: string;
  name: string;
  headline: string;
  matchScore: number;
  whyItWins: string;
  keyAdvantageBulletPoints: string[];
  recommendedArchitecture: {
    compute: { service: string; description: string };
    database: { service: string; description: string };
    storage: { service: string; description: string };
    networking: { service: string; description: string };
    aiOrExtra?: { service: string; description: string };
  };
  estimatedMonthlyCostInr: number;
  costBreakdown: { item: string; costInr: number; note: string }[];
  potentialWatchouts: string[];
  deploymentQuickstartCmd: string;
  terraformSnippet?: string;
}

interface ProviderHeroCardProps {
  recommendation: PrimaryRecommendation;
  onExploreTopic?: (topic: string) => void;
}

export const ProviderHeroCard: React.FC<ProviderHeroCardProps> = ({
  recommendation,
  onExploreTopic
}) => {
  const [copiedCode, setCopiedCode] = useState<'cmd' | 'tf' | null>(null);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'cmd' | 'tf'>('cmd');
  const [imgError, setImgError] = useState(false);
  const [showFullRationale, setShowFullRationale] = useState(false);

  const providerMeta = CLOUD_PROVIDERS[recommendation.id.toLowerCase()] || CLOUD_PROVIDERS.gcp;

  const handleCopy = (text: string, type: 'cmd' | 'tf') => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatInr = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="paper-box bg-[#FAF9F5] p-4 sm:p-6 md:p-8">
      {/* Top Banner / Match Badge */}
      <div className="flex items-center justify-between gap-2 pb-3.5 sm:pb-4 border-b border-[#1E232A]/20">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-mono text-[10px] sm:text-xs uppercase font-bold tracking-wider text-[#2D5A46] bg-[#2D5A46]/10 px-2 py-0.5 rounded border border-[#2D5A46]/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#2D5A46]" />
            <span>Best In Class Fit</span>
          </span>
          <span className="text-[10px] sm:text-xs text-[#565E69] font-mono hidden sm:inline">
            Top Recommendation
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2D5A46] text-[#FAF9F5] border border-[#1E232A] font-display font-bold text-xs sm:text-sm shadow-[1.5px_1.5px_0px_#1E232A]">
          <span>{recommendation.matchScore}% Match</span>
        </div>
      </div>

      {/* Provider Identity Header (Responsive on Mobile) */}
      <div className="py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Logo container */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md bg-[#EFECE6] border-[1.5px] border-[#1E232A] p-2 flex items-center justify-center shadow-[2px_2px_0px_#1E232A] flex-shrink-0">
            {!imgError && providerMeta.logoUrl ? (
              <img
                src={providerMeta.logoUrl}
                alt={recommendation.name}
                className="max-w-full max-h-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              providerMeta.logoSvg
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[#1E232A] truncate">
                {recommendation.name}
              </h1>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase bg-[#FAF9F5] text-[#1E232A] border border-[#1E232A]">
                {providerMeta.shortName}
              </span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-[#2D5A46] font-medium mt-0.5 line-clamp-2">
              {recommendation.headline}
            </p>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="paper-box-sm bg-[#FAF9F5] p-3 sm:p-3.5 border border-[#1E232A] w-full sm:w-auto sm:min-w-[190px] flex sm:flex-col justify-between sm:justify-start items-center sm:items-start flex-shrink-0">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-[#565E69] font-mono">
              <Coins className="w-3 h-3 text-[#2D5A46]" />
              <span>Est. Monthly Cost</span>
            </div>
            <div className="font-display font-bold text-xl sm:text-2xl text-[#1E232A] tabular-nums mt-0.5">
              {formatInr(recommendation.estimatedMonthlyCostInr)}
              <span className="text-[11px] font-normal text-[#565E69] font-sans"> / mo</span>
            </div>
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#2D5A46] font-mono mt-0 sm:mt-1 flex items-center gap-1 bg-[#2D5A46]/10 px-2 py-0.5 rounded border border-[#2D5A46]/20">
            <TrendingDown className="w-3 h-3" />
            <span>Optimized Tier</span>
          </div>
        </div>
      </div>

      {/* Rationale & Advantages Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 my-2 sm:my-4">
        {/* Left Column: Architectural Rationale */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          <div className="paper-box-subtle p-3.5 sm:p-4">
            <h3 className="font-display text-xs sm:text-sm font-bold uppercase text-[#1E232A] tracking-wider mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2D5A46] flex-shrink-0" />
              Architectural Decision Rationale
            </h3>
            <div className="text-xs sm:text-sm text-[#1E232A] leading-relaxed font-sans">
              <p className={showFullRationale ? 'whitespace-pre-line' : 'line-clamp-4 whitespace-pre-line sm:line-clamp-none'}>
                {recommendation.whyItWins}
              </p>
              {recommendation.whyItWins.length > 200 && (
                <button
                  onClick={() => setShowFullRationale(!showFullRationale)}
                  className="sm:hidden text-xs font-mono font-semibold text-[#2D5A46] mt-1.5 flex items-center gap-1 cursor-pointer"
                >
                  <span>{showFullRationale ? 'Show less' : 'Read full rationale'}</span>
                  {showFullRationale ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-display text-[11px] sm:text-xs uppercase font-bold tracking-wider text-[#565E69] mb-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A46]" />
              <span>Key Advantages:</span>
            </h4>
            <div className="space-y-1.5 sm:space-y-2">
              {recommendation.keyAdvantageBulletPoints.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#1E232A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A46] flex-shrink-0 mt-1.5" />
                  <span className="leading-snug">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Watch-outs & Itemized Costs */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          {/* Watch-outs */}
          <div className="p-3 sm:p-4 rounded bg-[#FFF4EB] border border-[#D97746] shadow-[1.5px_1.5px_0px_#D97746]">
            <h3 className="font-display text-xs font-bold uppercase text-[#D97746] tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Engineering Watch-outs</span>
            </h3>
            <ul className="space-y-1 text-xs text-[#1E232A]">
              {recommendation.potentialWatchouts.map((watchout, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-[#D97746] font-bold">•</span>
                  <span>{watchout}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Itemized Costs */}
          <div className="paper-box-sm p-3 sm:p-4 bg-[#FAF9F5]">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#1E232A] mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-[#2D5A46]" />
                <span>Cost Breakdown</span>
              </span>
              <span className="font-mono text-[10px] text-[#565E69]">(₹ INR)</span>
            </h4>
            <div className="space-y-1.5 text-xs">
              {recommendation.costBreakdown.map((row, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-[#1E232A]/10 gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-[#1E232A] truncate block">{row.item}</span>
                    <span className="text-[10px] text-[#565E69] truncate block">{row.note}</span>
                  </div>
                  <span className="font-mono font-bold text-[#1E232A] tabular-nums flex-shrink-0 text-xs">
                    {formatInr(row.costInr)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Stack Topology (2x2 on Mobile) */}
      <div className="my-4 sm:my-6 pt-4 border-t border-[#1E232A]/20">
        <h3 className="font-display text-xs sm:text-sm font-bold uppercase text-[#1E232A] tracking-wider mb-2.5 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2D5A46] flex-shrink-0" />
          <span>Recommended Architecture Blueprint</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Compute */}
          <div className="paper-box-subtle p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#2D5A46] uppercase mb-1">
              <Cpu className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Compute</span>
            </div>
            <div className="font-display font-bold text-xs sm:text-sm text-[#1E232A] truncate">
              {recommendation.recommendedArchitecture.compute.service}
            </div>
            <p className="text-[11px] text-[#565E69] mt-0.5 leading-snug line-clamp-2">
              {recommendation.recommendedArchitecture.compute.description}
            </p>
          </div>

          {/* Database */}
          <div className="paper-box-subtle p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#4A6B82] uppercase mb-1">
              <Database className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Database</span>
            </div>
            <div className="font-display font-bold text-xs sm:text-sm text-[#1E232A] truncate">
              {recommendation.recommendedArchitecture.database.service}
            </div>
            <p className="text-[11px] text-[#565E69] mt-0.5 leading-snug line-clamp-2">
              {recommendation.recommendedArchitecture.database.description}
            </p>
          </div>

          {/* Storage */}
          <div className="paper-box-subtle p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#D97746] uppercase mb-1">
              <HardDrive className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Storage</span>
            </div>
            <div className="font-display font-bold text-xs sm:text-sm text-[#1E232A] truncate">
              {recommendation.recommendedArchitecture.storage.service}
            </div>
            <p className="text-[11px] text-[#565E69] mt-0.5 leading-snug line-clamp-2">
              {recommendation.recommendedArchitecture.storage.description}
            </p>
          </div>

          {/* Networking */}
          <div className="paper-box-subtle p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#1E232A] uppercase mb-1">
              <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Edge & Network</span>
            </div>
            <div className="font-display font-bold text-xs sm:text-sm text-[#1E232A] truncate">
              {recommendation.recommendedArchitecture.networking.service}
            </div>
            <p className="text-[11px] text-[#565E69] mt-0.5 leading-snug line-clamp-2">
              {recommendation.recommendedArchitecture.networking.description}
            </p>
          </div>
        </div>
      </div>

      {/* Code Snippet Row */}
      <div className="mt-4 pt-3.5 border-t border-[#1E232A]/20">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveSnippetTab('cmd')}
              className={`text-xs font-mono px-2 py-1 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                activeSnippetTab === 'cmd'
                  ? 'bg-[#1E232A] text-[#FAF9F5] border-[#1E232A]'
                  : 'bg-[#EFECE6] text-[#1E232A] border-[#1E232A]/30'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>CLI Setup</span>
            </button>
            {recommendation.terraformSnippet && (
              <button
                onClick={() => setActiveSnippetTab('tf')}
                className={`text-xs font-mono px-2 py-1 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                  activeSnippetTab === 'tf'
                    ? 'bg-[#1E232A] text-[#FAF9F5] border-[#1E232A]'
                    : 'bg-[#EFECE6] text-[#1E232A] border-[#1E232A]/30'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Terraform</span>
              </button>
            )}
          </div>

          <button
            onClick={() =>
              handleCopy(
                activeSnippetTab === 'cmd'
                  ? recommendation.deploymentQuickstartCmd
                  : recommendation.terraformSnippet || '',
                activeSnippetTab
              )
            }
            className="paper-btn paper-btn-neutral text-xs px-2 py-1"
            title="Copy snippet"
          >
            {copiedCode === activeSnippetTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2D5A46]" />
                <span className="text-[#2D5A46]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="rounded bg-[#1E232A] text-[#FAF9F5] p-3 font-mono text-[11px] sm:text-xs overflow-x-auto border border-[#1E232A] shadow-inner max-h-48">
          <pre className="whitespace-pre">
            {activeSnippetTab === 'cmd'
              ? recommendation.deploymentQuickstartCmd
              : recommendation.terraformSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
