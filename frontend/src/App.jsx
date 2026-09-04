import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingNavbar from './components/LandingNavbar';
import LandingPage from './pages/LandingPage';
import AppWorkspace from './pages/AppWorkspace';

function LandingRoute({ onSelectPreset }) {
  const navigate = useNavigate();

  const handleNavigate = (tab) => {
    if (tab === 'video_studio' || tab === 'studio') {
      navigate('/app/studio');
    } else if (tab === 'geo_optimizer' || tab === 'geo') {
      navigate('/app/geo');
    } else if (tab === 'observability') {
      navigate('/app/observability');
    } else {
      navigate('/app');
    }
  };

  const handleSelectPreset = (preset) => {
    if (onSelectPreset) {
      onSelectPreset(preset);
    }
    navigate('/app/studio');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#090a0c' }}>
      {/* Clean Dark Landing Header with single Launch App CTA */}
      <LandingNavbar />

      <main style={{ flex: 1, position: 'relative' }}>
        <LandingPage 
          onNavigate={handleNavigate}
          onSelectPreset={handleSelectPreset}
        />
      </main>

      {/* Footer */}
      <footer style={{
        padding: '24px 28px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#64748b',
        background: '#0a0c10'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600 }}>
            Ashky Studio — Google Agentic Cinema Blockbuster Hackathon (Grafana Labs Track)
          </p>
          <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Gemini 3.8 Flash · Veo on Google Cloud · Grafana Cloud MCP
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [selectedPreset, setSelectedPreset] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route (Clean Dark Theme, Single Launch App button) */}
        <Route 
          path="/" 
          element={<LandingRoute onSelectPreset={setSelectedPreset} />} 
        />

        {/* Full App Workspace with ChatGPT-style Collapsible Icon Sidebar */}
        <Route 
          path="/app" 
          element={<AppWorkspace initialPreset={selectedPreset} />} 
        />
        <Route 
          path="/app/:tab" 
          element={<AppWorkspace initialPreset={selectedPreset} />} 
        />

        {/* Backwards Compatibility / Direct Links */}
        <Route path="/studio" element={<Navigate to="/app/studio" replace />} />
        <Route path="/geo" element={<Navigate to="/app/geo" replace />} />
        <Route path="/observability" element={<Navigate to="/app/observability" replace />} />
        <Route path="/video_studio" element={<Navigate to="/app/studio" replace />} />
        <Route path="/geo_optimizer" element={<Navigate to="/app/geo" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
