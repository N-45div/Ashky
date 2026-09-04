import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
import CampaignContextBar from '../components/CampaignContextBar';
import AgentSidecar from '../components/AgentSidecar';
import VideoStudio from './VideoStudio';
import GeoOptimizer from './GeoOptimizer';
import Observability from './Observability';
import { Terminal, Sparkles, Activity, ShieldCheck, PanelLeft } from 'lucide-react';

const DEFAULT_DEMO_CAMPAIGN = {
  product_name: 'Neon Circuit',
  category: 'Indie Game',
  product_pitch: 'A neon-noir racing roguelite where every failed run rewrites the city and reveals a new piece of the conspiracy.',
  aspect_ratio: '9:16',
  style: 'Neon-Noir Cyberpunk Cinematic',
  campaign_goal: 'Drive wishlists before launch',
  target_audience: 'Roguelite and cyberpunk fans'
};

const PRESET_MAP = {
  'Neon Circuit': DEFAULT_DEMO_CAMPAIGN,
  'LaunchFlow': {
    product_name: 'LaunchFlow',
    category: 'B2B SaaS',
    product_pitch: 'Autonomous customer onboarding & interactive walkthrough agent that triples free-to-paid conversion for SaaS founders.',
    aspect_ratio: '9:16',
    style: 'Kinetic High-Tech Dark',
    campaign_goal: 'Convert free trial users to paid',
    target_audience: 'SaaS founders and product managers'
  },
  'VectorLite': {
    product_name: 'VectorLite',
    category: 'DevTool',
    product_pitch: 'Zero-latency embedded vector database designed specifically for edge AI agents and local RAG pipelines.',
    aspect_ratio: '9:16',
    style: 'Cyberpunk Matrix Minimal',
    campaign_goal: 'Drive GitHub stars and developer adoption',
    target_audience: 'AI engineers and backend architects'
  }
};

export default function AppWorkspace({ initialPreset = null }) {
  const { tab = 'studio' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(tab || 'studio');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidecarOpen, setSidecarOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(initialPreset || DEFAULT_DEMO_CAMPAIGN);
  const [campaignKey, setCampaignKey] = useState(Date.now());
  const [campaignStatus, setCampaignStatus] = useState('Reviewing');

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
    if (presetName && PRESET_MAP[presetName]) {
      setSelectedPreset(PRESET_MAP[presetName]);
      setCampaignKey(Date.now());
    }
  };

  const handleNewCampaign = () => {
    setSelectedPreset({
      product_name: '',
      product_pitch: '',
      category: 'Indie Game',
      aspect_ratio: '9:16',
      style: 'Neon-Noir Cyberpunk Cinematic',
      campaign_goal: 'Drive wishlists before launch',
      target_audience: 'Roguelite and cyberpunk fans'
    });
    setCampaignStatus('Draft');
    setCampaignKey(Date.now());
    setActiveTab('studio');
    navigate('/app/studio');
  };

  const getTabTitle = () => {
    if (activeTab === 'studio') return 'Video Studio';
    if (activeTab === 'geo') return 'AI Search';
    if (activeTab === 'observability') return 'Pipeline Ops';
    return 'Video Studio';
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
          background: 'rgba(10, 12, 16, 0.85)',
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
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>ashky</span>
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
              <span>PIPELINE HEALTHY</span>
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
              <span className="hidden sm:inline">Ashky Pipeline Agent</span>
            </button>
          </div>
        </header>

        {/* Persistent Campaign Context Bar */}
        <CampaignContextBar
          campaignName={selectedPreset?.product_name || 'Neon Circuit'}
          category={selectedPreset?.category || 'Indie Game'}
          status={campaignStatus}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onOpenSidecar={() => setSidecarOpen(true)}
          lastUpdated="Just now"
        />

        {/* Tab Content */}
        <main style={{ flex: 1, padding: '0', position: 'relative' }}>
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
              campaign={selectedPreset}
            />
          )}
        </main>
      </div>

      {/* Collapsible Ashky Pipeline Agent Drawer */}
      <AgentSidecar
        isOpen={sidecarOpen}
        onClose={() => setSidecarOpen(false)}
        activeTab={activeTab}
        campaignName={selectedPreset?.product_name || 'Neon Circuit'}
      />
    </div>
  );
}
