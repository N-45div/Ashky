import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
import AgentSidecar from '../components/AgentSidecar';
import VideoStudio from './VideoStudio';
import GeoOptimizer from './GeoOptimizer';
import Observability from './Observability';
import { Terminal, Sparkles, Activity, ShieldCheck, PanelLeft } from 'lucide-react';

export default function AppWorkspace({ initialPreset = null }) {
  const { tab = 'studio' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(tab || 'studio');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidecarOpen, setSidecarOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(initialPreset);
  const [campaignKey, setCampaignKey] = useState(Date.now());

  // Sync route param with state
  useEffect(() => {
    if (tab && ['studio', 'geo', 'observability'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [tab]);

  // Handle tab selection
  const handleSelectTab = (tabId, presetName = null) => {
    setActiveTab(tabId);
    navigate(`/app/${tabId}`);
    if (presetName) {
      // Map preset name
      const presetMap = {
        'LaunchFlow': {
          product_name: 'LaunchFlow',
          category: 'B2B SaaS',
          product_pitch: 'Autonomous customer onboarding & interactive walkthrough agent that triples free-to-paid conversion for SaaS founders.',
          aspect_ratio: '9:16',
          style: 'Kinetic High-Tech Dark'
        },
        'VectorLite': {
          product_name: 'VectorLite',
          category: 'DevTool / Database',
          product_pitch: 'Zero-latency embedded vector database designed specifically for edge AI agents and local RAG pipelines.',
          aspect_ratio: '9:16',
          style: 'Cyberpunk Neon Matrix'
        },
        'AdMorph': {
          product_name: 'AdMorph',
          category: 'AI Growth Copilot',
          product_pitch: 'Autonomous generative ad variation engine that dynamically tests 50 hook variations per day on TikTok & Reels.',
          aspect_ratio: '9:16',
          style: 'Bold Minimalist Monochrome'
        },
        'CinemaFlow': {
          product_name: 'CinemaFlow',
          category: 'Generative Media',
          product_pitch: 'End-to-end autonomous video production studio that directs, edits, and scores vertical video ads for indie games.',
          aspect_ratio: '9:16',
          style: 'Cinematic Anamorphic Teal'
        }
      };
      setSelectedPreset(presetMap[presetName] || null);
      setCampaignKey(Date.now());
    }
  };

  const handleNewCampaign = () => {
    setSelectedPreset({
      product_name: '',
      product_pitch: '',
      category: 'B2B SaaS',
      aspect_ratio: '9:16',
      style: 'Kinetic High-Tech Dark'
    });
    setCampaignKey(Date.now());
    setActiveTab('studio');
    navigate('/app/studio');
  };

  const getTabTitle = () => {
    if (activeTab === 'studio') return 'Video Studio';
    if (activeTab === 'geo') return 'GEO Search Engine';
    if (activeTab === 'observability') return 'Grafana SRE & Logs';
    return 'Studio';
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: '#090a0c',
      color: '#f0f3f6',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ChatGPT-Style Collapsible Icon Sidebar */}
      <AppSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenSidecar={() => setSidecarOpen(true)}
        onNewCampaign={handleNewCampaign}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Workspace Area */}
      <div style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        position: 'relative'
      }}>
        {/* Minimal Dark Top Bar */}
        <header style={{
          height: '56px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 12, 16, 0.7)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isCollapsed && (
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                title="Expand sidebar"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                <PanelLeft size={18} />
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Ashky</span>
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>/</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                {getTabTitle()}
              </span>
            </div>
          </div>

          {/* Right Header Status & Drawer Opener */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.06)',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontFamily: 'var(--font-mono)'
            }}>
              <span className="status-dot status-dot-emerald" />
              <span>SRE OPTIMAL</span>
            </div>

            <button
              type="button"
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
              <span className="hidden sm:inline">Grafana MCP Copilot</span>
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <main style={{ flex: 1, padding: '0', position: 'relative' }}>
          {activeTab === 'studio' && (
            <VideoStudio 
              key={campaignKey} 
              initialPreset={selectedPreset} 
            />
          )}
          {activeTab === 'geo' && <GeoOptimizer />}
          {activeTab === 'observability' && (
            <Observability onOpenSidecar={() => setSidecarOpen(true)} />
          )}
        </main>
      </div>

      {/* Collapsible Grafana MCP Agent Drawer */}
      <AgentSidecar
        isOpen={sidecarOpen}
        onClose={() => setSidecarOpen(false)}
      />
    </div>
  );
}
