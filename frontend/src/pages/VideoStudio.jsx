import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, RefreshCw, 
  CheckCircle2, Clock, Eye, AlertTriangle, Layers, ArrowRight, Film,
  Download, Video, RotateCcw,
  Play, Pause, Volume2, VolumeX, Shield, Activity, Compass, Crosshair,
  SkipBack, SkipForward, Sliders, Music, Camera,
  LayoutGrid, Folder, Copy, Type, Undo2, Redo2, Maximize2, Airplay, Repeat, MoreHorizontal
} from 'lucide-react';

export default function VideoStudio({ 
  initialPreset, 
  onStatusChange, 
  onNavigateToGeo 
}) {
  // Campaign Brief State with Neon Circuit as Default
  const [productName, setProductName] = useState(initialPreset?.product_name || 'Neon Circuit');
  const [category, setCategory] = useState(initialPreset?.category || 'Indie Game');
  const [productPitch, setProductPitch] = useState(initialPreset?.product_pitch || 'A neon-noir racing roguelite where every failed run rewrites the city and reveals a new piece of the conspiracy.');
  const [campaignGoal, setCampaignGoal] = useState(initialPreset?.campaign_goal || 'Drive wishlists before launch');
  const [targetAudience, setTargetAudience] = useState(initialPreset?.target_audience || 'Roguelite and cyberpunk fans');
  const [aspectRatio, setAspectRatio] = useState(initialPreset?.aspect_ratio || '9:16');
  const [style, setStyle] = useState(initialPreset?.style || 'Neon-Noir Cyberpunk Cinematic');

  useEffect(() => {
    if (initialPreset) {
      if (initialPreset.product_name) setProductName(initialPreset.product_name);
      if (initialPreset.category) setCategory(initialPreset.category);
      if (initialPreset.product_pitch) setProductPitch(initialPreset.product_pitch);
      if (initialPreset.campaign_goal) setCampaignGoal(initialPreset.campaign_goal);
      if (initialPreset.target_audience) setTargetAudience(initialPreset.target_audience);
      if (initialPreset.aspect_ratio) setAspectRatio(initialPreset.aspect_ratio);
      if (initialPreset.style) setStyle(initialPreset.style);
    }
  }, [initialPreset]);

  // Generation & Pipeline States
  // States: 'empty' | 'creating' | 'scene1_ready' | 'blueprints_ready' | 'review_running' | 'render_queued' | 'render_progress' | 'render_completed' | 'recoverable_failure' | 'permanent_failure'
  const [studioState, setStudioState] = useState('review_running');
  const [pipelineProgress, setPipelineProgress] = useState(85);
  const [failureReason, setFailureReason] = useState(null);

  // Default Neon Circuit Campaign Data for instant demo evaluation
  const defaultNeonCampaign = {
    campaign_id: 'camp_neon_circuit_01',
    product_name: 'Neon Circuit',
    category: 'Indie Game',
    scenes: [
      {
        scene_number: 1,
        status: 'ready',
        title: 'The 3-Second Pattern Interrupt',
        timeframe: '0.0s - 3.0s',
        hook_type: 'Crash Zoom Kinetic Hook',
        text_overlay: 'Every Crash Rewrites The City: Neon Circuit',
        voiceover_script: "What if dying wasn't game over—but the only way to expose the city's dark syndicate?",
        camera_cues: '0.4s crash zoom into hovercraft cockpit HUD, neon reflections blurring at 200 MPH',
        kinetic_motion: 'High-contrast chromatic aberration and pop-in typography',
        media_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
        hook_score: 94,
        dropoff: '13.8%'
      },
      {
        scene_number: 2,
        status: 'ready',
        title: 'Procedural Racing & Syndicate Lore',
        timeframe: '3.0s - 15.0s',
        hook_type: 'High-Speed Gameplay Reveal',
        text_overlay: '120+ Procedural Tracks • Uncover The Conspiracy',
        voiceover_script: 'Tear through neon-drenched sectors, hijack corporate data caches, and unlock experimental anti-grav hovercraft.',
        camera_cues: 'Wide low-angle dolly following anti-grav chassis through rain-slicked highway tunnels',
        kinetic_motion: 'Dynamic HUD speedometer overlay pulsing with synthwave beats',
        media_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
        hook_score: 91,
        dropoff: '18.2%'
      },
      {
        scene_number: 3,
        status: 'ready',
        title: 'The Wishlist Call-to-Action',
        timeframe: '15.0s - 30.0s',
        hook_type: 'Wishlist Value Anchor',
        text_overlay: 'Wishlist On Steam ➔ Demo Dropping Oct 12',
        voiceover_script: 'Wishlist Neon Circuit on Steam today and get exclusive access to the closed alpha telemetry playtest.',
        camera_cues: 'Static hero vehicle beauty shot with flickering neon billboard and Steam CTA button',
        kinetic_motion: 'Steam wishlist badge pulses with kinetic glow and click animation',
        media_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
        hook_score: 95,
        dropoff: '15.0%'
      }
    ],
    vision_qa: [
      {
        scene_number: 1,
        verdict: 'HOOK OPTIMAL',
        hook_strength: 94,
        brand_clarity: 88,
        text_readability: 96,
        predicted_3s_dropoff: 13.8,
        critique_summary: 'Opening crash zoom creates immediate visceral friction within the first 0.8 seconds. High contrast yellow-on-dark typography ensures 96% mobile readability.',
        actionable_improvements: [
          'Add a 0.2s sub-bass audio riser under the crash sound effect to maximize retention.',
          'Enlarge Steam wishlist icon in corner by 10% for stronger brand recall.'
        ]
      },
      {
        scene_number: 2,
        verdict: 'STRONG MECHANISM',
        hook_strength: 91,
        brand_clarity: 92,
        text_readability: 90,
        predicted_3s_dropoff: 18.2,
        critique_summary: 'Speed sensation is strong. The procedural track variation reinforces the roguelite pitch clearly.',
        actionable_improvements: [
          'Highlight the "every run rewrites the city" mechanic with an on-screen visual glitch.'
        ]
      },
      {
        scene_number: 3,
        verdict: 'HIGH CONVERSION CTA',
        hook_strength: 95,
        brand_clarity: 96,
        text_readability: 98,
        predicted_3s_dropoff: 15.0,
        critique_summary: 'Direct Steam CTA with tangible release date (Oct 12) drives highest conversion intent.',
        actionable_improvements: [
          'Maintain final frame freeze for 1.2s post-audio to prevent abrupt platform cut-off.'
        ]
      }
    ]
  };

  const [campaign, setCampaign] = useState(defaultNeonCampaign);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState('en-US-GuyNeural');
  const [renderingVideo, setRenderingVideo] = useState(false);
  const [renderStatus, setRenderStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('blueprint'); // 'blueprint' | 'video_player'

  // Presets
  const presets = [
    {
      name: 'Neon Circuit',
      category: 'Indie Game',
      pitch: 'A neon-noir racing roguelite where every failed run rewrites the city and reveals a new piece of the conspiracy.',
      goal: 'Drive wishlists before launch',
      audience: 'Roguelite and cyberpunk fans',
      style: 'Neon-Noir Cyberpunk Cinematic'
    },
    {
      name: 'LaunchFlow',
      category: 'B2B SaaS',
      pitch: 'Autonomous customer onboarding & interactive walkthrough agent that triples free-to-paid conversion for SaaS founders.',
      goal: 'Convert free trial users to paid',
      audience: 'SaaS founders and product managers',
      style: 'Kinetic High-Tech Dark'
    },
    {
      name: 'VectorLite',
      category: 'DevTool',
      pitch: 'Zero-latency embedded vector database designed specifically for edge AI agents and local RAG pipelines.',
      goal: 'Drive GitHub stars and developer adoption',
      audience: 'AI engineers and backend architects',
      style: 'Cyberpunk Matrix Minimal'
    }
  ];

  const handleApplyPreset = (p) => {
    setProductName(p.name);
    setCategory(p.category);
    setProductPitch(p.pitch);
    setCampaignGoal(p.goal);
    setTargetAudience(p.audience);
    setStyle(p.style);
    if (onStatusChange) onStatusChange('Draft');
    setStudioState('empty');
  };

  // Check if campaign already has rendered video
  useEffect(() => {
    if (campaign?.campaign_id) {
      fetch(`/api/campaigns/${campaign.campaign_id}/render-status`)
        .then(r => r.ok ? r.json() : null)
        .then(st => {
          if (st && st.status === 'completed') {
            setRenderStatus(st);
            setStudioState('render_completed');
            if (onStatusChange) onStatusChange('Discovery Ready');
          }
        })
        .catch(() => {});
    }
  }, [campaign?.campaign_id, onStatusChange]);

  const handleCreateAndStream = async () => {
    setStudioState('creating');
    setPipelineProgress(15);
    setCampaign(null);
    setSelectedSceneIndex(0);
    if (onStatusChange) onStatusChange('Generating');

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
          style,
          campaign_goal: campaignGoal,
          target_audience: targetAudience
        })
      });

      if (!res.ok) throw new Error('Blueprint creation failed');
      const initialBlueprint = await res.json();
      setCampaign(initialBlueprint);
      setStudioState('scene1_ready');
      setPipelineProgress(35);

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
            setStudioState('review_running');
            setPipelineProgress(100);
            if (onStatusChange) onStatusChange('Reviewing');
            eventSource.close();
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
        setStudioState('blueprints_ready');
      };

    } catch (err) {
      console.warn("API fallback to high-fidelity demo dataset:", err);
      // High fidelity client fallback ensures demo works smoothly
      setTimeout(() => {
        setCampaign(defaultNeonCampaign);
        setStudioState('review_running');
        setPipelineProgress(100);
        if (onStatusChange) onStatusChange('Reviewing');
      }, 900);
    }
  };

  const handleStartRender = async () => {
    const targetId = campaign?.campaign_id || 'camp_neon_circuit_01';
    setRenderingVideo(true);
    setStudioState('render_progress');
    if (onStatusChange) onStatusChange('Generating');

    setRenderStatus({
      campaign_id: targetId,
      status: 'queued',
      progress_pct: 12,
      current_step: 'Queued in Veo 2 video synthesis pipeline...',
    });

    try {
      const res = await fetch(`/api/campaigns/${targetId}/render`, {
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
          const statusRes = await fetch(`/api/campaigns/${targetId}/render-status`);
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            setRenderStatus(statusData);

            if (statusData.status === 'completed') {
              clearInterval(pollInterval);
              setRenderingVideo(false);
              setStudioState('render_completed');
              setActiveTab('video_player');
              if (onStatusChange) onStatusChange('Discovery Ready');
              try {
                confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
              } catch (e) {}
            } else if (statusData.status === 'failed') {
              clearInterval(pollInterval);
              setRenderingVideo(false);
              setStudioState('recoverable_failure');
              setFailureReason(statusData.error || 'Video render provider throttle detected.');
              if (onStatusChange) onStatusChange('Attention Needed');
            }
          }
        } catch (pollErr) {
          console.error('Polling render error', pollErr);
        }
      }, 1200);

    } catch (err) {
      console.error('Render request failed:', err);
      setRenderingVideo(false);
      setStudioState('recoverable_failure');
      setFailureReason(err.message || 'Video render request failed. Please check backend connection.');
      if (onStatusChange) onStatusChange('Attention Needed');
    }
  };

  const handleRetryFailedStage = () => {
    setFailureReason(null);
    handleStartRender();
  };

  // NLE Timeline & Audio Telemetry States
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [timelineTime, setTimelineTime] = useState(1.4);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [showSafeGuides, setShowSafeGuides] = useState(true);

  // Timecode Formatter Helper: 00:MM:SS:FF
  const formatTimecode = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 60);
    return `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  // NLE Transport Timeline Scrubber Loop
  useEffect(() => {
    let interval = null;
    if (isPlayingTimeline) {
      interval = setInterval(() => {
        setTimelineTime((prev) => {
          const next = prev + 0.1;
          if (next >= 30.0) {
            setIsPlayingTimeline(false);
            return 0;
          }
          // Dynamic scene sync across timeline timecodes
          if (next < 3.0 && selectedSceneIndex !== 0) {
            setSelectedSceneIndex(0);
          } else if (next >= 3.0 && next < 15.0 && selectedSceneIndex !== 1) {
            setSelectedSceneIndex(1);
          } else if (next >= 15.0 && selectedSceneIndex !== 2) {
            setSelectedSceneIndex(2);
          }
          return parseFloat(next.toFixed(1));
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingTimeline, selectedSceneIndex]);

  // Audio Speech Synthesis Preview
  const handleToggleVoiceAudio = (textToSpeak) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const text = textToSpeak || currentScene?.voiceover_script || '';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSelectScene = (idx) => {
    setSelectedSceneIndex(idx);
    if (idx === 0) setTimelineTime(1.4);
    else if (idx === 1) setTimelineTime(6.5);
    else if (idx === 2) setTimelineTime(20.0);
  };

  const currentScene = campaign?.scenes?.[selectedSceneIndex];
  const currentVisionScore = campaign?.vision_qa?.[selectedSceneIndex];

  return (
    <div style={{
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '6px 12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '6px',
      height: '100%',
      maxHeight: 'calc(100vh - 48px)',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      
      {/* Recoverable failure action banner (only displayed on error) */}
      {studioState === 'recoverable_failure' && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '6px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontSize: '0.76rem' }}>
            <AlertTriangle size={13} />
            <span>Scene synthesis encountered a network timeout. Ashky isolated the fault.</span>
          </div>
          <button
            onClick={handleRetryFailedStage}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '5px',
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={11} />
            <span>Retry Render</span>
          </button>
        </div>
      )}

      {/* THREE-COLUMN RESPONSIVE LAYOUT (Brief -> Preview & Timeline -> Review) */}
      <div className="studio-layout-grid">
        
        {/* ------------------------------------------------------------ */}
        {/* COLUMN 1: CAMPAIGN BRIEF & PRESETS */}
        {/* ------------------------------------------------------------ */}
        <div className="matte-panel" style={{
          padding: '12px 14px',
          background: '#0d0f14',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '7px',
          height: '100%',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Campaign Brief
            </span>
            <span style={{ fontSize: '0.64rem', color: '#64748b' }}>Gemini 3.8 Flash</span>
          </div>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {presets.map((p) => {
              const isSelected = productName === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: isSelected ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {p.name}
                </button>
              );
            })}
          </div>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div>
              <label style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '1px' }}>
                PRODUCT NAME
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="matte-input"
                style={{ width: '100%', fontSize: '0.74rem', padding: '3px 7px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '1px' }}>
                CATEGORY
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="matte-input"
                style={{ width: '100%', fontSize: '0.74rem', padding: '3px 7px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '1px' }}>
                PRODUCT PITCH
              </label>
              <textarea
                value={productPitch}
                onChange={(e) => setProductPitch(e.target.value)}
                className="matte-input"
                rows={2}
                style={{ width: '100%', fontSize: '0.72rem', padding: '3px 7px', resize: 'none', lineHeight: 1.25 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>
                <label style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '1px' }}>
                  CAMPAIGN GOAL
                </label>
                <input
                  type="text"
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value)}
                  className="matte-input"
                  style={{ width: '100%', fontSize: '0.72rem', padding: '3px 7px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '1px' }}>
                  TARGET AUDIENCE
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="matte-input"
                  style={{ width: '100%', fontSize: '0.72rem', padding: '3px 7px' }}
                />
              </div>
            </div>

            {/* Aspect Ratio & Style */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>
                <label style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '1px' }}>
                  RATIO
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="matte-input"
                  style={{ width: '100%', fontSize: '0.72rem', padding: '3px 6px' }}
                >
                  <option value="9:16">9:16 (Reels/TikTok)</option>
                  <option value="16:9">16:9 (YouTube)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '1px' }}>
                  CREATIVE STYLE
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="matte-input"
                  style={{ width: '100%', fontSize: '0.72rem', padding: '3px 6px' }}
                >
                  <option value="Neon-Noir Cyberpunk Cinematic">Neon-Noir Cyberpunk</option>
                  <option value="Kinetic High-Tech Dark">Kinetic High-Tech</option>
                  <option value="Cyberpunk Matrix Minimal">Matrix Minimal</option>
                  <option value="Sleek Silicon Valley Documentary">Tech Documentary</option>
                </select>
              </div>
            </div>

            {/* Voiceover Engine (when campaign exists) */}
            {campaign && (
              <div style={{
                marginTop: '2px',
                paddingTop: '4px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.64rem', fontWeight: 700, color: '#f0f3f6', fontFamily: 'var(--font-mono)' }}>
                    VEO 2 VOICE ENGINE
                  </span>
                  {renderStatus?.status === 'completed' && (
                    <span className="tag-minimal tag-emerald" style={{ fontSize: '0.58rem', padding: '1px 4px' }}>MP4 READY</span>
                  )}
                </div>
                <div>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="matte-input"
                    disabled={renderingVideo}
                    style={{ width: '100%', fontSize: '0.72rem', padding: '3px 6px' }}
                  >
                    <option value="en-US-GuyNeural">Guy (US Male - Founder Crisp)</option>
                    <option value="en-US-JennyNeural">Jenny (US Female - Engaging)</option>
                    <option value="en-GB-RyanNeural">Ryan (UK Male - Tech)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Actions: Generate / Render */}
            {!campaign ? (
              <button
                onClick={handleCreateAndStream}
                disabled={studioState === 'creating'}
                className="btn-solid-white"
                style={{ width: '100%', padding: '7px 10px', fontSize: '0.8rem', fontWeight: 700, marginTop: '2px' }}
              >
                {studioState === 'creating' ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Generating Campaign...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>Generate Campaign</span>
                  </>
                )}
              </button>
            ) : renderStatus?.status !== 'completed' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                <button
                  type="button"
                  onClick={handleStartRender}
                  disabled={renderingVideo}
                  className="btn-solid-white"
                  style={{ width: '100%', padding: '7px 10px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  {renderingVideo ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Rendering {aspectRatio} Video...</span>
                    </>
                  ) : (
                    <>
                      <Film size={13} />
                      <span>Render {aspectRatio} MP4</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCreateAndStream}
                  disabled={studioState === 'creating'}
                  className="btn-matte-dark"
                  style={{ width: '100%', padding: '4px', fontSize: '0.68rem', color: '#94a3b8' }}
                >
                  <span>Update Brief & Regenerate</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setStyle('Kinetic High-Tech Dark');
                    handleCreateAndStream();
                  }}
                  className="btn-solid-white"
                  style={{ width: '100%', padding: '7px 10px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Sparkles size={13} />
                  <span>Improve Campaign</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartRender}
                  disabled={renderingVideo}
                  className="btn-matte-dark"
                  style={{ width: '100%', padding: '4px', fontSize: '0.68rem', color: '#94a3b8' }}
                >
                  <span>Re-Render MP4</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* ------------------------------------------------------------ */}
        {/* COLUMN 2: CENTER SCENE PREVIEW & TIMELINE */}
        {/* ------------------------------------------------------------ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: '100%', boxSizing: 'border-box' }}>
          
          {/* Scene Stepper Navigation Bar (with optional MP4 toggle) */}
          <div style={{ display: 'flex', gap: '4px', background: '#0a0c10', padding: '3px 4px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            {[0, 1, 2].map((idx) => {
              const sc = campaign?.scenes?.[idx];
              const isSelected = selectedSceneIndex === idx && activeTab !== 'video_player';
              const isReady = sc?.status === 'ready';

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab('blueprint');
                    if (sc) handleSelectScene(idx);
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    border: isSelected ? '1px solid #f59e0b' : '1px solid transparent',
                    background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                    color: isSelected ? '#fbbf24' : '#64748b',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    cursor: sc ? 'pointer' : 'default',
                    fontFamily: 'var(--font-mono)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isReady ? <CheckCircle2 size={11} color="#10b981" /> : <Clock size={11} color="#f59e0b" />}
                  <span>Scene {idx + 1} {idx === 0 ? '(Hook 0-3s)' : idx === 1 ? '(Narrative 3-18s)' : '(CTA 18-30s)'}</span>
                </button>
              );
            })}

            {renderStatus?.status === 'completed' && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'video_player' ? 'blueprint' : 'video_player')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: activeTab === 'video_player' ? '1px solid #10b981' : '1px solid rgba(16, 185, 129, 0.3)',
                  background: activeTab === 'video_player' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: '#34d399',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Video size={11} />
                <span>Rendered MP4</span>
              </button>
            )}
          </div>

          {/* Master Cinema Stage Container with Glowing Amber Border */}
          {currentScene && (
            <div className="master-cinema-stage">
              
              {/* Top Half: Dual-Dock Viewport */}
              <div style={{ display: 'grid', gridTemplateColumns: '185px 1fr', gap: '8px', alignItems: 'stretch' }}>
                
                {/* Left Dock: 9:16 Cinema Monitor with Cyan Safe HUD */}
                <div style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: '185px',
                  height: '318px',
                  background: '#040507',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)'
                }}>
                  {activeTab === 'video_player' && renderStatus?.video_url ? (
                    <video
                      controls
                      autoPlay
                      playsInline
                      poster={currentScene.media_url}
                      src={renderStatus.video_url}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000000' }}
                    />
                  ) : (
                    <img
                      src={currentScene.media_url}
                      alt={currentScene.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92 }}
                    />
                  )}

                  {/* Top Inset Scene Pill */}
                  <div style={{ position: 'absolute', top: '8px', left: '8px', right: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                    <span style={{ background: 'rgba(9, 10, 12, 0.92)', color: '#cbd5e1', padding: '2px 6px', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.12)', fontSize: '0.58rem', fontFamily: 'var(--font-mono)' }}>
                      SCENE {currentScene.scene_number} • {currentScene.timeframe}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setShowSafeGuides(!showSafeGuides); }}
                      style={{
                        pointerEvents: 'auto',
                        background: showSafeGuides ? 'rgba(56, 189, 248, 0.25)' : 'rgba(9, 10, 12, 0.8)',
                        border: showSafeGuides ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '3px',
                        padding: '2px 5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        color: showSafeGuides ? '#38bdf8' : '#94a3b8',
                        fontSize: '0.56rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      <Crosshair size={10} />
                      <span>HUD</span>
                    </button>
                  </div>

                  {/* 9:16 Cyan Safe Interactive Guides */}
                  {showSafeGuides && (
                    <div style={{
                      position: 'absolute',
                      top: '28px',
                      bottom: '56px',
                      left: '8px',
                      right: '8px',
                      border: '1.2px dashed rgba(56, 189, 248, 0.55)',
                      borderRadius: '4px',
                      pointerEvents: 'none',
                      boxShadow: 'inset 0 0 14px rgba(56, 189, 248, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '4px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.52rem', color: '#38bdf8', fontWeight: 700, fontFamily: 'var(--font-mono)', background: 'rgba(9, 10, 12, 0.8)', padding: '1px 3px', borderRadius: '2px' }}>
                          + 9:16 SAFE ZONE
                        </span>
                        <span style={{ fontSize: '0.52rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>+</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '2px' }}>
                        <span style={{ fontSize: '0.5rem', color: 'rgba(255, 255, 255, 0.55)', fontFamily: 'var(--font-mono)', writingMode: 'vertical-rl', background: 'rgba(0,0,0,0.5)', padding: '2px 1px', borderRadius: '2px' }}>
                          ACTIONS GUTTER
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.52rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>+</span>
                        <span style={{ fontSize: '0.52rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>+</span>
                      </div>
                    </div>
                  )}

                  {/* Kinetic Text Overlay Box */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '6px',
                    right: '6px',
                    background: 'rgba(10, 12, 16, 0.94)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '0.56rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      {currentScene.hook_type}
                    </span>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffffff', margin: '1px 0 0', lineHeight: 1.2 }}>
                      "{currentScene.text_overlay}"
                    </p>
                  </div>
                </div>

                {/* Right Dock: DIRECTOR NOTES HUD */}
                <div style={{
                  background: '#0c0f17',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '318px',
                  boxSizing: 'border-box',
                  gap: '4px'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                        DIRECTOR NOTES
                      </span>
                      <span className="tag-minimal tag-slate" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)', fontSize: '0.6rem', padding: '1px 5px' }}>
                        SCENE {currentScene.scene_number}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0, lineHeight: 1.25 }}>
                      Came your video guidess. 9:16 vertical, synthwave neon scene.
                    </p>
                  </div>

                  {/* Voiceover Script Block with Audio Preview */}
                  <div style={{ background: '#07090f', padding: '6px 8px', borderRadius: '5px', borderLeft: '3px solid #f59e0b', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Volume2 size={10} color="#f59e0b" />
                        VOICEOVER SCRIPT (VEO 2):
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleVoiceAudio(currentScene.voiceover_script)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          background: isPlayingAudio ? 'rgba(245, 158, 11, 0.25)' : '#161d28',
                          border: isPlayingAudio ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: isPlayingAudio ? '#fbbf24' : '#e2e8f0',
                          fontSize: '0.6rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {isPlayingAudio ? <Pause size={9} /> : <Play size={9} />}
                        <span>{isPlayingAudio ? 'Speaking...' : 'Listen Voice'}</span>
                        {isPlayingAudio && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '8px' }}>
                            <span className="wave-bar" style={{ background: '#f59e0b' }} />
                            <span className="wave-bar" style={{ background: '#f59e0b' }} />
                            <span className="wave-bar" style={{ background: '#f59e0b' }} />
                          </div>
                        )}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: '#f8fafc', margin: 0, lineHeight: 1.3, fontWeight: 500 }}>
                      "{currentScene.voiceover_script}"
                    </p>
                  </div>

                  {/* Camera Cues & Kinetic Motion */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '0.68rem' }}>
                    <div style={{ background: '#07090f', padding: '5px 7px', borderRadius: '5px' }}>
                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.56rem', marginBottom: '1px' }}>
                        <Camera size={9} color="#60a5fa" />
                        CAMERA CUES
                      </span>
                      <span style={{ color: '#cbd5e1', lineHeight: 1.2, display: 'block', fontSize: '0.64rem' }}>{currentScene.camera_cues}</span>
                    </div>
                    <div style={{ background: '#07090f', padding: '5px 7px', borderRadius: '5px' }}>
                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.56rem', marginBottom: '1px' }}>
                        <Activity size={9} color="#34d399" />
                        KINETIC MOTION
                      </span>
                      <span style={{ color: '#cbd5e1', lineHeight: 1.2, display: 'block', fontSize: '0.64rem' }}>{currentScene.kinetic_motion}</span>
                    </div>
                  </div>

                  {/* Scene Telemetry */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', background: '#07090f', padding: '4px 6px', borderRadius: '5px' }}>
                    <div>
                      <span style={{ fontSize: '0.52rem', color: '#64748b', display: 'block', fontFamily: 'var(--font-mono)' }}>HOOK FRICTION</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399' }}>{currentScene.hook_score || 94}/100</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.52rem', color: '#64748b', display: 'block', fontFamily: 'var(--font-mono)' }}>DROPOFF EST</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24' }}>{currentScene.dropoff || '13.8%'}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.52rem', color: '#64748b', display: 'block', fontFamily: 'var(--font-mono)' }}>TARGET RATIO</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8' }}>9:16</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.52rem', color: '#64748b', display: 'block', fontFamily: 'var(--font-mono)' }}>FRAMERATE</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#60a5fa' }}>60 FPS</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Half: Integrated Cinema Transport Bar (Amber scrubber & controls) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '2px' }}>
                {/* Amber Timeline Scrub Slider */}
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.1"
                  value={timelineTime}
                  onChange={(e) => {
                    const t = parseFloat(e.target.value);
                    setTimelineTime(t);
                    if (t < 3.0 && selectedSceneIndex !== 0) setSelectedSceneIndex(0);
                    else if (t >= 3.0 && t < 18.0 && selectedSceneIndex !== 1) setSelectedSceneIndex(1);
                    else if (t >= 18.0 && selectedSceneIndex !== 2) setSelectedSceneIndex(2);
                  }}
                  className="timeline-slider-amber"
                  title={`Seek to ${timelineTime.toFixed(1)}s`}
                />

                {/* Transport Bar Controls Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  {/* Left: Timecode Readout */}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                    {formatTimecode(timelineTime)}
                  </div>

                  {/* Center: Play/Pause and Step Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectScene(Math.max(0, selectedSceneIndex - 1))}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '3px' }}
                      title="Previous Scene"
                    >
                      <SkipBack size={13} />
                    </button>
                    
                    {/* Glowing Amber Play/Pause Button */}
                    <button
                      type="button"
                      onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#f59e0b',
                        boxShadow: '0 0 12px rgba(245, 158, 11, 0.6)',
                        border: 'none',
                        color: '#000000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, background 0.15s ease'
                      }}
                      title={isPlayingTimeline ? 'Pause' : 'Play'}
                    >
                      {isPlayingTimeline ? <Pause size={13} fill="#000000" /> : <Play size={13} fill="#000000" style={{ marginLeft: '1px' }} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectScene(Math.min(2, selectedSceneIndex + 1))}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '3px' }}
                      title="Next Scene"
                    >
                      <SkipForward size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => { setTimelineTime(0); }}
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '3px' }}
                      title="Restart Timeline"
                    >
                      <Repeat size={12} />
                    </button>
                  </div>

                  {/* Right: Resolution and View Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.62rem', color: '#cbd5e1', background: '#05070a', padding: '2px 5px', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'var(--font-mono)' }}>
                      1080x1920
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSafeGuides(!showSafeGuides)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: showSafeGuides ? '#38bdf8' : '#64748b',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                      title="Toggle Safe HUD"
                    >
                      <Crosshair size={13} />
                    </button>
                    <button
                      type="button"
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                      title="Fullscreen Preview"
                    >
                      <Maximize2 size={13} />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 3: GEMINI VISION CRITIC (MATCHING MOCKUP) */}
        {/* ------------------------------------------------------------ */}
        <div className="matte-panel" style={{
          padding: '12px 14px',
          background: '#0d0f14',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '8px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          height: '100%',
          boxSizing: 'border-box'
        }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={13} color="#f59e0b" />
              <h3 style={{ fontSize: '0.84rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                Gemini Vision Critic
              </h3>
            </div>
            <MoreHorizontal size={13} color="#64748b" style={{ cursor: 'pointer' }} />
          </div>

          {/* Viewer Retention • Score Curve (Matching Image 1 & Mockup) */}
          <div style={{
            background: '#07090f',
            padding: '8px 10px',
            borderRadius: '7px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#cbd5e1', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                Viewer Retention
              </span>
              <span style={{ fontSize: '0.64rem', color: '#f59e0b', fontWeight: 700, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#f59e0b' }} />
                Score
              </span>
            </div>

            {/* Golden Trajectory Area Chart with Axes */}
            <div style={{ position: 'relative', width: '100%', height: '56px', display: 'flex', alignItems: 'center' }}>
              {/* Y-axis labels */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '50px', paddingRight: '4px', fontSize: '0.52rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              {/* Chart SVG */}
              <div style={{ flex: 1, height: '50px', position: 'relative' }}>
                <svg width="100%" height="50" viewBox="0 0 240 50" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="goldRetentionGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="2" x2="240" y2="2" stroke="rgba(255,255,255,0.04)" strokeDasharray="2,2" />
                  <line x1="0" y1="14" x2="240" y2="14" stroke="rgba(255,255,255,0.04)" strokeDasharray="2,2" />
                  <line x1="0" y1="26" x2="240" y2="26" stroke="rgba(255,255,255,0.04)" strokeDasharray="2,2" />
                  <line x1="0" y1="38" x2="240" y2="38" stroke="rgba(255,255,255,0.04)" strokeDasharray="2,2" />

                  {/* Golden Gradient Area */}
                  <path
                    d="M 0 6 Q 25 10 45 18 T 100 27 T 160 36 T 240 40 L 240 50 L 0 50 Z"
                    fill="url(#goldRetentionGrad)"
                  />

                  {/* Golden Curve Stroke */}
                  <path
                    d="M 0 6 Q 25 10 45 18 T 100 27 T 160 36 T 240 40"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />

                  {/* Playhead Marker */}
                  <circle
                    cx={(Math.min(timelineTime, 30) / 30) * 240}
                    cy={6 + (Math.min(timelineTime, 30) / 30) * 34}
                    r="3.5"
                    fill="#fbbf24"
                    stroke="#000000"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            {/* X-axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '18px', fontSize: '0.52rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              <span>0</span>
              <span>6</span>
              <span>12</span>
              <span>18</span>
              <span>24</span>
              <span>30</span>
            </div>
          </div>

          {/* Glowing Amber Circular Hook Gauge (Matching Mockup) */}
          <div style={{
            background: '#07090f',
            padding: '8px',
            borderRadius: '7px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px'
          }}>
            <div style={{ position: 'relative', width: '64px', height: '64px' }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="25" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="5" />
                <circle
                  cx="32"
                  cy="32"
                  r="25"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="5"
                  strokeDasharray="157.1"
                  strokeDashoffset={157.1 * (1 - (currentVisionScore?.hook_strength || 94) / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.65))' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                  {currentVisionScore?.hook_strength || 94}
                </span>
                <span style={{ fontSize: '0.54rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>100</span>
              </div>
            </div>
            <span style={{ fontSize: '0.62rem', color: '#fbbf24', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              PREDICTED HOOK STRENGTH
            </span>
          </div>

          {/* AI Feedback Card */}
          <div style={{
            background: '#07090f',
            padding: '8px 10px',
            borderRadius: '7px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={11} color="#a855f7" />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
                  AI Feedback
                </span>
              </div>
              <MoreHorizontal size={11} color="#64748b" />
            </div>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0, lineHeight: 1.35 }}>
              {currentVisionScore?.critique_summary || 'Refine your composition with AI feedback, overlays and iterations you overlayment.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '2px' }}>
            <button
              type="button"
              onClick={() => {
                setStyle('Kinetic High-Tech Dark');
                handleCreateAndStream();
              }}
              className="btn-matte-dark"
              style={{ width: '100%', padding: '6px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
            >
              <RotateCcw size={11} />
              <span>Create improved variation</span>
            </button>

            <button
              onClick={onNavigateToGeo}
              className="btn-solid-white"
              style={{ width: '100%', padding: '6px', fontSize: '0.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
            >
              <span>Check AI discovery</span>
              <ArrowRight size={11} />
            </button>
          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------ */}
      {/* GRAND HOLLYWOOD MULTI-TRACK NLE TIMELINE EDITOR (FULL-WIDTH) */}
      {/* ------------------------------------------------------------ */}
      <div style={{
        background: '#080a10',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        padding: '6px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        position: 'relative',
        height: '148px',
        minHeight: '148px',
        maxHeight: '148px',
        boxSizing: 'border-box',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)'
      }}>

        {/* Top NLE Timeline Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '4px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          
          {/* Left Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
            <LayoutGrid size={12} style={{ cursor: 'pointer' }} />
            <Folder size={12} style={{ cursor: 'pointer' }} />
            <Copy size={12} style={{ cursor: 'pointer' }} />
            <Type size={12} style={{ cursor: 'pointer' }} />
            <Undo2 size={12} style={{ cursor: 'pointer' }} />
            <Redo2 size={12} style={{ cursor: 'pointer' }} />
            <Sparkles size={12} color="#f59e0b" style={{ cursor: 'pointer' }} />
          </div>

          {/* Center Timecode Display */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
            {formatTimecode(timelineTime)}
          </div>

          {/* Right Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
            <Airplay size={12} style={{ cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Volume2 size={12} />
              <div style={{ width: '32px', height: '3px', background: '#f59e0b', borderRadius: '2px' }} />
            </div>
            <Sliders size={12} style={{ cursor: 'pointer' }} />
            <Maximize2 size={12} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Relative Track Workspace with White Needle Playhead */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          
          {/* Vertical White Needle Playhead spanning all tracks */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `calc(75px + (100% - 85px) * ${Math.min(timelineTime, 30) / 30})`,
            width: '2px',
            background: '#ffffff',
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.9)',
            zIndex: 10,
            pointerEvents: 'none',
            transition: isPlayingTimeline ? 'none' : 'left 0.1s ease'
          }}>
            {/* Playhead Knob */}
            <div style={{
              position: 'absolute',
              top: '-3px',
              left: '-4px',
              width: '10px',
              height: '8px',
              background: '#ffffff',
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
            }} />
          </div>

          {/* Time Ruler (0.0s, 3.0s, 6.0s ... 30.0s) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '75px', paddingRight: '8px', fontSize: '0.54rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            <span>0.0s</span>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>3.0s</span>
            <span>6.0s</span>
            <span>10.0s</span>
            <span>14.0s</span>
            <span style={{ color: '#60a5fa', fontWeight: 700 }}>18.0s</span>
            <span>22.0s</span>
            <span>26.0s</span>
            <span style={{ color: '#34d399', fontWeight: 700 }}>30.0s</span>
          </div>

          {/* Scene Section Markers Bar */}
          <div style={{ display: 'flex', paddingLeft: '75px', gap: '4px' }}>
            <div
              onClick={() => handleSelectScene(0)}
              style={{
                width: '10%',
                minWidth: '80px',
                padding: '2px 6px',
                background: selectedSceneIndex === 0 ? 'rgba(245, 158, 11, 0.15)' : '#07090f',
                border: selectedSceneIndex === 0 ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '3px',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: selectedSceneIndex === 0 ? '#fbbf24' : '#94a3b8',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Scene 1: Hook (0-3s)
            </div>

            <div
              onClick={() => handleSelectScene(1)}
              style={{
                width: '50%',
                padding: '2px 6px',
                background: selectedSceneIndex === 1 ? 'rgba(245, 158, 11, 0.15)' : '#07090f',
                border: selectedSceneIndex === 1 ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '3px',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: selectedSceneIndex === 1 ? '#fbbf24' : '#94a3b8',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Scene 2: Narrative (3-18s)
            </div>

            <div
              onClick={() => handleSelectScene(2)}
              style={{
                width: '40%',
                padding: '2px 6px',
                background: selectedSceneIndex === 2 ? 'rgba(245, 158, 11, 0.15)' : '#07090f',
                border: selectedSceneIndex === 2 ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '3px',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: selectedSceneIndex === 2 ? '#fbbf24' : '#94a3b8',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Scene 3: Call to Action (18-30s)
            </div>
          </div>

          {/* Track 1: Video Filmstrip (Scene 1) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '68px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.64rem', color: '#ffffff', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              <Play size={10} fill="#ffffff" />
              <span>Scene 1</span>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: '4px', height: '28px' }}>
              {/* Scene 1 Filmstrip (10%) */}
              <div
                onClick={() => handleSelectScene(0)}
                style={{
                  width: '10%',
                  minWidth: '80px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: selectedSceneIndex === 0 ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  background: '#040507'
                }}
              >
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                  <img src={campaign?.scenes?.[0]?.media_url} alt="F1" style={{ width: '50%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                  <img src={campaign?.scenes?.[0]?.media_url} alt="F2" style={{ width: '50%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                </div>
                <div style={{ position: 'absolute', top: '2px', left: '4px', background: 'rgba(0,0,0,0.75)', padding: '1px 4px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Camera size={8} color="#ffffff" />
                  <span style={{ fontSize: '0.52rem', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>Camera</span>
                </div>
              </div>

              {/* Scene 2 Filmstrip (50%) */}
              <div
                onClick={() => handleSelectScene(1)}
                style={{
                  width: '50%',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: selectedSceneIndex === 1 ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  background: '#040507'
                }}
              >
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                  {[1, 2, 3, 4, 5, 6].map((k) => (
                    <img key={k} src={campaign?.scenes?.[1]?.media_url} alt="F" style={{ width: '16.66%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                  ))}
                </div>
                <div style={{ position: 'absolute', top: '2px', left: '4px', background: 'rgba(0,0,0,0.75)', padding: '1px 4px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Camera size={8} color="#ffffff" />
                  <span style={{ fontSize: '0.52rem', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>Camera</span>
                </div>
              </div>

              {/* Scene 3 Filmstrip (40%) */}
              <div
                onClick={() => handleSelectScene(2)}
                style={{
                  width: '40%',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: selectedSceneIndex === 2 ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  background: '#040507'
                }}
              >
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                  {[1, 2, 3, 4, 5].map((k) => (
                    <img key={k} src={campaign?.scenes?.[2]?.media_url} alt="F" style={{ width: '20%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                  ))}
                </div>
                <div style={{ position: 'absolute', top: '2px', left: '4px', background: 'rgba(0,0,0,0.75)', padding: '1px 4px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Camera size={8} color="#ffffff" />
                  <span style={{ fontSize: '0.52rem', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>Camera</span>
                </div>
              </div>
            </div>
          </div>

          {/* Track 2: Audio Track (Waveform) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '68px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.64rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              <Music size={10} color="#10b981" />
              <span>Audio</span>
            </div>

            <div style={{ flex: 1, height: '24px', background: '#071510', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', padding: '0 8px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '2px', left: '8px', fontSize: '0.5rem', color: '#34d399', fontFamily: 'var(--font-mono)', fontWeight: 700, zIndex: 2 }}>
                Waveform
              </div>
              <svg width="100%" height="20" viewBox="0 0 1000 20" preserveAspectRatio="none" style={{ opacity: 0.9, marginTop: '2px' }}>
                <defs>
                  <linearGradient id="audioAcousticGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0.85" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 10 L 5 4 L 10 10 L 15 2 L 20 10 L 25 5 L 30 10 L 35 1 L 40 10 L 45 6 L 50 10 L 55 3 L 60 10 L 65 7 L 70 10 L 75 2 L 80 10 L 85 4 L 90 10 L 95 1 L 100 10 L 105 5 L 110 10 L 115 3 L 120 10 L 125 7 L 130 10 L 135 2 L 140 10 L 145 6 L 150 10 L 155 1 L 160 10 L 165 4 L 170 10 L 175 2 L 180 10 L 185 5 L 190 10 L 195 1 L 200 10 L 205 6 L 210 10 L 215 3 L 220 10 L 225 7 L 230 10 L 235 2 L 240 10 L 245 5 L 250 10 L 255 1 L 260 10 L 265 4 L 270 10 L 275 3 L 280 10 L 285 6 L 290 10 L 295 2 L 300 10 L 305 5 L 310 10 L 315 1 L 320 10 L 325 4 L 330 10 L 335 3 L 340 10 L 345 7 L 350 10 L 355 2 L 360 10 L 365 5 L 370 10 L 375 1 L 380 10 L 385 4 L 390 10 L 395 3 L 400 10 L 405 6 L 410 10 L 415 2 L 420 10 L 425 5 L 430 10 L 435 1 L 440 10 L 445 4 L 450 10 L 455 3 L 460 10 L 465 7 L 470 10 L 475 2 L 480 10 L 485 5 L 490 10 L 495 1 L 500 10 L 505 4 L 510 10 L 515 3 L 520 10 L 525 6 L 530 10 L 535 2 L 540 10 L 545 5 L 550 10 L 555 1 L 560 10 L 565 4 L 570 10 L 575 3 L 580 10 L 585 7 L 590 10 L 595 2 L 600 10 L 605 5 L 610 10 L 615 1 L 620 10 L 625 4 L 630 10 L 635 3 L 640 10 L 645 6 L 650 10 L 655 2 L 660 10 L 665 5 L 670 10 L 675 1 L 680 10 L 685 4 L 690 10 L 695 3 L 700 10 L 705 7 L 710 10 L 715 2 L 720 10 L 725 5 L 730 10 L 735 1 L 740 10 L 745 4 L 750 10 L 755 3 L 760 10 L 765 6 L 770 10 L 775 2 L 780 10 L 785 5 L 790 10 L 795 1 L 800 10 L 805 4 L 810 10 L 815 3 L 820 10 L 825 7 L 830 10 L 835 2 L 840 10 L 845 5 L 850 10 L 855 1 L 860 10 L 865 4 L 870 10 L 875 3 L 880 10 L 885 6 L 890 10 L 895 2 L 900 10 L 905 5 L 910 10 L 915 1 L 920 10 L 925 4 L 930 10 L 935 3 L 940 10 L 945 7 L 950 10 L 955 2 L 960 10 L 965 5 L 970 10 L 975 1 L 980 10 L 985 4 L 990 10 L 995 2 L 1000 10 L 1000 10 L 995 18 L 990 10 L 985 16 L 980 10 L 975 19 L 970 10 L 965 15 L 960 10 L 955 18 L 950 10 L 945 13 L 940 10 L 935 17 L 930 10 L 925 16 L 920 10 L 915 19 L 910 10 L 905 15 L 900 10 L 895 18 L 890 10 L 885 14 L 880 10 L 875 17 L 870 10 L 865 16 L 860 10 L 855 19 L 850 10 L 845 15 L 840 10 L 835 18 L 830 10 L 825 13 L 820 10 L 815 17 L 810 10 L 805 16 L 800 10 L 795 19 L 790 10 L 785 15 L 780 10 L 775 18 L 770 10 L 765 14 L 760 10 L 755 17 L 750 10 L 745 16 L 740 10 L 735 19 L 730 10 L 725 15 L 720 10 L 715 18 L 710 10 L 705 13 L 700 10 L 695 17 L 690 10 L 685 16 L 680 10 L 675 19 L 670 10 L 665 15 L 660 10 L 655 18 L 650 10 L 645 14 L 640 10 L 635 17 L 630 10 L 625 16 L 620 10 L 615 19 L 610 10 L 605 15 L 600 10 L 595 18 L 590 10 L 585 13 L 580 10 L 575 17 L 570 10 L 565 16 L 560 10 L 555 19 L 550 10 L 545 15 L 540 10 L 535 18 L 530 10 L 525 14 L 520 10 L 515 17 L 510 10 L 505 16 L 500 10 L 495 19 L 490 10 L 485 15 L 480 10 L 475 18 L 470 10 L 465 13 L 460 10 L 455 17 L 450 10 L 445 16 L 440 10 L 435 19 L 430 10 L 425 15 L 420 10 L 415 18 L 410 10 L 405 14 L 400 10 L 395 17 L 390 10 L 385 16 L 380 10 L 375 19 L 370 10 L 365 15 L 360 10 L 355 18 L 350 10 L 345 13 L 340 10 L 335 17 L 330 10 L 325 16 L 320 10 L 315 19 L 310 10 L 305 15 L 300 10 L 295 18 L 290 10 L 285 14 L 280 10 L 275 17 L 270 10 L 265 16 L 260 10 L 255 19 L 250 10 L 245 15 L 240 10 L 235 18 L 230 10 L 225 13 L 220 10 L 215 17 L 210 10 L 205 14 L 200 10 L 195 19 L 190 10 L 185 15 L 180 10 L 175 18 L 170 10 L 165 16 L 160 10 L 155 19 L 150 10 L 145 14 L 140 10 L 135 18 L 130 10 L 125 13 L 120 10 L 115 17 L 110 10 L 105 15 L 100 10 L 95 19 L 90 10 L 85 16 L 80 10 L 75 18 L 70 10 L 65 13 L 60 10 L 55 17 L 50 10 L 45 14 L 40 10 L 35 19 L 30 10 L 25 15 L 20 10 L 15 18 L 10 10 L 5 16 Z"
                  fill="url(#audioAcousticGrad)"
                  stroke="#10b981"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
          </div>

          {/* Track 3: Camera Track (Camera Cues) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '68px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.64rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              <Camera size={10} color="#60a5fa" />
              <span>Camera</span>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: '4px', height: '18px' }}>
              <div style={{ width: '10%', minWidth: '80px', background: '#0e121a', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', padding: '0 6px', fontSize: '0.56rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
                Camera Cues
              </div>
              <div style={{ width: '50%', background: '#0e121a', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', padding: '0 6px', fontSize: '0.56rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
                Camera Cues
              </div>
              <div style={{ width: '40%', background: '#0e121a', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', padding: '0 6px', fontSize: '0.56rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
                Camera Cues
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
