import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  SlidersHorizontal, 
  ArrowRight, 
  Radio, 
  ShoppingBag, 
  Briefcase, 
  Cpu, 
  Globe2,
  MapPin,
  Users,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';
import { SAMPLE_USE_CASES } from '../data/cloudProviders';

interface WorkloadParams {
  region: string;
  scale: string;
  budget: string;
  compliance: string;
}

interface UseCaseInputProps {
  onSubmit: (useCase: string, params: WorkloadParams) => void;
  isLoading: boolean;
  initialUseCase?: string;
}

const PRESET_ICONS = [Radio, ShoppingBag, Briefcase, Cpu, Globe2];
const DEFAULT_WORKLOAD = 'Real-time web app with PostgreSQL database, background jobs, user authentication, and low latency in India and US.';

export const UseCaseInput: React.FC<UseCaseInputProps> = ({
  onSubmit,
  isLoading,
  initialUseCase = ''
}) => {
  const [useCase, setUseCase] = useState(initialUseCase || DEFAULT_WORKLOAD);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [params, setParams] = useState<WorkloadParams>({
    region: 'India & Global (Asia-South1)',
    scale: '50k DAU',
    budget: 'Cost-conscious (< ₹25,000/mo)',
    compliance: 'Standard'
  });

  useEffect(() => {
    if (initialUseCase) {
      setUseCase(initialUseCase);
    }
  }, [initialUseCase]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;
    const target = useCase.trim() || DEFAULT_WORKLOAD;
    if (!useCase.trim()) {
      setUseCase(DEFAULT_WORKLOAD);
    }
    onSubmit(target, params);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const loadPreset = (preset: typeof SAMPLE_USE_CASES[0]) => {
    setUseCase(preset.desc);
    setParams({
      region: preset.params.region,
      scale: preset.params.scale,
      budget: preset.params.budget,
      compliance: preset.params.compliance
    });
  };

  return (
    <div className="w-full">
      <div className="paper-box p-4 sm:p-6 bg-[#FAF9F5]">
        {/* Quick Presets */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-[#565E69] font-semibold">
              Select or customize a scenario:
            </span>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1.5 -mx-1 px-1">
            {SAMPLE_USE_CASES.map((sample, idx) => {
              const IconComp = PRESET_ICONS[idx % PRESET_ICONS.length];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadPreset(sample)}
                  className="flex-shrink-0 text-xs px-2.5 py-1.5 rounded bg-[#EFECE6] hover:bg-[#FAF9F5] border border-[#1E232A] shadow-[1px_1px_0px_#1E232A] transition-all hover:-translate-y-0.5 text-[#1E232A] cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <IconComp className="w-3.5 h-3.5 text-[#2D5A46]" />
                  <span className="font-semibold text-xs">{sample.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative mb-3">
          <textarea
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your app requirements..."
            rows={3}
            className="paper-input w-full p-3 sm:p-4 text-xs sm:text-sm md:text-base font-sans leading-relaxed resize-y focus:outline-none placeholder-[#565E69]/60 min-h-[90px]"
          />
        </div>

        {/* Constraints toggle */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-mono font-semibold text-[#1E232A] hover:text-[#2D5A46] flex items-center gap-1.5 cursor-pointer py-1"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2D5A46]" />
            <span>{showAdvanced ? 'Hide constraints' : 'Optional constraints (Region, Scale, Budget ₹)'}</span>
          </button>

          {showAdvanced && (
            <div className="mt-2.5 p-3 sm:p-4 rounded bg-[#EFECE6] border border-[#1E232A] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="font-mono font-semibold text-[#1E232A] mb-1 flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3 h-3 text-[#2D5A46]" />
                  <span>Region:</span>
                </label>
                <input
                  type="text"
                  value={params.region}
                  onChange={(e) => setParams({ ...params, region: e.target.value })}
                  className="paper-input w-full px-2.5 py-1.5 text-xs bg-[#FAF9F5]"
                  placeholder="e.g. Mumbai"
                />
              </div>

              <div>
                <label className="font-mono font-semibold text-[#1E232A] mb-1 flex items-center gap-1 text-[11px]">
                  <Users className="w-3 h-3 text-[#4A6B82]" />
                  <span>Scale:</span>
                </label>
                <input
                  type="text"
                  value={params.scale}
                  onChange={(e) => setParams({ ...params, scale: e.target.value })}
                  className="paper-input w-full px-2.5 py-1.5 text-xs bg-[#FAF9F5]"
                  placeholder="e.g. 50K DAU"
                />
              </div>

              <div>
                <label className="font-mono font-semibold text-[#1E232A] mb-1 flex items-center gap-1 text-[11px]">
                  <IndianRupee className="w-3 h-3 text-[#D97746]" />
                  <span>Budget:</span>
                </label>
                <input
                  type="text"
                  value={params.budget}
                  onChange={(e) => setParams({ ...params, budget: e.target.value })}
                  className="paper-input w-full px-2.5 py-1.5 text-xs bg-[#FAF9F5]"
                  placeholder="e.g. < ₹25,000/mo"
                />
              </div>

              <div>
                <label className="font-mono font-semibold text-[#1E232A] mb-1 flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3 h-3 text-[#1E232A]" />
                  <span>Compliance:</span>
                </label>
                <input
                  type="text"
                  value={params.compliance}
                  onChange={(e) => setParams({ ...params, compliance: e.target.value })}
                  className="paper-input w-full px-2.5 py-1.5 text-xs bg-[#FAF9F5]"
                  placeholder="e.g. Standard"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-[#1E232A]/20 flex justify-end">
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className="paper-btn paper-btn-primary w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm cursor-pointer"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#F7F4EE] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span>Finding Best Cloud...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>Find Best Cloud Provider</span>
                <ArrowRight className="w-4 h-4 ml-1 flex-shrink-0" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
