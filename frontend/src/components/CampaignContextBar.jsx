import React from 'react';
import { Film, Search, BarChart3, Terminal, Activity, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export default function CampaignContextBar({
  campaignName = 'Neon Circuit',
  category = 'Indie Game',
  status = 'Reviewing', // 'Draft' | 'Planning' | 'Generating' | 'Reviewing' | 'Discovery Ready' | 'Complete'
  activeTab = 'studio',
  onSelectTab,
  onOpenSidecar,
  lastUpdated = 'Just now'
}) {
  const getStatusColor = (st) => {
    switch (st?.toLowerCase()) {
      case 'generating':
      case 'planning':
        return { bg: 'rgba(59, 130, 246, 0.12)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
      case 'reviewing':
        return { bg: 'rgba(245, 158, 11, 0.12)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      case 'discovery ready':
      case 'published':
      case 'complete':
        return { bg: 'rgba(16, 185, 129, 0.12)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.12)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.25)' };
    }
  };

  const statusStyle = getStatusColor(status);

  const stages = [
    { id: 'studio', label: '1. Create', desc: 'Scene Plan' },
    { id: 'review', label: '2. Review', desc: 'Hook Retention' },
    { id: 'geo', label: '3. Discover', desc: 'AI Citations' },
    { id: 'observability', label: '4. Operate', desc: 'Telemetry' }
  ];

  return (
    <div style={{
      background: '#0d0f14',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
      minHeight: '48px',
      userSelect: 'none'
    }}>
      {/* Left: Active Campaign Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'var(--font-mono)'
          }}>
            CAMPAIGN:
          </span>
          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
            {campaignName}
          </span>
          <span style={{
            fontSize: '0.68rem',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.07)',
            color: '#cbd5e1',
            fontWeight: 500
          }}>
            {category}
          </span>
        </div>

        {/* Status Badge */}
        <span style={{
          fontSize: '0.68rem',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '12px',
          background: statusStyle.bg,
          color: statusStyle.text,
          border: `1px solid ${statusStyle.border}`,
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {status}
        </span>

        <span style={{ fontSize: '0.72rem', color: '#64748b' }} className="hidden md:inline">
          • Updated {lastUpdated}
        </span>
      </div>

      {/* Center: Growth Loop Lifecycle Steps */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: '#07080a',
        padding: '3px 6px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }} className="hidden lg:flex">
        {stages.map((st, i) => {
          const isCurrent = 
            (st.id === 'studio' && activeTab === 'studio') ||
            (st.id === 'review' && activeTab === 'studio') ||
            (st.id === 'geo' && activeTab === 'geo') ||
            (st.id === 'observability' && activeTab === 'observability');

          return (
            <React.Fragment key={st.id}>
              {i > 0 && <span style={{ color: '#334155', fontSize: '0.7rem' }}>→</span>}
              <button
                type="button"
                onClick={() => {
                  if (st.id === 'studio' || st.id === 'review') onSelectTab('studio');
                  else if (st.id === 'geo') onSelectTab('geo');
                  else if (st.id === 'observability') onSelectTab('observability');
                }}
                style={{
                  background: isCurrent ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: 'none',
                  color: isCurrent ? '#f8fafc' : '#64748b',
                  fontSize: '0.74rem',
                  fontWeight: isCurrent ? 600 : 500,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {st.label}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Right: Health & Agent trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.72rem',
          color: '#34d399',
          background: 'rgba(16, 185, 129, 0.06)',
          padding: '3px 8px',
          borderRadius: '6px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 6px #10b981'
          }} />
          <span>PIPELINE HEALTHY</span>
        </div>

        <button
          type="button"
          onClick={onOpenSidecar}
          title="Open Ashky Pipeline Agent with Grafana evidence"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            color: '#fbbf24',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.08)';
          }}
        >
          <Terminal size={13} />
          <span>Pipeline Agent</span>
        </button>
      </div>
    </div>
  );
}
