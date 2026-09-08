import React from 'react';

/**
 * Ashky Brand Orange Triangle Logo (Delta / Prism)
 * Exact geometric match for Ashky's brand identity.
 */
export function AshkyTriangleLogo({ size = 20, glow = true, className = '', style = {} }) {
  const gradId = React.useId ? `ashkyGrad-${React.useId().replace(/:/g, '')}` : 'ashkyTriangleGrad';
  const glowId = React.useId ? `ashkyGlow-${React.useId().replace(/:/g, '')}` : 'ashkyTriangleGlow';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style
      }}
      aria-label="Ashky Logo"
    >
      <defs>
        <linearGradient id={gradId} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        {glow && (
          <filter id={glowId} x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#f59e0b" floodOpacity="0.55" />
          </filter>
        )}
      </defs>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.5L2.2 21.5H21.8L12 2.5ZM12 8.2L6.8 18.2H17.2L12 8.2Z"
        fill={`url(#${gradId})`}
        stroke="#d97706"
        strokeWidth="0.75"
        strokeLinejoin="round"
        filter={glow ? `url(#${glowId})` : undefined}
      />
    </svg>
  );
}

export default AshkyTriangleLogo;
