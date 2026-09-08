import React from 'react';
import { Film, Search, BarChart3, Sparkles, Activity, ShieldCheck, Terminal, Layers } from 'lucide-react';
import { AshkyTriangleLogo } from './AshkyLogo';

export default function Navbar({ activeTab, setActiveTab, sidecarOpen, setSidecarOpen, systemHealthy = true }) {
  const navItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'video_studio', label: 'Video Studio', badge: '<2s Stream' },
    { id: 'geo_optimizer', label: 'GEO Search Engine', badge: 'Perplexity • Gemini' },
    { id: 'observability', label: 'Grafana SRE & Logs', badge: 'MCP' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 10, 12, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-default)',
      padding: '0 28px'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <AshkyTriangleLogo size={24} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{
              fontWeight: 700,
              fontSize: '1.15rem',
              letterSpacing: '-0.02em',
              color: '#ffffff'
            }}>
              Ashky
            </span>
            <span style={{
              fontSize: '0.68rem',
              padding: '2px 6px',
              borderRadius: '4px',
              background: '#1a1f28',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)'
            }}>
              AGENTIC CINEMA
            </span>
          </div>
        </div>

        {/* Matte Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#0d0f14',
          padding: '4px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent',
                  background: isActive ? '#1c212c' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '1px 5px',
                    borderRadius: '3px',
                    background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#cbd5e1' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: System Health & Grafana MCP Agent Drawer Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <span>SRE OPTIMAL</span>
          </div>

          <button
            onClick={() => setSidecarOpen(!sidecarOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              background: sidecarOpen ? '#272012' : 'rgba(245, 158, 11, 0.08)',
              color: '#fbbf24',
              border: sidecarOpen ? '1px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.3)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Terminal size={14} />
            <span>Grafana MCP Copilot</span>
          </button>
        </div>
      </div>
    </header>
  );
}
