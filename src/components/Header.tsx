import React from 'react';
import { Cloud, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasActiveDiagnosis: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, hasActiveDiagnosis }) => {
  return (
    <header className="border-b-[1.5px] border-[#1E232A] bg-[#FAF9F5] px-4 md:px-8 py-3 sticky top-0 z-30 shadow-[0_2px_0px_#1E232A]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#2D5A46] border-[1.5px] border-[#1E232A] flex items-center justify-center text-[#F7F4EE] shadow-[1.5px_1.5px_0px_#1E232A] flex-shrink-0">
            <Cloud className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg text-[#1E232A] tracking-tight">
            Cloud Advisor
          </span>
        </div>

        {hasActiveDiagnosis && (
          <button
            onClick={onReset}
            className="paper-btn paper-btn-neutral text-xs px-3 py-1.5"
            title="Start new workload inquiry"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Inquiry</span>
          </button>
        )}
      </div>
    </header>
  );
};
