import React, { useState } from 'react';
import { Award, MessageSquare, Check, X, Sliders, ChevronRight, IndianRupee, Layers } from 'lucide-react';
import { CLOUD_PROVIDERS } from '../data/cloudProviders';

export interface ContenderScore {
  providerName: string;
  scores: {
    dimension: string;
    score: number;
    comment: string;
  }[];
}

export interface ComparisonMatrixData {
  dimensions: string[];
  primaryProviderScores: {
    dimension: string;
    score: number;
    comment: string;
  }[];
  contenderScores: ContenderScore[];
}

export interface RunnerUp {
  id: string;
  name: string;
  matchScore: number;
  pros: string;
  whyItFellShort: string;
  estimatedMonthlyCostInr: number;
}

interface ComparisonMatrixProps {
  primaryName: string;
  primaryId: string;
  runnerUps: RunnerUp[];
  matrix: ComparisonMatrixData;
  onAskComparison: (providerName: string) => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  primaryName,
  primaryId,
  runnerUps,
  matrix,
  onAskComparison
}) => {
  const [selectedMobileDim, setSelectedMobileDim] = useState<string>(matrix.dimensions[0] || '');

  const primaryMeta = CLOUD_PROVIDERS[primaryId.toLowerCase()] || CLOUD_PROVIDERS.gcp;

  const formatInr = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#2D5A46] bg-[#2D5A46]/10 border-[#2D5A46]/30';
    if (score >= 80) return 'text-[#4A6B82] bg-[#4A6B82]/10 border-[#4A6B82]/30';
    return 'text-[#D97746] bg-[#D97746]/10 border-[#D97746]/30';
  };

  return (
    <div className="paper-box bg-[#FAF9F5] p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#1E232A]/20">
        <div>
          <span className="font-mono text-[10px] sm:text-xs uppercase font-bold tracking-wider text-[#4A6B82] bg-[#4A6B82]/10 px-2 py-0.5 rounded border border-[#4A6B82]/20">
            Trade-off Matrix
          </span>
          <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-[#1E232A] mt-1">
            Contender Evaluation & Alternatives
          </h2>
        </div>
        <p className="text-[11px] text-[#565E69] font-mono hidden sm:block">
          Side-by-side performance & financial calibration
        </p>
      </div>

      {/* Runner Up Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        {runnerUps.map((runner, idx) => {
          const runnerMeta = CLOUD_PROVIDERS[runner.id.toLowerCase()] || CLOUD_PROVIDERS.aws;
          return (
            <div key={idx} className="paper-box-subtle p-3.5 sm:p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#FAF9F5] border border-[#1E232A] p-1 flex items-center justify-center flex-shrink-0">
                      {runnerMeta.logoUrl ? (
                        <img
                          src={runnerMeta.logoUrl}
                          alt={runner.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        runnerMeta.logoSvg
                      )}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-[#1E232A]">
                        {runner.name}
                      </h4>
                      <span className="text-[9px] sm:text-[10px] font-mono text-[#565E69]">
                        Runner-up #{idx + 1}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#1E232A] text-[#1E232A]">
                    {runner.matchScore}% Match
                  </span>
                </div>

                <div className="space-y-1.5 text-xs mb-3">
                  <div className="bg-[#FAF9F5] p-2 rounded border border-[#1E232A]/20">
                    <span className="font-semibold text-[#2D5A46] text-[11px] block mb-0.5 flex items-center gap-1">
                      <Check className="w-3 h-3 flex-shrink-0" />
                      <span>Strength:</span>
                    </span>
                    <p className="text-[#1E232A] text-[11px] leading-snug">{runner.pros}</p>
                  </div>

                  <div className="bg-[#FAF9F5] p-2 rounded border border-[#D97746]/40">
                    <span className="font-semibold text-[#D97746] text-[11px] block mb-0.5 flex items-center gap-1">
                      <X className="w-3 h-3 flex-shrink-0" />
                      <span>Limitation:</span>
                    </span>
                    <p className="text-[#1E232A] text-[11px] leading-snug">{runner.whyItFellShort}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#1E232A]/20 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[9px] text-[#565E69] block font-mono">Est. Monthly:</span>
                  <span className="font-display font-bold text-xs sm:text-sm text-[#1E232A] tabular-nums">
                    {formatInr(runner.estimatedMonthlyCostInr)}
                  </span>
                </div>

                <button
                  onClick={() => onAskComparison(runner.name)}
                  className="paper-btn paper-btn-neutral text-[11px] px-2 py-1"
                  title="Compare with this provider in chat"
                >
                  <MessageSquare className="w-3 h-3 text-[#4A6B82]" />
                  <span>Compare</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE VIEW: Interactive Dimension Selector & Cards (< md) */}
      <div className="block md:hidden">
        <div className="mb-2.5">
          <span className="text-[11px] font-mono text-[#565E69] font-semibold block mb-1">
            Select Metric Dimension:
          </span>
          <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-1 -mx-1 px-1">
            {matrix.dimensions.map((dim) => (
              <button
                key={dim}
                onClick={() => setSelectedMobileDim(dim)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded whitespace-nowrap border cursor-pointer ${
                  selectedMobileDim === dim
                    ? 'bg-[#1E232A] text-[#FAF9F5] border-[#1E232A]'
                    : 'bg-[#EFECE6] text-[#1E232A] border-[#1E232A]/30'
                }`}
              >
                {dim}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Dimension Card */}
        {(() => {
          const activeDim = selectedMobileDim || matrix.dimensions[0];
          const primaryScore = matrix.primaryProviderScores.find(s => s.dimension === activeDim);
          return (
            <div className="paper-box-subtle p-3.5 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E232A]/20">
                <span className="font-display font-bold text-xs text-[#1E232A] uppercase">
                  {activeDim}
                </span>
                <span className="text-[10px] font-mono text-[#565E69]">Direct Comparison</span>
              </div>

              {/* Winner Row */}
              <div className="bg-[#FAF9F5] p-2.5 rounded border border-[#2D5A46] shadow-[1px_1px_0px_#2D5A46]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#2D5A46] flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>★ {primaryName} (Winner)</span>
                  </span>
                  <span className={`px-1.5 py-0.2 rounded font-mono font-bold text-[10px] border ${getScoreColor(primaryScore?.score || 90)}`}>
                    {primaryScore?.score || 90}/100
                  </span>
                </div>
                <p className="text-[11px] text-[#1E232A] leading-snug">
                  {primaryScore?.comment}
                </p>
              </div>

              {/* Contenders Rows */}
              {matrix.contenderScores.map((c, i) => {
                const cScore = c.scores.find(s => s.dimension === activeDim);
                return (
                  <div key={i} className="bg-[#FAF9F5] p-2.5 rounded border border-[#1E232A]/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-[#1E232A]">
                        {c.providerName}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded font-mono font-bold text-[10px] border ${getScoreColor(cScore?.score || 75)}`}>
                        {cScore?.score || 75}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-[#565E69] leading-snug">
                      {cScore?.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* DESKTOP VIEW: Full Structured Comparison Table (>= md) */}
      <div className="hidden md:block overflow-x-auto border border-[#1E232A] rounded-md shadow-[2px_2px_0px_#1E232A]">
        <table className="w-full text-left text-xs bg-[#FAF9F5] border-collapse">
          <thead>
            <tr className="border-b-[1.5px] border-[#1E232A] bg-[#EFECE6]">
              <th className="p-3 font-display font-bold text-[#1E232A] uppercase tracking-wider w-1/4">
                Evaluation Dimension
              </th>
              <th className="p-3 font-display font-bold text-[#2D5A46] uppercase tracking-wider w-3/8 bg-[#2D5A46]/10 border-l border-r border-[#1E232A]">
                ★ {primaryName} (Winner)
              </th>
              {matrix.contenderScores.slice(0, 2).map((contender, i) => (
                <th key={i} className="p-3 font-display font-bold text-[#1E232A] uppercase tracking-wider w-3/8 border-r border-[#1E232A] last:border-r-0">
                  {contender.providerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.dimensions.map((dim, rowIdx) => {
              const primaryScore = matrix.primaryProviderScores.find(s => s.dimension === dim);
              return (
                <tr
                  key={rowIdx}
                  className="border-b border-[#1E232A]/20 hover:bg-[#FAF9F5] transition-colors"
                >
                  <td className="p-3 font-semibold text-[#1E232A] bg-[#EFECE6]/50">
                    {dim}
                  </td>

                  <td className="p-3 bg-[#2D5A46]/5 border-l border-r border-[#1E232A]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] border ${getScoreColor(primaryScore?.score || 90)}`}>
                        {primaryScore?.score || 92}/100
                      </span>
                    </div>
                    <p className="text-[#1E232A] text-[11px] leading-snug">
                      {primaryScore?.comment}
                    </p>
                  </td>

                  {matrix.contenderScores.slice(0, 2).map((contender, colIdx) => {
                    const cScore = contender.scores.find(s => s.dimension === dim);
                    return (
                      <td key={colIdx} className="p-3 border-r border-[#1E232A] last:border-r-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] border ${getScoreColor(cScore?.score || 75)}`}>
                            {cScore?.score || 78}/100
                          </span>
                        </div>
                        <p className="text-[#565E69] text-[11px] leading-snug">
                          {cScore?.comment}
                        </p>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
