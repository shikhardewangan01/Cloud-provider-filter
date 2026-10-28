import React from 'react';
import { Cloud, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasActiveDiagnosis: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, hasActiveDiagnosis }) => {
  return (
    <header className="border-b-[1.5px] border-[#1E232A] bg-[#FAF9F5] px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 sticky top-0 z-30 shadow-[0_2px_0px_#1E232A]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded bg-[#2D5A46] border-[1.5px] border-[#1E232A] flex items-center justify-center text-[#F7F4EE] shadow-[1.5px_1.5px_0px_#1E232A] flex-shrink-0">
            <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display font-bold text-base sm:text-lg text-[#1E232A] tracking-tight">
                <span className="hidden sm:inline">Warm Paper </span>Cloud Advisor
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-mono font-semibold uppercase bg-[#2D5A46]/10 text-[#2D5A46] border border-[#2D5A46]/30">
                v2.1
              </span>
            </div>
            <p className="text-[11px] text-[#565E69] hidden md:block">
              Multi-cloud architecture diagnosis & best-in-class provider evaluator
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#565E69] bg-[#EFECE6] px-2.5 py-1 rounded border border-[#1E232A]/30">
            <span className="w-2 h-2 rounded-full bg-[#2D5A46] inline-block animate-pulse" />
            <span>Gemini 3.1 Flash Lite</span>
          </div>

          {hasActiveDiagnosis && (
            <button
              onClick={onReset}
              className="paper-btn paper-btn-neutral text-xs px-2.5 py-1 sm:px-3 sm:py-1.5"
              title="Reset and analyze new workload"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Workload</span>
              <span className="sm:hidden font-mono font-bold">Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
