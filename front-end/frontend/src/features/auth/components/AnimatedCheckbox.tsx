import React from "react";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function AnimatedCheckbox({ checked, onChange, label }: Props) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span className="relative w-5 h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* SVG checkbox */}
        <svg
          viewBox="0 0 22 22"
          className={`w-5 h-5 border-2 rounded ${
            checked ? "text-lime-500 border-lime-500" : "border-gray-400"
          }`}
        >
          <path
            d="M5.5 11.3L9 14.8L20.2 3.3"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className={`transition-all duration-300 ${
              checked ? "opacity-100" : "opacity-0"
            }`}
          />
        </svg>
      </span>

      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
