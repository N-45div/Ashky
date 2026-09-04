import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function LandingNavbar() {
  const navigate = useNavigate();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 10, 12, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0 28px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Left: Monogram & Brand Title */}
        <div 
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#ffffff',
            color: '#090a0f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.95rem',
            boxShadow: '0 2px 8px rgba(255, 255, 255, 0.15)'
          }}>
            @
          </div>
          <span style={{
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
            color: '#ffffff'
          }}>
            ashky
          </span>
        </div>

        {/* Right: SRE Status & Single Launch App Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.74rem',
            color: '#34d399',
            background: 'rgba(16, 185, 129, 0.06)',
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            fontFamily: 'var(--font-mono)'
          }}>
            <span className="status-dot status-dot-emerald" />
            <span className="hidden sm:inline">SRE OPTIMAL</span>
          </div>

          {/* Single Launch App Button -> moves to /app */}
          <button
            type="button"
            onClick={() => navigate('/app')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              color: '#090a0c',
              border: '1px solid #ffffff',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(255, 255, 255, 0.15)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Launch App</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
