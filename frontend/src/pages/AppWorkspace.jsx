import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgentSidecar from '../components/AgentSidecar';
import VideoStudio from './VideoStudio';
import GeoOptimizer from './GeoOptimizer';
import Observability from './Observability';
import ErrorBoundary from '../components/ErrorBoundary';
import { 
  MessageSquare, Bell, LayoutGrid, Folder, Activity, 
  Settings, FolderArchive, FileText, Video, Sliders, 
  Terminal, Crosshair, LogOut, Layout, CheckCircle2, X, RefreshCw, Download, Play
} from 'lucide-react';

const DEFAULT_DEMO_CAMPAIGN = {
  campaign_id: 'camp_neon_circuit_01',
  product_name: 'Neo-Racing Tokyo',
  studio: 'Ashky',
  category: 'Indie Game',
  product_pitch: 'A neon-noir racing roguelite where every failed run rewrites the city and reveals a new piece of the conspiracy.',
  aspect_ratio: '9:16',
  style: 'Cinematic Neon-Noir',
  campaign_goal: 'Drive wishlists before launch',
  target_audience: 'Gen Z/Alpha'
};

const PRESETS = [
  {
    name: 'Neo-Racing Tokyo',
    studio: 'Ashky',
    category: 'Indie Game',
    pitch: 'A neon-noir racing roguelite where every failed run rewrites the city and reveals a new piece of the conspiracy.',
    aspect_ratio: '9:16',
    style: 'Cinematic Neon-Noir',
    audience: 'Gen Z/Alpha'
  },
  {
    name: 'LaunchFlow',
    studio: 'Ashky',
    category: 'B2B SaaS',
    pitch: 'Autonomous customer onboarding & interactive walkthrough agent that triples free-to-paid conversion for SaaS founders.',
    aspect_ratio: '9:16',
    style: 'Kinetic High-Tech Dark',
    audience: 'SaaS Founders'
  },
  {
    name: 'VectorLite',
    studio: 'Ashky',
    category: 'DevTool',
    pitch: 'Zero-latency embedded vector database designed specifically for edge AI agents and local RAG pipelines.',
    aspect_ratio: '9:16',
    style: 'Cyberpunk Matrix Minimal',
    audience: 'AI Engineers'
  }
];

