import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, Pause, Sparkles, RefreshCw, Smartphone, Monitor, Zap, 
  CheckCircle2, Clock, Eye, AlertTriangle, ChevronRight, Layers, ArrowUpRight, Film, Cpu, Terminal,
  Download, Volume2, Video
} from 'lucide-react';

export default function VideoStudio({ initialPreset }) {
  const [presets, setPresets] = useState([]);
  const [productName, setProductName] = useState(initialPreset?.product_name || 'LaunchFlow');
  const [productPitch, setProductPitch] = useState(initialPreset?.product_pitch || 'Autonomous customer onboarding & interactive walkthrough agent that triples free-to-paid conversion for SaaS founders.');
  const [category, setCategory] = useState(initialPreset?.category || 'B2B SaaS');
  const [aspectRatio, setAspectRatio] = useState(initialPreset?.aspect_ratio || '9:16');
  const [style, setStyle] = useState(initialPreset?.style || 'Kinetic High-Tech Dark');

  useEffect(() => {
    if (initialPreset) {
      if (initialPreset.product_name) setProductName(initialPreset.product_name);
      if (initialPreset.product_pitch) setProductPitch(initialPreset.product_pitch);
      if (initialPreset.category) setCategory(initialPreset.category);
      if (initialPreset.aspect_ratio) setAspectRatio(initialPreset.aspect_ratio);
      if (initialPreset.style) setStyle(initialPreset.style);
    }
  }, [initialPreset]);

  const [generating, setGenerating] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [campaign, setCampaign] = useState(null);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [agenticAnalysis, setAgenticAnalysis] = useState(null);
  const [inspectingAgentic, setInspectingAgentic] = useState(false);

  const [selectedVoice, setSelectedVoice] = useState('en-US-GuyNeural');
  const [renderingVideo, setRenderingVideo] = useState(false);
  const [renderStatus, setRenderStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('blueprint'); // 'blueprint' | 'video_player'

  // Check if campaign already has rendered video
  useEffect(() => {
    if (campaign?.campaign_id) {
      fetch(`/api/campaigns/${campaign.campaign_id}/render-status`)
        .then(r => r.ok ? r.json() : null)
        .then(st => {
          if (st && st.status === 'completed') {
            setRenderStatus(st);
          }
        })
        .catch(() => {});
    }
  }, [campaign?.campaign_id]);

  const handleStartRender = async () => {
    if (!campaign?.campaign_id) return;
    setRenderingVideo(true);
    setRenderStatus({
      campaign_id: campaign.campaign_id,
      status: 'queued',
      progress_pct: 10,
      current_step: 'Queued for rendering...',
    });

    try {
      const res = await fetch(`/api/campaigns/${campaign.campaign_id}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice: selectedVoice,
          aspect_ratio: aspectRatio,
          include_subtitles: true,
        }),
      });

      if (!res.ok) throw new Error('Render request failed');
      const data = await res.json();
      setRenderStatus(data);

      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/campaigns/${campaign.campaign_id}/render-status`);
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            setRenderStatus(statusData);

            if (statusData.status === 'completed') {
              clearInterval(pollInterval);
              setRenderingVideo(false);
              setActiveTab('video_player');
              try {
                confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
              } catch (e) {}
            } else if (statusData.status === 'failed') {
              clearInterval(pollInterval);
              setRenderingVideo(false);
            }
          }
        } catch (pollErr) {
          console.error('Polling render error', pollErr);
        }
      }, 1200);

    } catch (err) {
      console.error('Render trigger error', err);
      setRenderingVideo(false);
      setRenderStatus({
        campaign_id: campaign.campaign_id,
        status: 'failed',
        progress_pct: 0,
        current_step: 'Failed to trigger render',
        error: err.message,
      });
    }
  };

  const handleRunAgenticInspect = async (campaignId) => {
    const targetId = campaignId || campaign?.campaign_id;
    if (!targetId) return;
    setInspectingAgentic(true);
    try {
      const res = await fetch(`/api/campaigns/${targetId}/agentic-inspect`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAgenticAnalysis(data);
      }
    } catch (err) {
      console.error('Agentic inspect failed', err);
    } finally {
      setInspectingAgentic(false);
    }
  };

  // Load presets on mount
  useEffect(() => {
    fetch('/api/campaigns/presets')
      .then(res => res.json())
      .then(data => {
        setPresets(data);
      })
      .catch(() => {});
  }, []);

  const handleApplyPreset = (preset) => {
    setProductName(preset.title.split(' ')[0]);
    setProductPitch(preset.pitch);
    setCategory(preset.category);
    setAspectRatio(preset.aspect_ratio);
    setStyle(preset.style);
  };

  const handleCreateAndStream = async () => {
    setGenerating(true);
    setPipelineProgress(10);
    setCampaign(null);
    setSelectedSceneIndex(0);

    try {
      // Step 1: Create blueprint
      const res = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productName,
          product_pitch: productPitch,
          category,
          aspect_ratio: aspectRatio,
          style
        })
      });

      if (!res.ok) throw new Error('Blueprint creation failed');
      const initialBlueprint = await res.json();
      setCampaign(initialBlueprint);
      setPipelineProgress(30);

      // Step 2: Connect SSE progressive streaming
      const eventSource = new EventSource(`/api/campaigns/stream/${initialBlueprint.campaign_id}`);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.progress) {
            setPipelineProgress(data.progress);
          }

          if (data.event === 'scene_ready') {
            setCampaign((prev) => {
              if (!prev) return prev;
              const updatedScenes = [...prev.scenes];
              const idx = data.scene_number - 1;
              updatedScenes[idx] = data.scene;
              return { ...prev, scenes: updatedScenes };
            });
          }

          if (data.event === 'campaign_completed') {
            setCampaign(data.campaign);
            setGenerating(false);
            setPipelineProgress(100);
            eventSource.close();
            handleRunAgenticInspect(data.campaign.campaign_id);
            try {
              confetti({ particleCount: 50, spread: 50, origin: { y: 0.65 } });
            } catch (e) {}
          }

        } catch (e) {
          console.error("SSE parse error", e);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setGenerating(false);
      };

    } catch (err) {
      console.error(err);
      setGenerating(false);
    }
  };

  const currentScene = campaign?.scenes?.[selectedSceneIndex];
  const currentVisionScore = campaign?.vision_qa?.[selectedSceneIndex];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="tag-minimal tag-emerald">
              <Zap size={12} /> FIRSTFRAME PROGRESSIVE ENGINE
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Scene 1 Stream (&lt;2s) • Gemini 3.5 Flash QA • Grafana Telemetry
            </span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
            Director Studio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '4px', maxWidth: '640px' }}>
            Generate 3-scene vertical video ads with progressive streaming and Gemini 3.5 Flash keyframe drop-off analysis.
          </p>
        </div>

        {/* Quick Founder Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', fontFamily: 'var(--font-mono)' }}>
            QUICK PRESETS
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="btn-matte-dark"
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 390px) 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Input Form */}
        <div className="matte-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#0d0f14' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Film size={18} color="#cbd5e1" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Campaign Configuration</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PRODUCT NAME</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="matte-input"
              placeholder="e.g. LaunchFlow"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PRODUCT PITCH & AUDIENCE</label>
            <textarea
              value={productPitch}
              onChange={(e) => setProductPitch(e.target.value)}
              className="matte-textarea"
              rows={3}
              placeholder="Core value proposition and transformation..."
            />
          </div>

          {/* Category & Aspect Ratio */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="matte-input"
                style={{ cursor: 'pointer' }}
              >
                <option value="B2B SaaS">B2B SaaS</option>
                <option value="DevTool">DevTool</option>
                <option value="AI Wrapper">AI Wrapper</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Indie Marketplace">Indie Marketplace</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ASPECT RATIO</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px 4px',
                    borderRadius: '6px',
                    border: aspectRatio === '9:16' ? '1px solid #475569' : '1px solid var(--border-subtle)',
                    background: aspectRatio === '9:16' ? '#1e2430' : '#0a0c10',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Smartphone size={13} />
                  <span>9:16</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px 4px',
                    borderRadius: '6px',
                    border: aspectRatio === '16:9' ? '1px solid #475569' : '1px solid var(--border-subtle)',
                    background: aspectRatio === '16:9' ? '#1e2430' : '#0a0c10',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Monitor size={13} />
                  <span>16:9</span>
                </button>
              </div>
            </div>
          </div>

          {/* Visual Style */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CINEMATIC STYLE</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="matte-input"
            >
              <option value="Kinetic High-Tech Dark">Kinetic High-Tech Dark</option>
              <option value="Cyberpunk Minimalist">Cyberpunk Minimalist</option>
              <option value="Hyper-Energetic Neon">Hyper-Energetic Neon</option>
              <option value="Sleek Silicon Valley Documentary">Sleek Silicon Valley Documentary</option>
            </select>
          </div>

          {/* Action Button */}
          <button
            onClick={handleCreateAndStream}
            disabled={generating}
            className="btn-solid-white"
            style={{ width: '100%', padding: '13px', fontSize: '0.94rem', marginTop: '6px' }}
          >
            {generating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Streaming Scene 1 (&lt;2s)...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate 3-Scene Video</span>
              </>
            )}
          </button>

          {/* Progress Bar */}
          {generating && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                <span>PROGRESSIVE PIPELINE</span>
                <span>{pipelineProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: '#1a1f28', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${pipelineProgress}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}

          {/* AI Voiceover & Real Video Synthesis Engine */}
          {campaign && (
            <div className="matte-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#0b0d12', border: '1px solid #1c2230', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Volume2 size={15} color="#cbd5e1" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f0f3f6', fontFamily: 'var(--font-mono)' }}>AI VOICEOVER & SYNTHESIS</span>
                </div>
                {renderStatus?.status === 'completed' && (
                  <span className="tag-minimal tag-emerald" style={{ fontSize: '0.66rem' }}>MP4 READY</span>
                )}
              </div>

              {/* Voice Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FOUNDER VOICE (EDGE NEURAL TTS)</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="matte-input"
                  disabled={renderingVideo}
                  style={{ fontSize: '0.8rem', padding: '8px 10px' }}
                >
                  <option value="en-US-GuyNeural">Guy (US Male - Founder Crisp)</option>
                  <option value="en-US-JennyNeural">Jenny (US Female - Clear & Engaging)</option>
                  <option value="en-GB-RyanNeural">Ryan (UK Male - Authoritative Tech)</option>
                  <option value="en-GB-SoniaNeural">Sonia (UK Female - Smooth Modern)</option>
                </select>
              </div>

              {/* Render Trigger Button */}
              <button
                type="button"
                onClick={handleStartRender}
                disabled={renderingVideo}
                className="btn-solid-white"
                style={{
                  width: '100%',
                  padding: '11px',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {renderingVideo ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Rendering MP4 Video...</span>
                  </>
                ) : renderStatus?.status === 'completed' ? (
                  <>
                    <RefreshCw size={14} />
                    <span>Re-Render Video</span>
                  </>
                ) : (
                  <>
                    <Film size={15} />
                    <span>Render 9:16 MP4 Video</span>
                  </>
                )}
              </button>

              {/* Render Progress */}
              {renderingVideo && renderStatus && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{renderStatus.current_step}</span>
                    <span>{renderStatus.progress_pct}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: '#1a1f28', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${renderStatus.progress_pct}%`, height: '100%', background: '#3b82f6', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              )}

              {/* Quick Actions if ready */}
              {renderStatus?.status === 'completed' && renderStatus.download_url && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                  <a
                    href={renderStatus.download_url}
                    download
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px',
                      background: '#10b981',
                      color: '#000000',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.82rem'
                    }}
                  >
                    <Download size={14} />
                    <span>Download MP4</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveTab('video_player')}
                    style={{
                      padding: '9px 12px',
                      background: '#161b24',
                      border: '1px solid #2d3748',
                      color: '#f0f3f6',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Play size={13} />
                    <span>Watch</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Progressive Review Room */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* View Mode Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'inline-flex', background: '#090a0d', padding: '3px', borderRadius: '8px', border: '1px solid #1a1e27' }}>
              <button
                type="button"
                onClick={() => setActiveTab('blueprint')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTab === 'blueprint' ? '#1c2230' : 'transparent',
                  color: activeTab === 'blueprint' ? '#ffffff' : '#717d91',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Layers size={14} />
                <span>Scene Blueprint & Vision QA</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('video_player')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeTab === 'video_player' ? '#1c2230' : 'transparent',
                  color: activeTab === 'video_player' ? '#ffffff' : '#717d91',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Video size={14} />
                <span>Rendered MP4 Player</span>
                {renderStatus?.status === 'completed' && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                )}
              </button>
            </div>

            {renderStatus?.status === 'completed' && renderStatus.download_url && (
              <a
                href={renderStatus.download_url}
                download
                className="btn-solid-white"
                style={{
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none'
                }}
              >
                <Download size={14} />
                <span>Download MP4 ({((renderStatus.file_size_bytes || 0) / 1024).toFixed(0)} KB)</span>
              </a>
            )}
          </div>

          {activeTab === 'video_player' ? (
            /* Dedicated Video Player Screen */
            <div className="matte-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', background: '#0a0c10' }}>
              {renderStatus?.status === 'completed' && renderStatus.video_url ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  {/* Video Player Frame */}
                  <div style={{
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#000000',
                    border: '1px solid #2d3748',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                    width: aspectRatio === '9:16' ? '300px' : '100%',
                    maxWidth: aspectRatio === '9:16' ? '300px' : '640px',
                    aspectRatio: aspectRatio === '9:16' ? '9/16' : '16/9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <video
                      key={renderStatus.video_url}
                      src={renderStatus.video_url}
                      controls
                      autoPlay
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  {/* Video Details & Actions Bar */}
                  <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                      gap: '8px',
                      background: '#0e1117',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #1a1e27'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>FORMAT</span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f0f3f6' }}>MP4 / H.264</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>RESOLUTION</span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f0f3f6' }}>{aspectRatio === '9:16' ? '1080x1920' : '1920x1080'}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>DURATION</span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f0f3f6' }}>{renderStatus.duration_seconds || 30}s</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>FILE SIZE</span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#10b981' }}>{((renderStatus.file_size_bytes || 0) / 1024).toFixed(1)} KB</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>VOICE ENGINE</span>
                        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#3b82f6' }}>Edge Neural TTS</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a
                          href={renderStatus.download_url}
                          download
                          className="btn-solid-white"
                          style={{
                            padding: '10px 18px',
                            fontSize: '0.88rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            textDecoration: 'none'
                          }}
                        >
                          <Download size={16} />
                          <span>Download Final MP4</span>
                        </a>
                        <button
                          type="button"
                          onClick={handleStartRender}
                          disabled={renderingVideo}
                          className="matte-panel"
                          style={{
                            padding: '10px 16px',
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#cbd5e1'
                          }}
                        >
                          <RefreshCw size={14} className={renderingVideo ? "animate-spin" : ""} />
                          <span>Re-Render</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab('blueprint')}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          textDecoration: 'underline'
                        }}
                      >
                        Back to Scene Blueprint
                      </button>
                    </div>
                  </div>
                </div>
              ) : renderingVideo ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <RefreshCw size={36} className="animate-spin" color="#3b82f6" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#f0f3f6' }}>Synthesizing Video & Audio</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: 0, maxWidth: '420px' }}>
                    {renderStatus?.current_step || 'Synthesizing voiceovers and compiling MP4 via FFmpeg...'}
                  </p>
                  <div style={{ width: '300px', height: '6px', background: '#1a1f28', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${renderStatus?.progress_pct || 20}%`, height: '100%', background: '#3b82f6', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              ) : (
                <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#161a22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Film size={26} color="#64748b" />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#f0f3f6' }}>Video Not Yet Rendered</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.86rem', maxWidth: '440px', margin: 0 }}>
                    Synthesize high-fidelity founder voiceovers with Microsoft Edge TTS and compile all 3 scenes into a downloadable 9:16 MP4 with kinetic subtitles.
                  </p>
                  <button
                    type="button"
                    onClick={handleStartRender}
                    disabled={!campaign}
                    className="btn-solid-white"
                    style={{ padding: '12px 22px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}
                  >
                    <Film size={16} />
                    <span>Synthesize & Render MP4 Now</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Progressive Scene Scrubber Bar */}
              <div className="matte-panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: '#0d0f14' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} color="#cbd5e1" />
                  <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Scene Timeline</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {[0, 1, 2].map((idx) => {
                    const sc = campaign?.scenes?.[idx];
                    const isSelected = selectedSceneIndex === idx;
                    const isReady = sc?.status === 'ready';
                    return (
                      <button
                        key={idx}
                        onClick={() => sc && setSelectedSceneIndex(idx)}
                        disabled={!sc}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: isSelected ? '1px solid #475569' : '1px solid var(--border-subtle)',
                          background: isSelected ? '#1c212c' : '#090a0c',
                          color: isReady ? '#ffffff' : '#64748b',
                          cursor: sc ? 'pointer' : 'not-allowed',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {isReady ? (
                          <CheckCircle2 size={13} color="#10b981" />
                        ) : (
                          <Clock size={13} color="#f59e0b" />
                        )}
                        <span>Scene {idx + 1} {idx === 0 ? '(Hook 0-3s)' : idx === 1 ? '(Feature)' : '(CTA)'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Scene Preview Screen & Director Cues */}
              {campaign && currentScene ? (
                <div style={{ display: 'grid', gridTemplateColumns: aspectRatio === '9:16' ? '300px 1fr' : '1fr', gap: '18px' }}>
                  {/* Cinema Media Frame */}
                  <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    height: aspectRatio === '9:16' ? '460px' : '320px',
                    background: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-default)'
                  }}>
                    <img
                      src={currentScene.media_url}
                      alt={currentScene.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                    />

                    {/* Kinetic Overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '12px',
                      right: '12px',
                      background: 'rgba(10, 12, 16, 0.94)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '0.64rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                        KINETIC TEXT OVERLAY
                      </span>
                      <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginTop: '2px', lineHeight: 1.25 }}>
                        "{currentScene.text_overlay}"
                      </p>
                    </div>

                    {/* Top Badge */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span className="tag-minimal tag-slate" style={{ background: 'rgba(9, 10, 12, 0.9)' }}>
                        SCENE {currentScene.scene_number} • {currentScene.timeframe}
                      </span>
                    </div>
                  </div>

                  {/* Scene Specs & Gemini Vision QA Card */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    
                    {/* Director Script Card */}
                    <div className="matte-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#0d0f14' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>{currentScene.title}</h3>
                        <span className="tag-minimal tag-slate">{currentScene.hook_type}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>VOICEOVER SCRIPT</span>
                        <p style={{ fontSize: '0.86rem', color: '#f0f3f6', background: '#07080b', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid #64748b' }}>
                          "{currentScene.voiceover_script}"
                        </p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
                        <div style={{ background: '#07080b', padding: '8px 10px', borderRadius: '6px' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>CAMERA CUES</span>
                          <span style={{ color: '#cbd5e1' }}>{currentScene.camera_cues}</span>
                        </div>
                        <div style={{ background: '#07080b', padding: '8px 10px', borderRadius: '6px' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>KINETIC MOTION</span>
                          <span style={{ color: '#cbd5e1' }}>{currentScene.kinetic_motion}</span>
                        </div>
                      </div>
                    </div>

                    {/* Gemini Vision QA Scorecard */}
                    {currentVisionScore && (
                      <div className="matte-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#0d0f14' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Eye size={16} color="#34d399" />
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>Gemini Vision Hook QA</h4>
                          </div>
                          <span className="tag-minimal tag-emerald">{currentVisionScore.verdict}</span>
                        </div>

                        {/* Gauges */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                          <div style={{ background: '#07080b', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-mono)' }}>HOOK SCORE</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>{currentVisionScore.hook_strength}/100</span>
                          </div>
                          <div style={{ background: '#07080b', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-mono)' }}>CLARITY</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60a5fa' }}>{currentVisionScore.brand_clarity}/100</span>
                          </div>
                          <div style={{ background: '#07080b', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-mono)' }}>READABILITY</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#cbd5e1' }}>{currentVisionScore.text_readability}/100</span>
                          </div>
                          <div style={{ background: '#07080b', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-mono)' }}>3S DROPOFF</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>{currentVisionScore.predicted_3s_dropoff}%</span>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                          {currentVisionScore.critique_summary}
                        </p>

                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderLeft: '3px solid #10b981', padding: '8px 10px', borderRadius: '4px' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#34d399', display: 'block', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>
                            OPTIMIZATION DIRECTIVES:
                          </span>
                          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                            {(currentVisionScore.actionable_improvements || currentVisionScore.improvement_suggestions || []).map((sug, sidx) => (
                              <li key={sidx}>{sug}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ) : (
                /* Placeholder State */
                <div className="matte-panel" style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  background: '#0d0f14'
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#161a22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Film size={22} color="#64748b" />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#cbd5e1' }}>Director Studio Ready</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: '420px', margin: 0 }}>
                    Configure your product pitch on the left and click <strong>Generate</strong> to stream Scene 1 in under 2 seconds.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Gemini 3.5 Flash Agentic Video Timeline Inspector */}
          {agenticAnalysis && (
            <div className="matte-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#0d0f14' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={18} color="#cbd5e1" />
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0 }}>Gemini 3.5 Flash Agentic Video Timeline</h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Dynamic Keyframe Probing Loop</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className="tag-minimal tag-emerald">-88% TOKENS</span>
                  <span className="tag-minimal tag-slate">-66% COST</span>
                </div>
              </div>

              {/* Inspections Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {agenticAnalysis.active_inspections.map((insp, idx) => (
                  <div key={idx} style={{ background: '#07080b', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="tag-minimal tag-slate">{insp.timestamp_seconds}s</span>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                        {insp.visual_retention_score}/100
                      </span>
                    </div>
                    <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#f0f3f6' }}>{insp.inspection_type}</span>
                    <p style={{ fontSize: '0.76rem', color: '#8b949e', margin: 0, lineHeight: 1.3 }}>{insp.critic_notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
