import React, { useState } from 'react';
import { CLOUD_PROVIDERS, CloudProviderInfo } from '../data/cloudProviders';
import { ExternalLink, Check, Server, Shield, MapPin, IndianRupee, AlertTriangle, ArrowRight } from 'lucide-react';

interface ProviderCatalogueProps {
  onSelectProviderAsQuery?: (provider: CloudProviderInfo) => void;
}

export const ProviderCatalogue: React.FC<ProviderCatalogueProps> = ({
  onSelectProviderAsQuery
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const providers = Object.values(CLOUD_PROVIDERS);
  const activeProvider = selectedId ? CLOUD_PROVIDERS[selectedId] : null;

  return (
    <div className="paper-box bg-[#FAF9F5] p-4 sm:p-6 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-[#1E232A]/20">
        <div>
          <span className="font-mono text-[10px] sm:text-xs uppercase font-bold tracking-wider text-[#565E69] bg-[#EFECE6] px-2 py-0.5 rounded border border-[#1E232A]/20">
            Cloud Provider Directory
          </span>
          <h3 className="font-display font-bold text-base sm:text-lg md:text-xl text-[#1E232A] mt-1">
            Supported Hyperscalers, Edge Networks & Specialized Clouds
          </h3>
        </div>
        <p className="text-[11px] text-[#565E69] font-mono hidden sm:block">
          Tap any cloud to view footprints & strengths
        </p>
      </div>

      {/* Provider Pill Grid (4 columns on mobile, 8 on desktop) */}
      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {providers.map((p) => {
          const isSelected = selectedId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(isSelected ? null : p.id)}
              className={`p-1.5 sm:p-2 rounded border-[1.5px] transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                isSelected
                  ? 'bg-[#EFECE6] border-[#1E232A] shadow-[2px_2px_0px_#1E232A] -translate-y-0.5'
                  : 'bg-[#FAF9F5] border-[#1E232A]/40 hover:border-[#1E232A] hover:bg-[#EFECE6]/50 shadow-[1px_1px_0px_#1E232A]'
              }`}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-white p-1 border border-[#1E232A]/20 flex items-center justify-center">
                {p.logoUrl ? (
                  <img
                    src={p.logoUrl}
                    alt={p.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  p.logoSvg
                )}
              </div>
              <span className="font-display font-bold text-[10px] sm:text-xs text-[#1E232A] truncate w-full text-center">
                {p.shortName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Provider Expansion Card */}
      {activeProvider && (
        <div className="paper-box-subtle p-3 sm:p-4 rounded-md border border-[#1E232A] my-1 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#1E232A]/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-[#FAF9F5] border border-[#1E232A] p-1.5 flex items-center justify-center flex-shrink-0">
                {activeProvider.logoUrl ? (
                  <img
                    src={activeProvider.logoUrl}
                    alt={activeProvider.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  activeProvider.logoSvg
                )}
              </div>
              <div>
                <h4 className="font-display font-bold text-sm sm:text-base text-[#1E232A]">
                  {activeProvider.name}
                </h4>
                <p className="text-[11px] sm:text-xs text-[#2D5A46] font-medium leading-tight">
                  {activeProvider.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <span className="font-mono text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#1E232A] text-[#1E232A]">
                {activeProvider.typicalMonthlyPricing}
              </span>
              {onSelectProviderAsQuery && (
                <button
                  onClick={() => onSelectProviderAsQuery(activeProvider)}
                  className="paper-btn paper-btn-neutral text-xs px-2.5 py-1"
                >
                  <span>Evaluate {activeProvider.shortName}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-[#1E232A] my-2.5 leading-relaxed">
            {activeProvider.overview}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-[#FAF9F5] p-2.5 rounded border border-[#1E232A]/20">
              <span className="font-bold text-[#2D5A46] text-[11px] flex items-center gap-1 mb-1">
                <Check className="w-3 h-3" /> Best Used For:
              </span>
              <ul className="space-y-0.5 text-[11px] text-[#1E232A]">
                {activeProvider.bestFor.map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#FAF9F5] p-2.5 rounded border border-[#1E232A]/20">
              <span className="font-bold text-[#D97746] text-[11px] flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3 h-3" /> Watch-outs:
              </span>
              <ul className="space-y-0.5 text-[11px] text-[#1E232A]">
                {activeProvider.watchOutFor.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#FAF9F5] p-2.5 rounded border border-[#1E232A]/20">
              <span className="font-bold text-[#4A6B82] text-[11px] flex items-center gap-1 mb-1">
                <MapPin className="w-3 h-3" /> Regional Footprint (India):
              </span>
              <ul className="space-y-0.5 text-[11px] text-[#1E232A]">
                {activeProvider.regionsInIndia.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
