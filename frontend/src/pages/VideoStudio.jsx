import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, Pause, Sparkles, RefreshCw, Smartphone, Monitor, Zap, 
  CheckCircle2, Clock, Eye, AlertTriangle, ChevronRight, Layers, ArrowUpRight, Film
} from 'lucide-react';

export default function VideoStudio() {
  const [presets, setPresets] = useState([]);
  const [productName, setProductName] = useState('LaunchFlow');
  const [productPitch, setProductPitch] = useState('Autonomous customer onboarding & interactive walkthrough agent that triples free-to-paid conversion for SaaS founders.');
  const [category, setCategory] = useState('B2B SaaS');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [style, setStyle] = useState('Kinetic High-Tech Dark');

  const [generating, setGenerating] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState(0);
  const [campaign, setCampaign] = useState(null);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [agenticAnalysis, setAgenticAnalysis] = useState(null);
  const [inspectingAgentic, setInspectingAgentic] = useState(false);

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
            // Confetti celebration
            try {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
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
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Headline */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span className="badge-hook">
              <Zap size={12} /> FIRSTFRAME PROGRESSIVE ENGINE
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Scene 1 Instant Stream • Gemini 2.0 Director • Vision Hook QA
            </span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.15 }}>
            Multimodal <span className="gradient-text-cinema">Video Marketing Studio</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px', maxWidth: '680px' }}>
            Turn raw product pitches into high-converting 3-scene video ads. Review and critique Scene 1 in seconds without waiting for a full render.
          </p>
        </div>

        {/* 1-Click Founder Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            QUICK FOUNDER PRESETS
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="btn-cinema-secondary"
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                <Sparkles size={13} color="#c084fc" />
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Left Column: Video Creation Controls */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
            <Film size={20} color="#c084fc" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Director Prompt Controls</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="cinema-input"
              placeholder="e.g. Ashky"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Product Pitch / Value Proposition</label>
            <textarea
              value={productPitch}
              onChange={(e) => setProductPitch(e.target.value)}
              className="cinema-textarea"
              rows={3}
              placeholder="Describe your product's core feature, target audience pain, and transformation..."
            />
          </div>

          {/* Category & Aspect Ratio */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="cinema-input"
                style={{ cursor: 'pointer' }}
              >
                <option value="B2B SaaS">B2B SaaS</option>
                <option value="DevTool">DevTool</option>
                <option value="AI Wrapper">AI Wrapper</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Indie Marketplace">Indie Marketplace</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Aspect Ratio</label>
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
                    padding: '10px 6px',
                    borderRadius: '8px',
                    border: aspectRatio === '9:16' ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: aspectRatio === '9:16' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(0,0,0,0.3)',
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
                    padding: '10px 6px',
                    borderRadius: '8px',
                    border: aspectRatio === '16:9' ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: aspectRatio === '16:9' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(0,0,0,0.3)',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Cinematic Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="cinema-input"
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
            className="btn-cinema-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}
          >
            {generating ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Streaming Scene 1 (&lt;2s FirstFrame)...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Progressive 3-Scene Ad</span>
              </>
            )}
          </button>

          {/* Progress Bar */}
          {generating && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#c084fc' }}>
                <span>Pipeline Synthesis</span>
                <span>{pipelineProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${pipelineProgress}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #10b981)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Progressive Review Room */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Progressive Scene Scrubber Bar */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#8b5cf6" />
              <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Progressive Scene Timeline</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
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
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                      color: isReady ? '#ffffff' : 'var(--text-muted)',
                      cursor: sc ? 'pointer' : 'not-allowed',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isReady ? (
                      <CheckCircle2 size={14} color="#10b981" />
                    ) : (
                      <Clock size={14} color="#f59e0b" />
                    )}
                    <span>Scene {idx + 1} {idx === 0 ? '(0-3s Hook)' : idx === 1 ? '(Feature)' : '(CTA)'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Scene Preview Screen & Director Cues */}
          {campaign && currentScene ? (
            <div style={{ display: 'grid', gridTemplateColumns: aspectRatio === '9:16' ? '320px 1fr' : '1fr', gap: '20px' }}>
              {/* Cinema Media Frame */}
              <div className="glass-panel" style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                height: aspectRatio === '9:16' ? '540px' : '360px',
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)'
              }}>
                <img
                  src={currentScene.media_url}
                  alt={currentScene.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                />

                {/* Kinetic Overlay Simulated Banner */}
                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '16px',
                  right: '16px',
                  background: 'rgba(10, 12, 18, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Kinetic Text Overlay
                  </span>
                  <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginTop: '2px', lineHeight: 1.25 }}>
                    "{currentScene.text_overlay}"
                  </p>
                </div>

                {/* Top Badge */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '6px' }}>
                  <span className="badge-hook" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
                    SCENE {currentScene.scene_number} • {currentScene.timeframe}
                  </span>
                </div>
              </div>

              {/* Scene Specs & Gemini Vision QA Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Director Camera & Script Card */}
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{currentScene.title}</h3>
                    <span className="badge-tag">{currentScene.hook_type}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>VOICEOVER SCRIPT</span>
                    <p style={{ fontSize: '0.9rem', color: '#f8fafc', background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #8b5cf6' }}>
                      "{currentScene.voiceover_script}"
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px', borderRadius: '8px' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>CAMERA CUES</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{currentScene.camera_cues}</span>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px', borderRadius: '8px' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>KINETIC MOTION</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{currentScene.kinetic_motion}</span>
                    </div>
                  </div>
                </div>

                {/* Gemini Vision Hook Critic QA Scorecard */}
                {currentVisionScore && (
                  <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Eye size={18} color="#10b981" />
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Gemini Vision Hook QA</h4>
                      </div>
                      <span className="badge-hook">{currentVisionScore.verdict}</span>
                    </div>

                    {/* Score Gauges */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Hook Score</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{currentVisionScore.hook_strength}/100</span>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Brand Clarity</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa' }}>{currentVisionScore.brand_clarity}/100</span>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Readability</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c084fc' }}>{currentVisionScore.text_readability}/100</span>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>3s Drop-off</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>{currentVisionScore.predicted_3s_dropoff}%</span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {currentVisionScore.critique_summary}
                    </p>

                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderLeft: '3px solid #10b981', padding: '10px 12px', borderRadius: '4px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', display: 'block', marginBottom: '4px' }}>
                        ACTIONABLE IMPROVEMENTS:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {currentVisionScore.actionable_improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Gemini Agentic Video Understanding Card */}
                <div className="glass-panel" style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(10, 12, 18, 0.95) 100%)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} color="#c084fc" />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Gemini Agentic Video Understanding</h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dynamic Keyframe Probing & Retention Analytics</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRunAgenticInspect()}
                      disabled={inspectingAgentic}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                        color: '#c084fc',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {inspectingAgentic ? <RefreshCw size={12} className="animate-spin" /> : <Zap size={12} />}
                      <span>{inspectingAgentic ? 'Probing Frames...' : 'Run Agentic Inspection'}</span>
                    </button>
                  </div>

                  {agenticAnalysis ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Token Efficiency Banner */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        background: 'rgba(0,0,0,0.4)',
                        padding: '10px',
                        borderRadius: '8px'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Token Reduction</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                            -{agenticAnalysis.token_reduction_pct}%
                          </span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Cost Savings</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60a5fa' }}>
                            -{agenticAnalysis.cost_savings_pct}%
                          </span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Tokens Used</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c084fc' }}>
                            {agenticAnalysis.tokens_consumed.toLocaleString()} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>/ {agenticAnalysis.static_ingestion_baseline_tokens.toLocaleString()}</span>
                          </span>
                        </div>
                      </div>

                      {/* Targeted Keyframe Probing Points */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Targeted Timeline Inspections (Agentic Sampling)
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          {agenticAnalysis.active_inspections.map((insp, idx) => (
                            <div key={idx} style={{
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.07)',
                              borderRadius: '8px',
                              padding: '10px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc' }}>
                                  @{insp.timestamp_seconds}s ? {insp.inspection_type.replace('_', ' ')}
                                </span>
                                <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>
                                  {insp.visual_retention_score}/100
                                </span>
                              </div>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
                                {insp.critic_notes}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Agentic Strategic Advice */}
                      {agenticAnalysis.recommended_modifications?.length > 0 && (
                        <div style={{ background: 'rgba(139, 92, 246, 0.08)', borderLeft: '3px solid #8b5cf6', padding: '10px 12px', borderRadius: '4px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#c084fc', display: 'block', marginBottom: '4px' }}>
                            AGENTIC RETENTION RECOMMENDATIONS:
                          </span>
                          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {agenticAnalysis.recommended_modifications.map((rec, i) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                        Click <strong>Run Agentic Inspection</strong> above to evaluate keyframe retention with Gemini's new 88% token-efficient agentic video understanding model.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            /* Standby State */
            <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Film size={32} color="#8b5cf6" />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Studio Review Room Ready</h3>
              <p style={{ maxWidth: '480px', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Select a founder preset on the left or enter your own product pitch. When generated, <strong>Scene 1 streams immediately</strong> under the FirstFrame progressive pipeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
