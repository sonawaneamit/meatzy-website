'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  icon?: React.ReactNode;
  helpText?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  icon,
  helpText,
}: SliderProps) {
  const displayValue = formatValue ? formatValue(value) : value;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      {/* Label and Value */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-meatzy-rare">{icon}</div>}
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            {label}
          </label>
          {helpText && (
            <div className="group relative">
              <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10 w-72 max-w-[90vw]">
                <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl">
                  {helpText}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <span className="text-lg font-black text-meatzy-olive">
          {displayValue}
        </span>
      </div>

      {/* Slider Track */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #DE2626 0%, #DE2626 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`,
          }}
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: #DE2626;
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
        }

        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        input[type='range']::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #DE2626;
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
        }

        input[type='range']::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
