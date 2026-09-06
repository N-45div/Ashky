import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';
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

  const getLifecycleStage = () => {
    if (activeTab === 'studio') {
      if (campaignStatus === 'Draft' || campaignStatus === 'Generating' || campaignStatus === 'Planning') {
        return { label: 'Create · 1 of 4', color: '#60a5fa' };
      }
      return { label: 'Review · 2 of 4', color: '#fbbf24' };
    }
    if (activeTab === 'geo') {
      return { label: 'Discover · 3 of 4', color: '#38bdf8' };
    }
    if (activeTab === 'observability') {
      return { label: 'Operate · 4 of 4', color: '#34d399' };
    }
    return { label: 'Review · 2 of 4', color: '#fbbf24' };
  };

  const currentLifecycle = getLifecycleStage();

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
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        position: 'relative'
      }}>
        {/* Single Unified 48px Header */}
        <header style={{
          height: '48px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 12, 16, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          userSelect: 'none'
        }}>
          {/* Left: Campaign Name / Current View */}
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
              <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#ffffff' }}>
                {selectedPreset?.product_name || 'Neon Circuit'}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#475569' }}>/</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#cbd5e1' }}>
                {getTabTitle()}
              </span>
            </div>
          </div>

          {/* Center: Exactly One Active Lifecycle Step */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#07080a',
            padding: '5px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.78rem'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: currentLifecycle.color
            }} />
            <span style={{ fontWeight: 600, color: '#f0f3f6' }}>
              {currentLifecycle.label}
            </span>
          </div>

          {/* Right: Single Health Badge + Single Global Agent Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.08)',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontFamily: 'var(--font-mono)'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981'
              }} />
              <span>Healthy</span>
            </div>

            <button
              type="button"
              onClick={() => setSidecarOpen(!sidecarOpen)}
              title="Open Ashky Pipeline Agent with Grafana evidence"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                background: sidecarOpen ? '#272012' : 'rgba(245, 158, 11, 0.08)',
                color: '#fbbf24',
                border: sidecarOpen ? '1px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.3)',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Terminal size={14} />
              <span>Ask Ashky</span>
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <main style={{
          flex: 1,
          height: 'calc(100vh - 48px)',
          maxHeight: 'calc(100vh - 48px)',
          padding: '0',
          position: 'relative',
          overflow: activeTab === 'studio' ? 'hidden' : 'auto'
        }}>
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
