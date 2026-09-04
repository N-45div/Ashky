import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Film, Search, BarChart3, Terminal, Home, 
  PanelLeftClose, PanelLeft, Plus, Sparkles,
  Activity, Layers, ArrowUpRight, Zap
} from 'lucide-react';

export default function AppSidebar({
  activeTab,
  onSelectTab,
  onOpenSidecar,
  onNewCampaign,
  isCollapsed,
  setIsCollapsed
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredTab, setHoveredTab] = useState(null);

  const mainTabs = [
    {
      id: 'studio',
      label: 'Video Studio',
      icon: Film,
      desc: 'Autonomous 9:16 reels director',
      badge: '<2s'
    },
    {
      id: 'geo',
      label: 'GEO Engine',
      icon: Search,
      desc: 'Generative search optimization',
      badge: 'GEO'
    },
    {
      id: 'observability',
      label: 'Grafana SRE',
      icon: BarChart3,
      desc: 'Loki logs & SLO telemetry',
      badge: 'MCP'
    }
  ];

  const presets = [
    { name: 'LaunchFlow', category: 'B2B SaaS' },
    { name: 'VectorLite', category: 'Edge Vector DB' },
    { name: 'AdMorph', category: 'Growth Copilot' },
    { name: 'CinemaFlow', category: 'Generative Media' }
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 68 : 260 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        height: '100vh',
        background: '#0a0c10',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 40,
        userSelect: 'none',
        flexShrink: 0,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {/* Top Header Section */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Brand & Collapse/Expand Toggle */}
        <div style={{
          height: '56px',
          padding: isCollapsed ? '0 16px' : '0 16px 0 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {!isCollapsed && (
            <div 
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: '#ffffff',
                color: '#090a0f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.8rem'
              }}>
                @
              </div>
              <span style={{
                fontWeight: 700,
                fontSize: '1.05rem',
                letterSpacing: '-0.02em',
                color: '#ffffff'
              }}>
                ashky
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 600,
                color: '#94a3b8',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '2px 5px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)'
              }}>
                APP
              </span>
            </div>
          )}

          {/* Toggle Sidebar Collapse (ChatGPT style) */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Open sidebar" : "Close sidebar"}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* New Campaign Action Button (like ChatGPT's + New Chat) */}
        <div style={{ padding: isCollapsed ? '12px 10px' : '12px 14px' }}>
          <button
            type="button"
            onClick={onNewCampaign}
            title={isCollapsed ? "New Video Campaign" : ""}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              padding: isCollapsed ? '10px' : '9px 14px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            <Plus size={16} color="#60a5fa" />
            {!isCollapsed && <span>New Campaign</span>}
          </button>
        </div>

        {/* Navigation Tabs List */}
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: isCollapsed ? '0 10px' : '0 12px'
        }}>
          {mainTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <div
                key={tab.id}
                style={{ position: 'relative' }}
                onMouseEnter={() => isCollapsed && setHoveredTab(tab.id)}
                onMouseLeave={() => isCollapsed && setHoveredTab(null)}
              >
                <button
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: '12px',
                    padding: isCollapsed ? '11px 0' : '9px 12px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(59, 130, 246, 0.14)' : 'transparent',
                    border: isActive 
                      ? '1px solid rgba(59, 130, 246, 0.35)' 
                      : '1px solid transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#94a3b8';
                    }
                  }}
                >
                  <Icon 
                    size={18} 
                    color={isActive ? '#60a5fa' : '#94a3b8'} 
                    style={{ flexShrink: 0 }}
                  />

                  {!isCollapsed && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flex: 1,
                      minWidth: 0
                    }}>
                      <span style={{
                        fontSize: '0.86rem',
                        fontWeight: isActive ? 600 : 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {tab.label}
                      </span>
                      {tab.badge && (
                        <span style={{
                          fontSize: '0.65rem',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          background: isActive ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                          color: isActive ? '#93c5fd' : '#64748b',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {tab.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* Floating Tooltip in Collapsed Mode (like ChatGPT) */}
                {isCollapsed && hoveredTab === tab.id && (
                  <div style={{
                    position: 'absolute',
                    left: 'calc(100% + 10px)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#181c24',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                    pointerEvents: 'none',
                    zIndex: 100
                  }}>
                    {tab.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Preset Campaigns (Shown when expanded) */}
        {!isCollapsed && (
          <div style={{ padding: '18px 14px 0' }}>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '8px',
              paddingLeft: '4px',
              fontFamily: 'var(--font-mono)'
            }}>
              Quick Templates
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onSelectTab('studio', preset.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.78rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{preset.name}</span>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{preset.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Section */}
      <div style={{
        padding: isCollapsed ? '12px 10px' : '14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        {/* Grafana MCP Copilot Button */}
        <button
          type="button"
          onClick={onOpenSidecar}
          title={isCollapsed ? "Grafana MCP Copilot" : ""}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '10px',
            padding: isCollapsed ? '10px' : '8px 12px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            color: '#fbbf24',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.25)';
          }}
        >
          <Terminal size={17} style={{ flexShrink: 0 }} />
          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fef3c7' }}>
                Grafana Copilot
              </span>
              <span style={{ fontSize: '0.68rem', color: '#fcd34d' }}>
                Live Agent SRE
              </span>
            </div>
          )}
        </button>

        {/* Back to Home / Landing */}
        <button
          type="button"
          onClick={() => navigate('/')}
          title={isCollapsed ? "Back to Overview" : ""}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '10px',
            padding: isCollapsed ? '10px' : '8px 12px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <Home size={17} style={{ flexShrink: 0 }} />
          {!isCollapsed && (
            <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>
              Back to Overview
            </span>
          )}
        </button>

        {/* Status indicator */}
        {!isCollapsed && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            fontSize: '0.7rem',
            color: '#10b981',
            fontFamily: 'var(--font-mono)'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 6px #10b981'
            }} />
            <span>Gemini 3.7 Flash • Optimal</span>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
