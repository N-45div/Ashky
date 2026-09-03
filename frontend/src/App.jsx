import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AgentSidecar from './components/AgentSidecar';
import VideoStudio from './pages/VideoStudio';
import GeoOptimizer from './pages/GeoOptimizer';
import Observability from './pages/Observability';

export default function App() {
  const [activeTab, setActiveTab] = useState('video_studio');
  const [sidecarOpen, setSidecarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Cinematic Ambient Glows */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-bottom" />

      {/* Top Glass Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidecarOpen={sidecarOpen}
        setSidecarOpen={setSidecarOpen}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        {activeTab === 'video_studio' && <VideoStudio />}
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
        padding: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        position: 'relative',
        zIndex: 10,
        background: 'rgba(6, 7, 10, 0.8)'
      }}>
        <p>
          🎬 <strong>Ashky</strong> — Built for the <em>Google Agentic Cinema Hackathon</em> (Grafana Labs Track) • Powered by Gemini 2.0 & Grafana Model Context Protocol (MCP)
        </p>
      </footer>
    </div>
  );
}
