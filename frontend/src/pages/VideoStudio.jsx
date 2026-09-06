import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, RefreshCw, CheckCircle2, Clock, Film, Video, RotateCcw,
  Play, Pause, Volume2, VolumeX, Shield, Activity, Crosshair,
  SkipBack, SkipForward, Sliders, Music, Camera, Zap, Terminal,
  LayoutGrid, Folder, Copy, Type, Undo2, Redo2, Maximize2, Airplay, Repeat, MoreHorizontal, X, ArrowRight,
  Scissors, Link, Search
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
  const [targetAudience, setTargetAudience] = useState(initialPreset?.target_audience || 'Gen Z/Alpha');
  const [aspectRatio, setAspectRatio] = useState(initialPreset?.aspect_ratio || '9:16');
  const [style, setStyle] = useState(initialPreset?.style || 'Cinematic Neon-Noir');

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
        camera_cues: 'Zoom In / Tracking (0.4s crash zoom into cockpit HUD)',
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
        critique_summary: 'Strong visual hook; excellent pacing; dynamic audio sync.',
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
        critique_summary: 'Speed sensation is strong. Procedural track variation reinforces the roguelite pitch.',
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
        critique_summary: 'Direct Steam CTA with tangible release date drives highest conversion intent.',
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
  const [renderStatus, setRenderStatus] = useState({
    status: 'completed',
    video_url: '/media/videos/camp_neon_circuit_01.mp4'
  });
  const [activeTab, setActiveTab] = useState('video_player'); // 'video_player' | 'blueprint'

  // Presets
  const presets = [
    {
      name: 'Neon Circuit',
      category: 'Indie Game',
      pitch: 'A neon-noir racing roguelite where every failed run rewrites the city and reveals a new piece of the conspiracy.',
      goal: 'Drive wishlists before launch',
      audience: 'Gen Z/Alpha',
      style: 'Cinematic Neon-Noir'
    },
    {
      name: 'LaunchFlow',
      category: 'B2B SaaS',
      pitch: 'Autonomous customer onboarding & interactive walkthrough agent that triples free-to-paid conversion for SaaS founders.',
      goal: 'Convert free trial users to paid',
      audience: 'SaaS Founders',
      style: 'Kinetic High-Tech Dark'
    },
    {
      name: 'VectorLite',
      category: 'DevTool',
      pitch: 'Zero-latency embedded vector database designed specifically for edge AI agents and local RAG pipelines.',
      goal: 'Drive GitHub stars and developer adoption',
      audience: 'AI Engineers',
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
  };

  // Check if campaign already has rendered video on backend
  useEffect(() => {
    const targetId = campaign?.campaign_id || 'camp_neon_circuit_01';
    fetch(`/api/campaigns/${targetId}/render-status`)
      .then(r => r.ok ? r.json() : null)
      .then(st => {
        if (st && st.status === 'completed') {
          setRenderStatus(st);
          setStudioState('render_completed');
          if (onStatusChange) onStatusChange('Discovery Ready');
        }
      })
      .catch(() => {});
  }, [campaign?.campaign_id, onStatusChange]);

  // Timeline & Playback Synchronization
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [timelineTime, setTimelineTime] = useState(1.4);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [showSafeGuides, setShowSafeGuides] = useState(true);

  const timelineIntervalRef = useRef(null);
  const videoPlayerRef = useRef(null);

  // Timecode Formatter Helper: MM:SS:FF
  const formatTimecode = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 60);
    return `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  // Real, instant play/pause toggle with zero delay
  const toggleTimelinePlayback = () => {
    if (isPlayingTimeline) {
      if (timelineIntervalRef.current) {
        clearInterval(timelineIntervalRef.current);
        timelineIntervalRef.current = null;
      }
      setIsPlayingTimeline(false);
      if (videoPlayerRef.current && !videoPlayerRef.current.paused) {
        videoPlayerRef.current.pause();
      }
    } else {
      setIsPlayingTimeline(true);
      if (videoPlayerRef.current) {
        videoPlayerRef.current.play().catch(() => {});
      }
    }
  };

  // NLE Transport Timeline Scrubber Loop
  useEffect(() => {
    if (isPlayingTimeline) {
      timelineIntervalRef.current = setInterval(() => {
        setTimelineTime((prev) => {
          if (prev >= 30.0) {
            setIsPlayingTimeline(false);
            if (videoPlayerRef.current) videoPlayerRef.current.pause();
            return 0;
          }
          return parseFloat((prev + 0.1).toFixed(1));
        });
      }, 100);
    } else {
      if (timelineIntervalRef.current) {
        clearInterval(timelineIntervalRef.current);
        timelineIntervalRef.current = null;
      }
    }
    return () => {
      if (timelineIntervalRef.current) {
        clearInterval(timelineIntervalRef.current);
        timelineIntervalRef.current = null;
      }
    };
  }, [isPlayingTimeline]);

  // Synchronize scene selection with timeline timecode
  useEffect(() => {
    if (timelineTime < 3.0) {
      if (selectedSceneIndex !== 0) setSelectedSceneIndex(0);
    } else if (timelineTime < 18.0) {
      if (selectedSceneIndex !== 1) setSelectedSceneIndex(1);
    } else {
      if (selectedSceneIndex !== 2) setSelectedSceneIndex(2);
    }
  }, [timelineTime, selectedSceneIndex]);

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
    if (idx === 0) setTimelineTime(1.0);
    else if (idx === 1) setTimelineTime(8.0);
    else if (idx === 2) setTimelineTime(22.0);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = idx === 0 ? 1.0 : idx === 1 ? 8.0 : 22.0;
    }
  };

  const currentScene = campaign?.scenes?.[selectedSceneIndex] || defaultNeonCampaign.scenes[0];
  const currentVisionScore = campaign?.vision_qa?.[selectedSceneIndex] || defaultNeonCampaign.vision_qa[0];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      background: '#07090e',
      color: '#e2e8f0',
      boxSizing: 'border-box',
      padding: '8px 12px 6px',
      gap: '8px',
      overflow: 'hidden'
    }}>

      {/* ------------------------------------------------------------ */}
      {/* UPPER CANVAS: THREE COLUMNS (BRIEF, MASTER CINEMA STAGE, VISION CRITIC) */}
      {/* ------------------------------------------------------------ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '270px 1fr 310px',
        gap: '10px',
        flex: 1,
        minHeight: 0
      }}>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 1: CAMPAIGN BRIEF & LIVE SYNTHESIS STATUS */}
        {/* ------------------------------------------------------------ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', minHeight: 0 }}>
          
          {/* Card 1A: Campaign Brief (Matching Master UI) */}
          <div style={{
            background: '#0c0f16',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '0.86rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  Campaign Brief
                </h3>
                <span style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  CAMPAIGN BRIEF v3.1
                </span>
              </div>
              <MoreHorizontal size={13} color="#64748b" style={{ cursor: 'pointer' }} />
            </div>

            {/* Inputs Group */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>
                <label style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>
                  Project Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#07090f',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '5px',
                    padding: '6px 8px',
                    fontSize: '0.74rem',
                    color: '#ffffff',
                    fontFamily: 'var(--font-sans)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>
                  Studio
                </label>
                <input
                  type="text"
                  value={category === 'Indie Game' ? 'Ashky' : category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#07090f',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '5px',
                    padding: '6px 8px',
                    fontSize: '0.74rem',
                    color: '#cbd5e1',
                    fontFamily: 'var(--font-sans)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#07090f',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '5px',
                    padding: '6px 8px',
                    fontSize: '0.74rem',
                    color: '#ffffff',
                    fontFamily: 'var(--font-sans)',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Gen Z/Alpha">Gen Z/Alpha</option>
                  <option value="Roguelite and cyberpunk fans">Roguelite & Cyberpunk Fans</option>
                  <option value="Steam Deck Early Adopters">Steam Deck Early Adopters</option>
                  <option value="SaaS Founders">SaaS Founders</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>
                  Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#07090f',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '5px',
                    padding: '6px 8px',
                    fontSize: '0.74rem',
                    color: '#ffffff',
                    fontFamily: 'var(--font-sans)',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Cinematic Neon-Noir">Cinematic Neon-Noir</option>
                  <option value="Kinetic High-Tech Dark">Kinetic High-Tech Dark</option>
                  <option value="Cyberpunk Matrix Minimal">Cyberpunk Matrix Minimal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 1B: Live Synthesis Status (Exact Match with Amber Glow Border) */}
          <div style={{
            background: '#110e08',
            border: '1.5px solid #f59e0b',
            boxShadow: '0 0 16px rgba(245, 158, 11, 0.15)',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  boxShadow: '0 0 8px #f59e0b',
                  display: 'inline-block'
                }} />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                  Live Synthesis Status
                </span>
              </div>
              <MoreHorizontal size={12} color="#92400e" style={{ cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Processing Scene: <strong style={{ color: '#ffffff' }}>Night Run (78%)</strong>
              </span>
              <span style={{
                fontSize: '0.58rem',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '1px 6px',
                borderRadius: '3px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)'
              }}>
                ACTIVE
              </span>
            </div>

            {/* 16-Dot Pacing Indicator (12 active glowing amber, 4 dimmed) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              {[...Array(16)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: i < 12 ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)',
                    boxShadow: i < 12 ? '0 0 6px #f59e0b' : 'none'
                  }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 2: MASTER CINEMA STAGE (EXACT MATCH TO REFERENCE UI) */}
        {/* ------------------------------------------------------------ */}
        <div style={{
          background: '#090c12',
          border: '1.5px solid #f59e0b',
          boxShadow: '0 0 24px rgba(245, 158, 11, 0.14)',
          borderRadius: '10px',
          padding: '10px 14px 8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          boxSizing: 'border-box'
        }}>
          
          {/* Header Row: "Master Cinema Stage" */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '0.94rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '0.02em' }}>
              Master Cinema Stage
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="tag-minimal tag-slate" style={{ fontSize: '0.62rem' }}>
                9:16 VERTICAL CINEMA
              </span>
              <MoreHorizontal size={13} color="#64748b" style={{ cursor: 'pointer' }} />
            </div>
          </div>

          {/* Central Dual-Dock Display: Phone Monitor Left + Director Notes HUD Right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            flex: 1,
            minHeight: 0
          }}>
            
            {/* Phone Monitor: Realistic Curved iPhone 15 Pro Bezel with Dynamic Island */}
            <div style={{
              width: '240px',
              height: '425px',
              borderRadius: '32px',
              background: '#000000',
              border: '3px solid #283042',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              
              {/* Dynamic Island Notch */}
              <div style={{
                position: 'absolute',
                top: '7px',
                width: '60px',
                height: '14px',
                background: '#000000',
                borderRadius: '10px',
                zIndex: 20,
                boxShadow: '0 0 4px rgba(0,0,0,0.8)'
              }} />

              {/* Video / Keyframe Media Content */}
              {renderStatus?.video_url ? (
                <video
                  ref={videoPlayerRef}
                  playsInline
                  poster={currentScene.media_url}
                  src={renderStatus.video_url}
                  onTimeUpdate={(e) => {
                    if (isPlayingTimeline) {
                      setTimelineTime(parseFloat(e.target.currentTime.toFixed(1)));
                    }
                  }}
                  onEnded={() => setIsPlayingTimeline(false)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={currentScene.media_url}
                  alt={currentScene.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

              {/* Safe HUD overlay */}
              {showSafeGuides && (
                <div style={{
                  position: 'absolute',
                  inset: '24px 10px 10px',
                  border: '1px dashed rgba(56, 189, 248, 0.45)',
                  borderRadius: '6px',
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '3px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.48rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    <span>+ 9:16</span>
                    <span>+</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.48rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    <span>+</span>
                    <span>+</span>
                  </div>
                </div>
              )}

              {/* Kinetic Text Overlay Box */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '8px',
                right: '8px',
                background: 'rgba(9, 11, 16, 0.92)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                padding: '4px 6px',
                textAlign: 'center',
                zIndex: 10
              }}>
                <span style={{ fontSize: '0.52rem', color: '#60a5fa', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  {currentScene.hook_type}
                </span>
                <p style={{ fontSize: '0.64rem', fontWeight: 700, color: '#ffffff', margin: '1px 0 0', lineHeight: 1.2 }}>
                  "{currentScene.text_overlay}"
                </p>
              </div>

            </div>

            {/* Right Side: Director Notes HUD Card (Matching Master UI) */}
            <div style={{
              width: '280px',
              background: '#0d1017',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    Director Notes HUD
                  </h4>
                  <span style={{ fontSize: '0.58rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    NOTES & DATA
                  </span>
                </div>
                <Sliders size={13} color="#f59e0b" style={{ cursor: 'pointer' }} />
              </div>

              {/* Script Section */}
              <div>
                <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, display: 'block', fontFamily: 'var(--font-mono)' }}>
                  Script
                </span>
                <p style={{ fontSize: '0.76rem', color: '#e2e8f0', margin: '1px 0 0', fontWeight: 600 }}>
                  Scene {currentScene.scene_number}: {currentScene.title}
                </p>
              </div>

              {/* Waveform Audio Preview with Mini Golden Bars */}
              <div style={{ background: '#080a0f', padding: '6px 8px', borderRadius: '5px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.58rem', color: '#f59e0b', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    Waveform Audio Preview
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleVoiceAudio(currentScene.voiceover_script)}
                    style={{
                      background: isPlayingAudio ? 'rgba(245, 158, 11, 0.3)' : '#161d28',
                      border: '1px solid #f59e0b',
                      borderRadius: '3px',
                      color: '#fbbf24',
                      fontSize: '0.56rem',
                      padding: '1px 5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Volume2 size={9} />
                    <span>{isPlayingAudio ? 'Stop' : 'Listen Voice'}</span>
                  </button>
                </div>
                
                {/* Acoustic Golden Waveform Bars */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '18px', padding: '0 2px' }}>
                  {[4, 8, 14, 18, 10, 16, 12, 6, 14, 18, 15, 8, 12, 16, 9, 5, 14, 17, 10, 6, 13, 8, 4].map((h, idx) => (
                    <span
                      key={idx}
                      style={{
                        width: '2px',
                        height: isPlayingAudio ? `${Math.max(4, (h * 1.2) % 18)}px` : `${h}px`,
                        background: '#f59e0b',
                        borderRadius: '1px',
                        opacity: 0.9,
                        transition: 'height 0.1s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Camera Cues Section */}
              <div>
                <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, display: 'block', fontFamily: 'var(--font-mono)' }}>
                  Camera Cues
                </span>
                <p style={{ fontSize: '0.72rem', color: '#38bdf8', margin: '1px 0 0', fontWeight: 500 }}>
                  {currentScene.camera_cues}
                </p>
              </div>

              {/* Telemetry Section */}
              <div>
                <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, display: 'block', fontFamily: 'var(--font-mono)' }}>
                  Telemetry
                </span>
                <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: '1px 0 0', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  Frame: {Math.floor(timelineTime * 60)} | Time: {formatTimecode(timelineTime)}
                </p>
              </div>
            </div>

          </div>

          {/* Bottom of Master Cinema Stage: Amber Transport Bar Controls (Matching Master UI) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            {/* Amber Slider */}
            <input
              type="range"
              min="0"
              max="30"
              step="0.1"
              value={timelineTime}
              onChange={(e) => {
                const t = parseFloat(e.target.value);
                setTimelineTime(t);
                if (videoPlayerRef.current) {
                  videoPlayerRef.current.currentTime = t;
                }
              }}
              className="timeline-slider-amber"
              title={`Seek to ${timelineTime.toFixed(1)}s`}
            />

            {/* Transport Bar Row: Left Timecode | Center Controls | Right Timecode */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', fontWeight: 600 }}>
                {formatTimecode(timelineTime)}
              </span>

              {/* Center Controls: SkipBack, Amber Play/Stop, SkipForward */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleSelectScene(Math.max(0, selectedSceneIndex - 1))}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                  title="Previous Scene"
                >
                  <SkipBack size={14} />
                </button>

                {/* Glowing Amber Play/Stop Button */}
                <button
                  type="button"
                  onClick={toggleTimelinePlayback}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    boxShadow: '0 0 14px rgba(245, 158, 11, 0.7)',
                    border: 'none',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease'
                  }}
                  title={isPlayingTimeline ? 'Stop / Pause Playback' : 'Start Playback'}
                >
                  {isPlayingTimeline ? <Pause size={13} fill="#000000" /> : <Play size={13} fill="#000000" style={{ marginLeft: '1px' }} />}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectScene(Math.min(2, selectedSceneIndex + 1))}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                  title="Next Scene"
                >
                  <SkipForward size={14} />
                </button>
              </div>

              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', fontWeight: 600 }}>
                00:00:30:00
              </span>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 3: GEMINI VISION CRITIC (EXACT MATCH TO REFERENCE UI) */}
        {/* ------------------------------------------------------------ */}
        <div style={{
          background: '#0c0f16',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '8px',
          height: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '0.86rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                Gemini Vision Critic
              </h3>
              <span style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                GEMINI CRITIC v2.4
              </span>
            </div>
            <MoreHorizontal size={13} color="#64748b" style={{ cursor: 'pointer' }} />
          </div>

          {/* Top 2 Sub-Cards: Retention Curve Left + Hook Strength Gauge Right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {/* Retention Curve Card */}
            <div style={{
              background: '#07090f',
              padding: '8px',
              borderRadius: '7px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.64rem', color: '#ffffff', fontWeight: 700, display: 'block' }}>
                  Retention Curve
                </span>
                <span style={{ fontSize: '0.54rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  Viewership: High 96%
                </span>
              </div>

              {/* Downward Sloping Golden Curve SVG */}
              <div style={{ height: '40px', width: '100%', margin: '4px 0' }}>
                <svg width="100%" height="40" viewBox="0 0 120 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="goldCurveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0 6 Q 20 8 40 18 T 80 26 T 120 30 L 120 40 L 0 40 Z" fill="url(#goldCurveGrad)" />
                  <path d="M 0 6 Q 20 8 40 18 T 80 26 T 120 30" fill="none" stroke="#f59e0b" strokeWidth="2" />
                </svg>
              </div>

              <span style={{ fontSize: '0.54rem', color: '#f59e0b', fontWeight: 700, textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                VIEWERSHIP
              </span>
            </div>

            {/* Hook Strength Gauge Card */}
            <div style={{
              background: '#07090f',
              padding: '8px',
              borderRadius: '7px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.64rem', color: '#ffffff', fontWeight: 700 }}>
                Hook Strength
              </span>

              {/* Circular Gauge */}
              <div style={{ position: 'relative', width: '50px', height: '50px', margin: '2px 0' }}>
                <svg width="50" height="50" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="25" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="5" />
                  <circle
                    cx="32"
                    cy="32"
                    r="25"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="5"
                    strokeDasharray="157.1"
                    strokeDashoffset={157.1 * (1 - 94 / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.7))' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                    94
                  </span>
                  <span style={{ fontSize: '0.46rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>100</span>
                </div>
              </div>

              <span style={{ fontSize: '0.54rem', color: '#f59e0b', fontWeight: 700, textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                ENGAGEMENT
              </span>
            </div>
          </div>

          {/* Quality Breakdown: 5 Bars (Visuals, Audio, Pacing, Narrative, Style) */}
          <div style={{
            background: '#07090f',
            padding: '8px 10px',
            borderRadius: '7px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
          }}>
            <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Quality Breakdown
            </span>

            {[
              { label: 'Visuals', pct: 95, color: '#2dd4bf' },
              { label: 'Audio', pct: 88, color: '#38bdf8' },
              { label: 'Pacing', pct: 96, color: '#34d399' },
              { label: 'Narrative', pct: 80, color: '#fbbf24' },
              { label: 'Style', pct: 86, color: '#f59e0b' }
            ].map((bar) => (
              <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.6rem' }}>
                <span style={{ width: '45px', color: '#94a3b8' }}>{bar.label}</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${bar.pct}%`, height: '100%', background: bar.color, borderRadius: '2px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Critique Card */}
          <div style={{
            background: '#07090f',
            padding: '7px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.66rem',
            color: '#94a3b8',
            lineHeight: 1.3
          }}>
            <strong style={{ color: '#e2e8f0' }}>CRITIQUE:</strong> Strong visual hook; excellent pacing; dynamic audio sync.
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <button
              type="button"
              onClick={() => handleSelectScene(selectedSceneIndex)}
              className="btn-matte-dark"
              style={{ width: '100%', padding: '6px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
            >
              <RotateCcw size={11} />
              <span>Create improved variation</span>
            </button>

            {onNavigateToGeo && (
              <button
                type="button"
                onClick={onNavigateToGeo}
                className="btn-solid-white"
                style={{ width: '100%', padding: '6px', fontSize: '0.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
              >
                <span>Check AI discovery</span>
                <ArrowRight size={11} />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------ */}
      {/* LOWER SECTION: MASTER NLE TIMELINE (EXACT MATCH TO REFERENCE UI) */}
      {/* ------------------------------------------------------------ */}
      <div style={{
        background: '#080a10',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        padding: '6px 12px 8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '164px',
        minHeight: '164px',
        maxHeight: '164px',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        
        {/* Timeline Header Row: Sequence title, Tool icons, Center Transport Controls, Cyan Timecode Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '4px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          {/* Left Sequence Title & Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              TIMELINE: SEQUENCE 14 ⌵
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
              <Scissors size={12} style={{ cursor: 'pointer' }} />
              <Link size={12} style={{ cursor: 'pointer' }} />
              <Search size={12} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          {/* Center Transport Buttons with Glowing Cyan Timecode Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
              <SkipBack size={12} style={{ cursor: 'pointer' }} onClick={() => handleSelectScene(Math.max(0, selectedSceneIndex - 1))} />
              <Play size={12} style={{ cursor: 'pointer' }} onClick={toggleTimelinePlayback} />
              <SkipForward size={12} style={{ cursor: 'pointer' }} onClick={() => handleSelectScene(Math.min(2, selectedSceneIndex + 1))} />
            </div>

            {/* Glowing Cyan Timecode Badge */}
            <div style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38bdf8',
              boxShadow: '0 0 8px rgba(56, 189, 248, 0.4)',
              borderRadius: '4px',
              padding: '2px 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#38bdf8'
            }}>
              {formatTimecode(timelineTime)}
            </div>
          </div>

          {/* Right Tools: Zoom Slider, Fullscreen */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
            <Sliders size={12} style={{ cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '0.64rem' }}>-</span>
              <div style={{ width: '36px', height: '2px', background: '#38bdf8', borderRadius: '1px' }} />
              <span style={{ fontSize: '0.64rem' }}>+</span>
            </div>
            <Maximize2 size={12} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Tracks Area with Relative Container & Cyan Needle */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, justifyContent: 'space-between' }}>
          
          {/* Vertical Cyan Playhead Needle */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `calc(130px + (100% - 140px) * ${Math.min(timelineTime, 30) / 30})`,
            width: '2px',
            background: '#38bdf8',
            boxShadow: '0 0 8px #38bdf8',
            zIndex: 15,
            pointerEvents: 'none'
          }}>
            <div style={{
              position: 'absolute',
              top: '-2px',
              left: '-4px',
              width: '10px',
              height: '8px',
              background: '#38bdf8',
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
            }} />
          </div>

          {/* Time Ruler (01:00, 01:15, 01:22:15, 01:30, 01:45) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '130px', paddingRight: '12px', fontSize: '0.52rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            <span>01:00</span>
            <span>01:15</span>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>01:22:15</span>
            <span>01:30</span>
            <span>01:45</span>
            <span>01:40</span>
          </div>

          {/* Track 1: Video Track (Filmstrip Thumbnails) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '122px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                Video Track
              </span>
              <span style={{ fontSize: '0.5rem', color: '#64748b' }}>Filmstrip Thumbnails</span>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: '4px', height: '28px' }}>
              {/* Scene 1 (flex: 3) */}
              <div
                onClick={() => handleSelectScene(0)}
                style={{
                  flex: 3,
                  minWidth: 0,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: selectedSceneIndex === 0 ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  background: '#040507'
                }}
              >
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                  <img src={campaign.scenes[0].media_url} alt="f" style={{ width: '50%', height: '100%', objectFit: 'cover' }} />
                  <img src={campaign.scenes[0].media_url} alt="f" style={{ width: '50%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'absolute', top: '2px', left: '4px', background: 'rgba(0,0,0,0.7)', padding: '1px 3px', borderRadius: '2px', fontSize: '0.48rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  Racing sequence
                </div>
              </div>

              {/* Scene 2 (flex: 15) */}
              <div
                onClick={() => handleSelectScene(1)}
                style={{
                  flex: 15,
                  minWidth: 0,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: selectedSceneIndex === 1 ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  background: '#040507'
                }}
              >
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                  {[1, 2, 3, 4, 5, 6].map((k) => (
                    <img key={k} src={campaign.scenes[1].media_url} alt="f" style={{ width: '16.66%', height: '100%', objectFit: 'cover' }} />
                  ))}
                </div>
              </div>

              {/* Scene 3 (flex: 12) */}
              <div
                onClick={() => handleSelectScene(2)}
                style={{
                  flex: 12,
                  minWidth: 0,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: selectedSceneIndex === 2 ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  background: '#040507'
                }}
              >
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                  {[1, 2, 3, 4, 5].map((k) => (
                    <img key={k} src={campaign.scenes[2].media_url} alt="f" style={{ width: '20%', height: '100%', objectFit: 'cover' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Track 2: Audio Track (Green Acoustic Waveform) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '122px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Music size={10} color="#34d399" /> Audio Track
              </span>
              <span style={{ fontSize: '0.5rem', color: '#64748b' }}>Green Acoustic Waveform</span>
            </div>

            <div style={{ flex: 1, height: '24px', background: '#05140d', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.35)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
              <span style={{ position: 'absolute', top: '2px', left: '8px', fontSize: '0.5rem', color: '#34d399', fontFamily: 'var(--font-mono)', zIndex: 2 }}>
                Racing SFX
              </span>
              <svg width="100%" height="20" viewBox="0 0 1000 20" preserveAspectRatio="none" style={{ opacity: 0.95 }}>
                <defs>
                  <linearGradient id="waveformNeonGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 10 L 5 4 L 10 10 L 15 2 L 20 10 L 25 5 L 30 10 L 35 1 L 40 10 L 45 6 L 50 10 L 55 3 L 60 10 L 65 7 L 70 10 L 75 2 L 80 10 L 85 4 L 90 10 L 95 1 L 100 10 L 105 5 L 110 10 L 115 3 L 120 10 L 125 7 L 130 10 L 135 2 L 140 10 L 145 6 L 150 10 L 155 1 L 160 10 L 165 4 L 170 10 L 175 2 L 180 10 L 185 5 L 190 10 L 195 1 L 200 10 L 205 6 L 210 10 L 215 3 L 220 10 L 225 7 L 230 10 L 235 2 L 240 10 L 245 5 L 250 10 L 255 1 L 260 10 L 265 4 L 270 10 L 275 3 L 280 10 L 285 6 L 290 10 L 295 2 L 300 10 L 305 5 L 310 10 L 315 1 L 320 10 L 325 4 L 330 10 L 335 3 L 340 10 L 345 7 L 350 10 L 355 2 L 360 10 L 365 5 L 370 10 L 375 1 L 380 10 L 385 4 L 390 10 L 395 3 L 400 10 L 405 6 L 410 10 L 415 2 L 420 10 L 425 5 L 430 10 L 435 1 L 440 10 L 445 4 L 450 10 L 455 3 L 460 10 L 465 7 L 470 10 L 475 2 L 480 10 L 485 5 L 490 10 L 495 1 L 500 10 L 505 4 L 510 10 L 515 3 L 520 10 L 525 6 L 530 10 L 535 2 L 540 10 L 545 5 L 550 10 L 555 1 L 560 10 L 565 4 L 570 10 L 575 3 L 580 10 L 585 7 L 590 10 L 595 2 L 600 10 L 605 5 L 610 10 L 615 1 L 620 10 L 625 4 L 630 10 L 635 3 L 640 10 L 645 6 L 650 10 L 655 2 L 660 10 L 665 5 L 670 10 L 675 1 L 680 10 L 685 4 L 690 10 L 695 3 L 700 10 L 705 7 L 710 10 L 715 2 L 720 10 L 725 5 L 730 10 L 735 1 L 740 10 L 745 4 L 750 10 L 755 3 L 760 10 L 765 6 L 770 10 L 775 2 L 780 10 L 785 5 L 790 10 L 795 1 L 800 10 L 805 4 L 810 10 L 815 3 L 820 10 L 825 7 L 830 10 L 835 2 L 840 10 L 845 5 L 850 10 L 855 1 L 860 10 L 865 4 L 870 10 L 875 3 L 880 10 L 885 6 L 890 10 L 895 2 L 900 10 L 905 5 L 910 10 L 915 1 L 920 10 L 925 4 L 930 10 L 935 3 L 940 10 L 945 7 L 950 10 L 955 2 L 960 10 L 965 5 L 970 10 L 975 1 L 980 10 L 985 4 L 990 10 L 995 2 L 1000 10 L 1000 10 L 995 18 L 990 10 L 985 16 L 980 10 L 975 19 L 970 10 L 965 15 L 960 10 L 955 18 L 950 10 L 945 13 L 940 10 L 935 17 L 930 10 L 925 16 L 920 10 L 915 19 L 910 10 L 905 15 L 900 10 L 895 18 L 890 10 L 885 14 L 880 10 L 875 17 L 870 10 L 865 16 L 860 10 L 855 19 L 850 10 L 845 15 L 840 10 L 835 18 L 830 10 L 825 13 L 820 10 L 815 17 L 810 10 L 805 16 L 800 10 L 795 19 L 790 10 L 785 15 L 780 10 L 775 18 L 770 10 L 765 14 L 760 10 L 755 17 L 750 10 L 745 16 L 740 10 L 735 19 L 730 10 L 725 15 L 720 10 L 715 18 L 710 10 L 705 13 L 700 10 L 695 17 L 690 10 L 685 16 L 680 10 L 675 19 L 670 10 L 665 15 L 660 10 L 655 18 L 650 10 L 645 14 L 640 10 L 635 17 L 630 10 L 625 16 L 620 10 L 615 19 L 610 10 L 605 15 L 600 10 L 595 18 L 590 10 L 585 13 L 580 10 L 575 17 L 570 10 L 565 16 L 560 10 L 555 19 L 550 10 L 545 15 L 540 10 L 535 18 L 530 10 L 525 14 L 520 10 L 515 17 L 510 10 L 505 16 L 500 10 L 495 19 L 490 10 L 485 15 L 480 10 L 475 18 L 470 10 L 465 13 L 460 10 L 455 17 L 450 10 L 445 16 L 440 10 L 435 19 L 430 10 L 425 15 L 420 10 L 415 18 L 410 10 L 405 14 L 400 10 L 395 17 L 390 10 L 385 16 L 380 10 L 375 19 L 370 10 L 365 15 L 360 10 L 355 18 L 350 10 L 345 13 L 340 10 L 335 17 L 330 10 L 325 16 L 320 10 L 315 19 L 310 10 L 305 15 L 300 10 L 295 18 L 290 10 L 285 14 L 280 10 L 275 17 L 270 10 L 265 16 L 260 10 L 255 19 L 250 10 L 245 15 L 240 10 L 235 18 L 230 10 L 225 13 L 220 10 L 215 17 L 210 10 L 205 14 L 200 10 L 195 19 L 190 10 L 185 15 L 180 10 L 175 18 L 170 10 L 165 16 L 160 10 L 155 19 L 150 10 L 145 14 L 140 10 L 135 18 L 130 10 L 125 13 L 120 10 L 115 17 L 110 10 L 105 15 L 100 10 L 95 19 L 90 10 L 85 16 L 80 10 L 75 18 L 70 10 L 65 13 L 60 10 L 55 17 L 50 10 L 45 14 L 40 10 L 35 19 L 30 10 L 25 15 L 20 10 L 15 18 L 10 10 L 5 16 Z"
                  fill="url(#waveformNeonGreen)"
                  stroke="#34d399"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
          </div>

          {/* Track 3: Camera Cues Track (Cue 02) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '20px' }}>
            <div style={{ width: '122px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Camera size={10} color="#38bdf8" /> Camera Cues Track
              </span>
              <span style={{ fontSize: '0.5rem', color: '#64748b' }}>Cue 02</span>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: '8px', height: '20px', alignItems: 'center' }}>
              <div style={{
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                borderRadius: '3px',
                padding: '1px 12px',
                fontSize: '0.54rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700
              }}>
                Cue 02
              </div>
              <div style={{
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                borderRadius: '3px',
                padding: '1px 12px',
                fontSize: '0.54rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700
              }}>
                Cue 03
              </div>
              <div style={{
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                borderRadius: '3px',
                padding: '1px 12px',
                fontSize: '0.54rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700
              }}>
                Cue 04
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
