import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AgentSidecar from './components/AgentSidecar';
import LandingPage from './pages/LandingPage';
import VideoStudio from './pages/VideoStudio';
import GeoOptimizer from './pages/GeoOptimizer';
import Observability from './pages/Observability';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [sidecarOpen, setSidecarOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--bg-canvas)' }}>
      {/* Top Glass Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        sidecarOpen={sidecarOpen}
        setSidecarOpen={setSidecarOpen}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        {activeTab === 'landing' && (
          <LandingPage 
            onNavigate={handleNavigate}
            onSelectPreset={handleSelectPreset}
          />
        )}
        {activeTab === 'video_studio' && (
          <VideoStudio initialPreset={selectedPreset} />
        )}
        {activeTab === 'geo_optimizer' && <GeoOptimizer />}
        {activeTab === 'observability' && (
          <Observability onOpenSidecar={() => setSidecarOpen(true)} />
        )}
      </main>

      {/* Collapsible Grafana MCP Agent Drawer */}
      <AgentSidecar
        isOpen={sidecarOpen}
        onClose={() => setSidecarOpen(false)}
      />

      {/* Footer */}
      <footer style={{
        padding: '24px 28px',
        borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        position: 'relative',
        zIndex: 10,
        background: 'var(--bg-surface-1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600 }}>
            Ashky Studio — Google Agentic Cinema Blockbuster Hackathon (Grafana Labs Track)
          </p>
          <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Google Gemini 3.5 Flash Agentic Video Engine • Grafana Cloud Model Context Protocol (MCP)
          </p>
        </div>
      </footer>
    </div>
  );
}
