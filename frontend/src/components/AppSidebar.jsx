import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Film, Search, BarChart3, Terminal, Home, 
  PanelLeftClose, PanelLeft, Plus, Cloud, Activity, CheckCircle2
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
  const [hoveredTab, setHoveredTab] = useState(null);

  const campaignTabs = [
    {
      id: 'studio',
      label: 'Video Studio',
      icon: Film,
      badge: 'Create'
    },
    {
      id: 'geo',
      label: 'AI Search',
      icon: Search,
      badge: 'GEO'
    }
  ];

  const opsTabs = [
    {
      id: 'observability',
      label: 'Pipeline Ops',
      icon: BarChart3,
      badge: 'Grafana'
    }
  ];

  const recentCampaigns = [
    { name: 'Neon Circuit', category: 'Indie Game' },
    { name: 'LaunchFlow', category: 'B2B SaaS' },
    { name: 'VectorLite', category: 'DevTool' }
  ];

  const connectedServices = [
    { name: 'Google Cloud', status: 'Active', color: '#34d399' },
    { name: 'Grafana Cloud', status: 'MCP', color: '#fbbf24' }
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
                STUDIO
              </span>
            </div>
          )}

          {/* Toggle Sidebar Collapse */}
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

        {/* New Campaign Action Button */}
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
            {!isCollapsed && <span>New campaign</span>}
          </button>
        </div>

        {/* CAMPAIGN Group */}
        <div style={{ padding: isCollapsed ? '0 10px' : '0 12px' }}>
          {!isCollapsed && (
            <div style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '6px 8px 4px',
              fontFamily: 'var(--font-mono)'
            }}>
              Campaign
            </div>
          )}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {campaignTabs.map((tab) => {
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
                      padding: isCollapsed ? '10px 0' : '8px 12px',
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
                          fontSize: '0.85rem',
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

                  {/* Collapsed Tooltip */}
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
        </div>

        {/* OPERATIONS Group */}
        <div style={{ padding: isCollapsed ? '8px 10px 0' : '10px 12px 0' }}>
          {!isCollapsed && (
            <div style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '6px 8px 4px',
              fontFamily: 'var(--font-mono)'
            }}>
              Operations
            </div>
          )}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {opsTabs.map((tab) => {
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
                      padding: isCollapsed ? '10px 0' : '8px 12px',
                      borderRadius: '8px',
                      background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                      border: isActive 
                        ? '1px solid rgba(245, 158, 11, 0.35)' 
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
                      color={isActive ? '#fbbf24' : '#94a3b8'} 
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
                          fontSize: '0.85rem',
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
                            background: isActive ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                            color: isActive ? '#fcd34d' : '#64748b',
                            fontFamily: 'var(--font-mono)'
                          }}>
                            {tab.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>

                  {/* Collapsed Tooltip */}
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
        </div>

        {/* RECENT CAMPAIGNS (Shown when expanded) */}
        {!isCollapsed && (
          <div style={{ padding: '16px 14px 0' }}>
            <div style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px',
              paddingLeft: '4px',
              fontFamily: 'var(--font-mono)'
            }}>
              Recent Campaigns
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {recentCampaigns.map((camp) => (
                <button
                  key={camp.name}
                  type="button"
                  onClick={() => onSelectTab('studio', camp.name)}
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
                  <span style={{ fontWeight: 500 }}>{camp.name}</span>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{camp.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CONNECTED Services (Shown when expanded) */}
        {!isCollapsed && (
          <div style={{ padding: '16px 14px 0' }}>
            <div style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px',
              paddingLeft: '4px',
              fontFamily: 'var(--font-mono)'
            }}>
              Connected
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {connectedServices.map((svc) => (
                <div
                  key={svc.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '5px 8px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    fontSize: '0.76rem',
                    color: '#94a3b8'
                  }}
                >
                  <span>{svc.name}</span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: svc.color,
                    background: `${svc.color}15`,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {svc.status}
                  </span>
                </div>
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
        {/* Ashky Pipeline Agent Button */}
        <button
          type="button"
          onClick={onOpenSidecar}
          title={isCollapsed ? "Ashky Pipeline Agent" : ""}
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
                Ashky Pipeline Agent
              </span>
              <span style={{ fontSize: '0.67rem', color: '#fcd34d' }}>
                Evidence from Grafana Cloud
              </span>
            </div>
          )}
        </button>

        {/* Back to Home / Overview */}
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
              Overview
            </span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
