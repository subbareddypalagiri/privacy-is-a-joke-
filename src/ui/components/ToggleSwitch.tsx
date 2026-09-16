import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: { container: 'w-8 h-4', dot: 'w-3 h-3', translate: 'translate-x-4' },
    md: { container: 'w-11 h-6', dot: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { container: 'w-14 h-8', dot: 'w-6 h-6', translate: 'translate-x-6' },
  };

  return (
    <label className="flex items-center justify-between cursor-pointer group">
      {(label || description) && (
        <div className="flex flex-col pr-3">
          {label && <span className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors">{label}</span>}
          {description && <span className="text-xs text-[#71717a]">{description}</span>}
        </div>
      )}
      <div
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center rounded-full transition-all duration-300 p-0.5 border ${
          sizeClasses[size].container
        } ${
          checked
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 border-amber-500 shadow-sm shadow-amber-500/40'
            : 'bg-[#27272a] border-[#3f3f46] hover:bg-[#3f3f46]'
        }`}
      >
        <div
          className={`transform rounded-full bg-white transition-all duration-300 shadow-md ${
            sizeClasses[size].dot
          } ${checked ? sizeClasses[size].translate : 'translate-x-0.5'}`}
        />
      </div>
    </label>
  );
};
