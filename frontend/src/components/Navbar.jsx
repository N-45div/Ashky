import React from 'react';
import { Film, Search, BarChart3, Bot, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, sidecarOpen, setSidecarOpen, systemHealthy = true }) {
  const navItems = [
    { id: 'video_studio', label: 'Progressive Video Studio', icon: Film, badge: 'FirstFrame UX' },
    { id: 'geo_optimizer', label: 'AI Search Optimizer (GEO)', icon: Search, badge: 'ChatGPT • Gemini' },
    { id: 'observability', label: 'Grafana Telemetry & SRE', icon: BarChart3, badge: 'Prometheus • MCP' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(6, 7, 10, 0.82)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Film size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.35rem',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ffffff 30%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Ashky
              </span>
              <span style={{
                fontSize: '0.68rem',
                padding: '2px 7px',
                borderRadius: '6px',
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#c084fc',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                fontWeight: 600,
                letterSpacing: '0.04em'
              }}>
                AGENTIC CINEMA
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              Autonomous Video Marketing & GEO Studio
            </p>
          </div>
        </div>

        {/* Engine Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(14, 16, 23, 0.7)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '9px',
                  border: isActive ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                  background: isActive ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0.18) 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#c084fc' : 'currentColor'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#f8fafc' : 'var(--text-muted)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status indicator & SRE Agent Sidecar Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '0.78rem',
            color: '#34d399',
            background: 'rgba(16, 185, 129, 0.08)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981'
            }} className="animate-pulse-glow" />
            <span style={{ fontWeight: 600 }}>PIPELINE OPTIMAL</span>
          </div>

          <button
            onClick={() => setSidecarOpen(!sidecarOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: sidecarOpen 
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.12) 100%)',
              color: sidecarOpen ? '#000000' : '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              padding: '8px 14px',
              borderRadius: '10px',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: sidecarOpen ? '0 0 16px rgba(245, 158, 11, 0.4)' : 'none'
            }}
          >
            <Sparkles size={16} />
            <span>Grafana MCP Agent</span>
          </button>
        </div>
      </div>
    </header>
  );
}
