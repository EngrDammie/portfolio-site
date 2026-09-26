import React from 'react';

interface DOMonogramProps {
  className?: string;
  gradientId?: string;
}

/**
 * 1. PURE DO MONOGRAM
 * Renders only the interlocking D + O circuit and the AI center node.
 * Inherits sizing from the parent container via className (e.g. "w-10 h-8").
 */
export const DOMonogram: React.FC<DOMonogramProps> = ({
  className = 'w-12 h-9',
  gradientId = 'optimusGrad',
}) => {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Dammie Optimus Monogram"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Interlocking Circuit Group (D & O) */}
      <g
        stroke={`url(#${gradientId})`}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* The "D" Shape (Stem + Outer Curve) */}
        <path d="M 30 25 L 30 95" />
        <path d="M 30 25 L 60 25 A 35 35 0 0 1 60 95 L 30 95" />

        {/* The "O" Shape (Outer Ring) */}
        <circle cx="100" cy="60" r="35" />
      </g>

      {/* The Central Node (AI / Tech indicator inside the 'O') */}
      <circle cx="100" cy="60" r="10" fill={`url(#${gradientId})`} />
    </svg>
  );
};

/**
 * 2. BRAND LOGO IN THE OPTIMUS BOX
 * Places your exact DO monogram centered inside a sleek, glowing tech box.
 * Ideal for headers, footers, app cards, and profile badges.
 */
export const BrandLogo: React.FC<{ className?: string }> = ({
  className = 'w-10 h-10',
}) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-slate-900/90 border border-emerald-500/30 p-1.5 shadow-md shadow-emerald-500/10 group-hover:border-emerald-500/60 transition-all ${className}`}
    >
      <DOMonogram className="w-full h-full object-contain" />
    </div>
  );
};

export default DOMonogram;