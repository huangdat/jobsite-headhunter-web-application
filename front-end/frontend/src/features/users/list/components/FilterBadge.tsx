import React from 'react';

interface FilterBadgeProps {
  label: string;
  value: string;
  onRemove?: () => void;
}

export const FilterBadge: React.FC<FilterBadgeProps> = ({ label, value, onRemove }) => {
  return (
    <div className="px-3 py-1.5 text-primary border border-primary/20 rounded-full text-xs font-bold flex items-center gap-2 bg-primary/10">
      {label}: {value}
      <span
        onClick={onRemove}
        className="material-symbols-outlined text-sm cursor-pointer hover:text-red-500 transition-colors"
      >
        close
      </span>
    </div>
  );
};
