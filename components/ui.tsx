
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, actions }) => {
  return (
    <div className="rounded-2xl bg-slate-950/60 border border-sky-900/60 shadow-[0_0_0_1px_rgba(8,47,73,0.25)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
};

export const Empty: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-900/40 border border-sky-900/50 text-sm text-sky-300">{text}</div>
  );
};

export const LoadingOverlay: React.FC = () => (
    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
        <div className="flex items-center gap-2 text-sky-200">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang tạo...</span>
        </div>
    </div>
);