export default function AppWorkspace({ initialPreset = null }) {
  const { tab = 'studio' } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(tab || 'studio');
  const [sidecarOpen, setSidecarOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(initialPreset || DEFAULT_DEMO_CAMPAIGN);
  const [campaignKey, setCampaignKey] = useState(Date.now());
  const [campaignStatus, setCampaignStatus] = useState('Reviewing');

  // Modal dialog states
  const [campaignsModalOpen, setCampaignsModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [assetsModalOpen, setAssetsModalOpen] = useState(false);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);
  const [rendersModalOpen, setRendersModalOpen] = useState(false);
  const [compositionModalOpen, setCompositionModalOpen] = useState(false);
  const [metricsModalOpen, setMetricsModalOpen] = useState(false);

  // Sync route param with state
  useEffect(() => {
    if (tab && ['studio', 'geo', 'observability'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    navigate(`/app/${tabId}`);
  };

  const handleSwitchCampaign = (preset) => {
    setSelectedPreset({
      campaign_id: preset.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      product_name: preset.name,
      studio: preset.studio || 'Ashky',
      category: preset.category,
      product_pitch: preset.pitch,
      aspect_ratio: preset.aspect_ratio,
      style: preset.style,
      campaign_goal: 'Drive conversions and engagement',
      target_audience: preset.audience
    });
    setCampaignKey(Date.now());
    setCampaignsModalOpen(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      background: '#07090e',
      color: '#f0f3f6',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)'
    }}>
      
      {/* ------------------------------------------------------------ */}
      {/* TOP HEADER: EXACT MATCH TO IMAGE 1 REFERENCE */}
      {/* ------------------------------------------------------------ */}
      <header style={{
        height: '42px',
        minHeight: '42px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#07090e',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 50,
        userSelect: 'none',
        boxSizing: 'border-box'
      }}>
        {/* Left: Amber Triangle Brand Mark + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            onClick={() => navigate('/')} 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
            title="Ashky Home"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path 
                d="M12 2L2 22H22L12 2Z" 
                fill="#f59e0b" 
                stroke="#d97706" 
                strokeWidth="1.5" 
                strokeLinejoin="round" 
              />
              <path 
                d="M12 8L6.5 19H17.5L12 8Z" 
                fill="#07090e" 
              />
            </svg>
          </div>
          <span style={{
            fontSize: '0.86rem',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '0.01em',
            fontFamily: 'var(--font-sans)'
          }}>
            Ashky Video Studio
          </span>
        </div>

        {/* Right: Message Bubble, Bell with Red Badge, Circular Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Chat / Agent Sidecar Trigger */}
          <button
            type="button"
            onClick={() => setSidecarOpen(!sidecarOpen)}
            title="Ask Ashky AI Assistant"
            style={{
              background: 'transparent',
              border: 'none',
              color: sidecarOpen ? '#f59e0b' : '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
          >
            <MessageSquare size={16} />
          </button>

          {/* Notifications Trigger with Unread Indicator */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              title="Studio Notifications"
              style={{
                background: 'transparent',
                border: 'none',
                color: notificationsOpen ? '#f59e0b' : '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={16} />
              <span style={{
                position: 'absolute',
                top: '3px',
                right: '4px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 4px #ef4444'
              }} />
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <div style={{
                position: 'absolute',
                top: '32px',
                right: 0,
                width: '280px',
                background: '#0d1017',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
                zIndex: 100
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ffffff' }}>Pipeline Activity</span>
                  <X size={12} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setNotificationsOpen(false)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.68rem' }}>
                  <div style={{ background: '#07090f', padding: '6px 8px', borderRadius: '4px', borderLeft: '3px solid #10b981' }}>
                    <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600 }}>Video Composition Ready</p>
                    <span style={{ color: '#64748b', fontSize: '0.6rem' }}>camp_neon_circuit_01.mp4 synthesized</span>
                  </div>
                  <div style={{ background: '#07090f', padding: '6px 8px', borderRadius: '4px', borderLeft: '3px solid #f59e0b' }}>
                    <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600 }}>Gemini Vision Critic Verified</p>
                    <span style={{ color: '#64748b', fontSize: '0.6rem' }}>Scene 1 hook score: 94 / 100</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              title="Creator Profile"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <img
                src="/assets/header_avatar.jpg"
                alt="Creator Avatar"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div style="width:24px;height:24px;border-radius:50%;background:#f59e0b;color:#000;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">D</div>';
                }}
              />
            </button>

            {/* Profile Popover */}
            {profileOpen && (
              <div style={{
                position: 'absolute',
                top: '32px',
                right: 0,
                width: '220px',
                background: '#0d1017',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
                zIndex: 100
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f59e0b', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                    D
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.78rem', color: '#ffffff' }}>Divij N</h5>
                    <span style={{ fontSize: '0.62rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>Studio Pro License</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', fontSize: '0.72rem' }}>
                  <button 
                    onClick={() => { setSettingsModalOpen(true); setProfileOpen(false); }}
                    style={{ background: 'transparent', border: 'none', color: '#cbd5e1', textAlign: 'left', padding: '4px 6px', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    Preferences
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    style={{ background: 'transparent', border: 'none', color: '#f87171', textAlign: 'left', padding: '4px 6px', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ------------------------------------------------------------ */}
      {/* MAIN BODY: SLIM NAVIGATION RAIL + WORKSPACE CANVAS */}
      {/* ------------------------------------------------------------ */}
      <div style={{
        display: 'flex',
        flex: 1,
        height: 'calc(100vh - 42px)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* ------------------------------------------------------------ */}
        {/* SLIM NAVIGATION RAIL: EXACT MATCH TO IMAGE 1 REFERENCE */}
        {/* ------------------------------------------------------------ */}
        <aside style={{
          width: '46px',
          minWidth: '46px',
          background: '#07090e',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 0 12px',
          boxSizing: 'border-box',
          zIndex: 40,
          userSelect: 'none',
          flexShrink: 0
        }}>
          {/* Top Group: Studio, Campaigns, Observability, GEO, Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
            
            {/* 1. LayoutGrid (Video Studio) with Amber Indicator */}
            <button
              type="button"
              onClick={() => handleSelectTab('studio')}
              title="Video Studio Canvas"
              style={{
                width: '100%',
                height: '38px',
                background: activeTab === 'studio' ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                border: 'none',
                color: activeTab === 'studio' ? '#f59e0b' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'all 0.15s ease'
              }}
            >
              {activeTab === 'studio' && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '6px',
                  bottom: '6px',
                  width: '3.5px',
                  background: '#f59e0b',
                  borderRadius: '0 2px 2px 0',
                  boxShadow: '0 0 8px #f59e0b'
                }} />
              )}
              <LayoutGrid size={18} />
            </button>

            {/* 2. Folder (Projects / Campaigns) */}
            <button
              type="button"
              onClick={() => setCampaignsModalOpen(true)}
              title="Campaign Projects Drawer"
              style={{
                width: '100%',
                height: '38px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Folder size={18} />
            </button>

            {/* 3. Activity (Pipeline Ops / Observability) */}
            <button
              type="button"
              onClick={() => handleSelectTab('observability')}
              title="Pipeline Observability & Metrics"
              style={{
                width: '100%',
                height: '38px',
                background: activeTab === 'observability' ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                border: 'none',
                color: activeTab === 'observability' ? '#f59e0b' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {activeTab === 'observability' && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '6px',
                  bottom: '6px',
                  width: '3.5px',
                  background: '#f59e0b',
                  borderRadius: '0 2px 2px 0'
                }} />
              )}
              <Activity size={18} />
            </button>

            {/* 4. Layout (GEO / AI Search Optimization) */}
            <button
              type="button"
              onClick={() => handleSelectTab('geo')}
              title="AI Search & GEO Engine"
              style={{
                width: '100%',
                height: '38px',
                background: activeTab === 'geo' ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                border: 'none',
                color: activeTab === 'geo' ? '#f59e0b' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {activeTab === 'geo' && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '6px',
                  bottom: '6px',
                  width: '3.5px',
                  background: '#f59e0b',
                  borderRadius: '0 2px 2px 0'
                }} />
              )}
              <Layout size={18} />
            </button>

            {/* 5. Settings (Studio Config) */}
            <button
              type="button"
              onClick={() => setSettingsModalOpen(true)}
              title="Studio Configuration"
              style={{
                width: '100%',
                height: '38px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Settings size={18} />
            </button>

          </div>

          {/* Bottom Group: Assets, Blueprint, Video, Mix, Console, Metrics, Exit */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', width: '100%' }}>
            
            {/* 6. FolderArchive (Assets Library) */}
            <button
              type="button"
              onClick={() => setAssetsModalOpen(true)}
              title="Media Assets Library"
              style={{
                width: '100%',
                height: '30px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FolderArchive size={15} />
            </button>

            {/* 7. FileText (Blueprint Script) */}
            <button
              type="button"
              onClick={() => setBlueprintModalOpen(true)}
              title="View Campaign Script & Blueprint"
              style={{
                width: '100%',
                height: '30px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={15} />
            </button>

            {/* 8. Video (Rendered Video Files) */}
            <button
              type="button"
              onClick={() => setRendersModalOpen(true)}
              title="Rendered Video Gallery"
              style={{
                width: '100%',
                height: '30px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Video size={15} />
            </button>

            {/* 9. Sliders (Composition Controls) */}
            <button
              type="button"
              onClick={() => setCompositionModalOpen(true)}
              title="Composition Settings"
              style={{
                width: '100%',
                height: '30px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sliders size={15} />
            </button>

            {/* 10. Terminal (Agent Console Sidecar) */}
            <button
              type="button"
              onClick={() => setSidecarOpen(!sidecarOpen)}
              title="Open Ashky Agent Console"
              style={{
                width: '100%',
                height: '30px',
                background: sidecarOpen ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                border: 'none',
                color: sidecarOpen ? '#f59e0b' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Terminal size={15} />
            </button>

            {/* 11. Crosshair (Prometheus Telemetry Probe) */}
            <button
              type="button"
              onClick={() => setMetricsModalOpen(true)}
              title="Live Telemetry Prober"
              style={{
                width: '100%',
                height: '30px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Crosshair size={15} />
            </button>

            {/* 12. LogOut (Exit to Landing) */}
            <button
              type="button"
              onClick={() => navigate('/')}
              title="Exit to Landing Page"
              style={{
                width: '100%',
                height: '30px',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut size={15} />
            </button>

          </div>
        </aside>

        {/* ------------------------------------------------------------ */}
        {/* WORKSPACE CANVAS CONTENT AREA */}
        {/* ------------------------------------------------------------ */}
        <main style={{
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <ErrorBoundary>
            {activeTab === 'studio' && (
              <VideoStudio
                key={campaignKey}
                initialPreset={selectedPreset}
                onStatusChange={setCampaignStatus}
                onNavigateToGeo={() => handleSelectTab('geo')}
              />
            )}
            {activeTab === 'geo' && (
              <GeoOptimizer
                campaign={selectedPreset}
                onNavigateToStudio={() => handleSelectTab('studio')}
              />
            )}
            {activeTab === 'observability' && (
              <Observability
                onOpenSidecar={() => setSidecarOpen(true)}
                onNavigateToStudio={() => handleSelectTab('studio')}
                campaign={selectedPreset}
              />
            )}
          </ErrorBoundary>
        </main>

      </div>

      {/* ------------------------------------------------------------ */}
      {/* GLOBAL WORKING MODALS FOR SIDEBAR UTILITIES */}
      {/* ------------------------------------------------------------ */}

      {/* 1. Campaigns Switcher Modal */}
      {campaignsModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0d1017',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            width: '440px',
            padding: '20px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '0.96rem', color: '#ffffff' }}>Campaign Projects</h3>
              <X size={16} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setCampaignsModalOpen(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {PRESETS.map((p) => (
                <div
                  key={p.name}
                  onClick={() => handleSwitchCampaign(p)}
                  style={{
                    background: selectedPreset.product_name === p.name ? 'rgba(245, 158, 11, 0.12)' : '#07090f',
                    border: selectedPreset.product_name === p.name ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.84rem', color: '#ffffff' }}>{p.name}</h4>
                    <span style={{ fontSize: '0.64rem', color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{p.category}</span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.3 }}>{p.pitch}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Studio Settings Modal */}
      {settingsModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0d1017',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            width: '420px',
            padding: '20px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '0.96rem', color: '#ffffff' }}>Studio Configuration</h3>
              <X size={16} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setSettingsModalOpen(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.76rem' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>Video Composition Engine</label>
                <div style={{ background: '#07090f', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                  FFmpeg 8.1.2 (Hardware Accelerated H.264)
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>Vision Critic Engine</label>
                <div style={{ background: '#07090f', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                  Gemini 2.5 Flash Multimodal
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>Observability Layer</label>
                <div style={{ background: '#07090f', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                  Grafana Cloud MCP Agent (:8000/metrics)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Assets Modal */}
      {assetsModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0d1017',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            width: '480px',
            padding: '20px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '0.96rem', color: '#ffffff' }}>Media Assets Library</h3>
              <X size={16} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setAssetsModalOpen(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#07090f', padding: '8px 12px', borderRadius: '6px' }}>
                <span style={{ color: '#e2e8f0' }}>camp_neon_circuit_01.mp4</span>
                <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>1.79 MB (H.264)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#07090f', padding: '8px 12px', borderRadius: '6px' }}>
                <span style={{ color: '#e2e8f0' }}>scene_1.mp3 (Neural Voiceover)</span>
                <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>32 KB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#07090f', padding: '8px 12px', borderRadius: '6px' }}>
                <span style={{ color: '#e2e8f0' }}>scene_1.jpg (Tokyo Cockpit HUD)</span>
                <span style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>862 KB</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Blueprint Modal */}
      {blueprintModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0d1017',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            width: '560px',
            maxHeight: '80vh',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 48px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '0.96rem', color: '#ffffff' }}>Campaign Blueprint JSON</h3>
              <X size={16} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setBlueprintModalOpen(false)} />
            </div>
            <pre style={{
              flex: 1,
              background: '#07090f',
              padding: '12px',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.7rem',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              margin: 0
            }}>
              {JSON.stringify(selectedPreset, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* 5. Rendered Videos Gallery Modal */}
      {rendersModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0d1017',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            width: '500px',
            padding: '20px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '0.96rem', color: '#ffffff' }}>Rendered Video Gallery</h3>
              <X size={16} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setRendersModalOpen(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#07090f', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.82rem', color: '#ffffff' }}>camp_neon_circuit_01.mp4</h4>
                  <span style={{ fontSize: '0.64rem', color: '#64748b' }}>1080x1920 • 9:16 Vertical • 18.9s</span>
                </div>
                <a
                  href="/media/videos/camp_neon_circuit_01.mp4"
                  download
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#f59e0b',
                    color: '#000000',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  <Download size={12} />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Composition Settings Modal */}
      {compositionModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0d1017',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            width: '420px',
            padding: '20px',
            boxShadow: '0 20px 48px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '0.96rem', color: '#ffffff' }}>Composition Settings</h3>
              <X size={16} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setCompositionModalOpen(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.76rem' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>Target Aspect Ratio</label>
                <div style={{ background: '#07090f', padding: '6px 10px', borderRadius: '4px', color: '#ffffff' }}>9:16 Vertical Cinema (1080 x 1920)</div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>Framerate</label>
                <div style={{ background: '#07090f', padding: '6px 10px', borderRadius: '4px', color: '#ffffff' }}>25.0 fps</div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px' }}>Kinetic Subtitle Burn-in</label>
                <div style={{ background: '#07090f', padding: '6px 10px', borderRadius: '4px', color: '#34d399' }}>Enabled (Segoe UI SemiBold)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Prometheus Telemetry Probe Modal */}
      {metricsModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0d1017',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            width: '540px',
            maxHeight: '80vh',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 48px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <h3 style={{ margin: 0, fontSize: '0.96rem', color: '#ffffff' }}>Live Prometheus Metrics Probe</h3>
              </div>
              <X size={16} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setMetricsModalOpen(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem' }}>
              <div style={{ background: '#07090f', padding: '8px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>ashky_campaigns_created_total</span>
                <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>14</span>
              </div>
              <div style={{ background: '#07090f', padding: '8px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>ashky_video_render_duration_seconds</span>
                <span style={{ color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>4.21s avg</span>
              </div>
              <div style={{ background: '#07090f', padding: '8px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>ashky_critic_hook_score</span>
                <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>94.0</span>
              </div>
              <div style={{ background: '#07090f', padding: '8px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>ashky_pipeline_health_status</span>
                <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>1 (Operational)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Ashky Pipeline Agent Drawer */}
      <AgentSidecar
        isOpen={sidecarOpen}
        onClose={() => setSidecarOpen(false)}
        activeTab={activeTab}
        campaignName={selectedPreset?.product_name || 'Neo-Racing Tokyo'}
      />
    </div>
  );
}
