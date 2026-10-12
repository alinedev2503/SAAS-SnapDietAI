import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'bottom',
  className = '',
}) => {
  return (
    <div className={`relative group/tooltip inline-flex items-center ${className}`}>
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute z-50 px-2 py-1 text-[11px] font-medium leading-none text-white bg-slate-900/95 dark:bg-slate-800/95 dark:text-slate-100 rounded-md shadow-lg border border-slate-700/50 dark:border-slate-600/50 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 transition-opacity duration-150 delay-75 left-1/2 -translate-x-1/2 ${
          position === 'top'
            ? 'bottom-full mb-1.5'
            : 'top-full mt-1.5'
        }`}
      >
        {content}
        <span
          className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
            position === 'top'
              ? 'top-full border-t-slate-900 dark:border-t-slate-800'
              : 'bottom-full border-b-slate-900 dark:border-b-slate-800'
          }`}
        />
      </div>
    </div>
  );
};
