import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Square, SkipBack, SkipForward,
  Sliders, MoreVertical, Scissors, Link, Search, Maximize2,
  Bookmark, Eye, EyeOff, Lock, Unlock, Film, Music, Camera
} from 'lucide-react';

export default function VideoStudio({ 
  initialPreset, 
  onStatusChange, 
  onNavigateToGeo 
}) {
  // Campaign Brief State with Reference Default: Neo-Racing Tokyo & Ashky
  const [projectName, setProjectName] = useState(initialPreset?.product_name || 'Neo-Racing Tokyo');
  const [studio, setStudio] = useState(initialPreset?.studio || 'Ashky');
  const [targetAudience, setTargetAudience] = useState(initialPreset?.target_audience || 'Gen Z/Alpha');
  const [style, setStyle] = useState(initialPreset?.style || 'Cinematic Neon-Noir');

  useEffect(() => {
    if (initialPreset) {
      if (initialPreset.product_name) setProjectName(initialPreset.product_name);
      if (initialPreset.studio) setStudio(initialPreset.studio);
      if (initialPreset.target_audience) setTargetAudience(initialPreset.target_audience);
      if (initialPreset.style) setStyle(initialPreset.style);
    }
  }, [initialPreset]);

  // Video & Playback State - initialized to 2.25s matching 01:22:15 in reference
  const videoPlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(2.25);
  const [duration, setDuration] = useState(5.4);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [timelineZoom, setTimelineZoom] = useState(1.0);
  const [activeSequence, setActiveSequence] = useState('SEQUENCE 14');

  // Audio Preview State
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const audioVoiceRef = useRef(null);

  // Track Visibility & Locking
  const [trackVisibility, setTrackVisibility] = useState({ video: true, audio: true, cues: true });
  const [trackLocked, setTrackLocked] = useState({ video: false, audio: false, cues: false });

  // Tool states
  const [activeTool, setActiveTool] = useState('pointer');
  const [searchFilter, setSearchFilter] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showSequenceDropdown, setShowSequenceDropdown] = useState(false);

  // Overflow Menu States
  const [briefMenuOpen, setBriefMenuOpen] = useState(false);
  const [synthesisMenuOpen, setSynthesisMenuOpen] = useState(false);
  const [stageMenuOpen, setStageMenuOpen] = useState(false);
  const [criticMenuOpen, setCriticMenuOpen] = useState(false);

  // Synthesis Status
  const [synthesisProgress, setSynthesisProgress] = useState(78);
  const [synthesisActive, setSynthesisActive] = useState(true);
  const [synthesisScene, setSynthesisScene] = useState('Night Run');

  // Timecode formatter: matches reference 01:22:15 display format
  const formatTimecode = (sec) => {
    if (!sec && sec !== 0) return '01:22:15';
    // Calculate normalized offset centered around 01:22:15
    const baseOffset = 82.6; // 01:22:15
    const totalSec = baseOffset + (sec - 2.25);
    const mins = Math.floor(totalSec / 60);
    const secs = Math.floor(totalSec % 60);
    const frames = Math.floor((totalSec % 1) * 25);
    return `01:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`.slice(0, 5) + `:${String(frames).padStart(2, '0')}`;
  };

  // Pre-configured scenes matching the reference video
  const scenes = [
    {
      scene_number: 14,
      title: 'Night Chase',
      timeStart: 0.0,
      timeEnd: 5.4,
      camera_cues: 'Zoom In / Tracking',
      telemetry: { frame: 2459, time: '01:22' },
      script: 'Scene 14: Night Chase',
      audio_url: '/media/audio/camp_neon_circuit_01/scene_1.mp3'
    },
    {
      scene_number: 15,
      title: 'Tunnel Drift',
      timeStart: 5.4,
      timeEnd: 12.0,
      camera_cues: 'Low-Angle Dolly / Speedometer Blur',
      telemetry: { frame: 3120, time: '01:30' },
      script: 'Scene 15: Tunnel Drift',
      audio_url: '/media/audio/camp_neon_circuit_01/scene_2.mp3'
    },
    {
      scene_number: 16,
      title: 'Rooftop Climax',
      timeStart: 12.0,
      timeEnd: 18.9,
      camera_cues: 'Wide Beauty Shot / Neon Billboard',
      telemetry: { frame: 4500, time: '01:45' },
      script: 'Scene 16: Rooftop Climax',
      audio_url: '/media/audio/camp_neon_circuit_01/scene_3.mp3'
    }
  ];

  const currentScene = scenes[selectedSceneIndex] || scenes[0];

  // Video Play / Pause Toggle
  const toggleTimelinePlayback = () => {
    if (!videoPlayerRef.current) return;
    if (isPlaying) {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      videoPlayerRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Video playback prevented:", err);
      });
    }
  };

  // Stop Playback
  const handleStopPlayback = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
      videoPlayerRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Seek Video
  const handleSeek = (newTime) => {
    const clamped = Math.max(0, Math.min(newTime, duration));
    setCurrentTime(clamped);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = clamped;
    }
  };

  // Previous / Next Scene Seek
  const handlePrevScene = () => {
    handleSeek(0);
  };

  const handleNextScene = () => {
    handleSeek(duration);
  };

  // Audio Voice Preview Toggle
  const handleToggleVoice = () => {
    if (isPlayingVoice) {
      if (audioVoiceRef.current) {
        audioVoiceRef.current.pause();
        audioVoiceRef.current.currentTime = 0;
      }
      setIsPlayingVoice(false);
    } else {
      setIsPlayingVoice(true);
      const audio = new Audio(currentScene.audio_url);
      audioVoiceRef.current = audio;
      audio.onended = () => setIsPlayingVoice(false);
      audio.onerror = () => setIsPlayingVoice(false);
      audio.play().catch(() => setIsPlayingVoice(false));
    }
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // 19 video frames extracted from authentic video for Track 1 filmstrip
  const thumbFrames = Array.from({ length: 22 }, (_, i) => {
    const num = String(Math.min(22, i + 1)).padStart(2, '0');
    return `/assets/video_frames/thumb_${num}.jpg`;
  });

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
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)',
      userSelect: 'none'
    }}>

      {/* ------------------------------------------------------------ */}
      {/* UPPER SECTION: THREE COLUMNS (ROUGHLY 23% / 54% / 23%) */}
      {/* ------------------------------------------------------------ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(240px, 23%) minmax(480px, 54%) minmax(240px, 23%)',
        gap: '10px',
        flex: 1.55,
        minHeight: 0
      }}>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 1: CAMPAIGN BRIEF & LIVE SYNTHESIS STATUS */}
        {/* ------------------------------------------------------------ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', minHeight: 0 }}>
          
          {/* Card 1A: Campaign Brief (v3.1) */}
          <div style={{
            background: '#0c0f16',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'relative'
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
              <div style={{ position: 'relative' }}>
                <MoreVertical 
                  size={14} 
                  color="#64748b" 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => setBriefMenuOpen(!briefMenuOpen)}
                />
                {briefMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: 0,
                    width: '150px',
                    background: '#0d1017',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '6px',
                    padding: '4px',
                    zIndex: 100,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                    fontSize: '0.68rem'
                  }}>
                    <button 
                      onClick={() => { setProjectName('Neo-Racing Tokyo'); setStudio('Ashky'); setBriefMenuOpen(false); }}
                      style={{ width: '100%', background: 'transparent', border: 'none', color: '#cbd5e1', textAlign: 'left', padding: '5px 8px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      Reset Defaults
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Inputs Group */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>
                <label style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#07090f',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '5px',
                    padding: '6px 8px',
                    fontSize: '0.74rem',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>
                  Studio
                </label>
                <input
                  type="text"
                  value={studio}
                  onChange={(e) => setStudio(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#07090f',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '5px',
                    padding: '6px 8px',
                    fontSize: '0.74rem',
                    color: '#cbd5e1',
                    boxSizing: 'border-box',
                    outline: 'none'
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
                    boxSizing: 'border-box',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Gen Z/Alpha">Gen Z/Alpha</option>
                  <option value="Roguelite & Cyberpunk Fans">Roguelite & Cyberpunk Fans</option>
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
                    boxSizing: 'border-box',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Cinematic Neon-Noir">Cinematic Neon-Noir</option>
                  <option value="Kinetic High-Tech Dark">Kinetic High-Tech Dark</option>
                  <option value="Cyberpunk Matrix Minimal">Cyberpunk Matrix Minimal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 1B: Live Synthesis Status (Exact Match to Image 1) */}
          <div style={{
            background: '#110e08',
            border: '1.5px solid #f59e0b',
            boxShadow: '0 0 16px rgba(245, 158, 11, 0.18)',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            position: 'relative'
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
              <MoreVertical 
                size={13} 
                color="#92400e" 
                style={{ cursor: 'pointer' }} 
                onClick={() => setSynthesisMenuOpen(!synthesisMenuOpen)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Processing Scene: <strong style={{ color: '#ffffff' }}>{synthesisScene} ({synthesisProgress}%)</strong>
              </span>
              <span style={{
                fontSize: '0.58rem',
                background: synthesisActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                color: synthesisActive ? '#34d399' : '#94a3b8',
                border: `1px solid ${synthesisActive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(100, 116, 139, 0.4)'}`,
                padding: '1px 6px',
                borderRadius: '3px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)'
              }}>
                {synthesisActive ? 'ACTIVE' : 'IDLE'}
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
          boxShadow: '0 0 22px rgba(245, 158, 11, 0.16)',
          borderRadius: '10px',
          padding: '10px 14px 8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          boxSizing: 'border-box'
        }}>
          
          {/* Header Row: "Master Cinema Stage" */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
            <h2 style={{ fontSize: '0.94rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '0.02em' }}>
              Master Cinema Stage
            </h2>
            <MoreVertical 
              size={14} 
              color="#64748b" 
              style={{ cursor: 'pointer' }} 
              onClick={() => setStageMenuOpen(!stageMenuOpen)}
            />
          </div>

          {/* Central Dual-Dock Display: Phone Monitor Left + Director Notes HUD Right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            flex: 1,
            minHeight: 0
          }}>
            
            {/* Phone Monitor: Realistic Curved iPhone 15 Pro Bezel with Dynamic Island */}
            <div style={{
              width: '235px',
              height: '415px',
              borderRadius: '32px',
              background: '#000000',
              border: '3px solid #283042',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={toggleTimelinePlayback}
            title={isPlaying ? "Click to Pause" : "Click to Play"}
            >
              
              {/* Dynamic Island Notch */}
              <div style={{
                position: 'absolute',
                top: '7px',
                width: '58px',
                height: '14px',
                background: '#000000',
                borderRadius: '10px',
                zIndex: 25,
                boxShadow: '0 0 4px rgba(0,0,0,0.8)'
              }} />

              {/* REAL LIVE VIDEO PLAYER */}
              <video
                ref={videoPlayerRef}
                playsInline
                src="/media/videos/camp_neo_tokyo.mp4"
                poster="/assets/neo_racing_screen.jpg"
                muted={isMuted}
                onTimeUpdate={(e) => {
                  setCurrentTime(parseFloat(e.target.currentTime.toFixed(2)));
                }}
                onLoadedMetadata={(e) => {
                  if (e.target.duration) setDuration(parseFloat(e.target.duration.toFixed(1)));
                }}
                onEnded={() => setIsPlaying(false)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

            </div>

            {/* Right Side: Director Notes HUD Card (Matching Image 1 Master UI) */}
            <div style={{
              width: '260px',
              background: '#0d1017',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
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
                <Sliders 
                  size={13} 
                  color="#f59e0b" 
                  style={{ cursor: 'pointer' }} 
                  onClick={handleToggleVoice}
                  title="Audio Voice Preview"
                />
              </div>

              {/* Script Section */}
              <div>
                <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, display: 'block', fontFamily: 'var(--font-mono)' }}>
                  Script
                </span>
                <p style={{ fontSize: '0.76rem', color: '#e2e8f0', margin: '1px 0 0', fontWeight: 600 }}>
                  {currentScene.script}
                </p>
              </div>

              {/* Waveform Audio Preview with Golden Acoustic Waveform */}
              <div 
                onClick={handleToggleVoice}
                style={{ cursor: 'pointer' }}
                title="Click to preview audio"
              >
                <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, display: 'block', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                  Waveform Audio Preview
                </span>
                
                {/* Centered Golden Acoustic Waveform graphic */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '26px', gap: '2px' }}>
                  {[3, 4, 6, 8, 11, 14, 18, 22, 26, 22, 18, 14, 11, 8, 6, 4, 3].map((h, idx) => (
                    <span
                      key={idx}
                      style={{
                        width: '2.5px',
                        height: isPlayingVoice ? `${Math.max(4, (h * 1.25) % 26)}px` : `${h}px`,
                        background: '#f59e0b',
                        borderRadius: '1.5px',
                        boxShadow: '0 0 5px rgba(245, 158, 11, 0.45)',
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
                <p style={{ fontSize: '0.74rem', color: '#e2e8f0', margin: '1px 0 0', fontWeight: 500 }}>
                  {currentScene.camera_cues}
                </p>
              </div>

              {/* Telemetry Section */}
              <div>
                <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 700, display: 'block', fontFamily: 'var(--font-mono)' }}>
                  Telemetry
                </span>
                <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: '1px 0 0', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  Frame: {2459 + Math.floor(currentTime * 25)} | Time: 01:22
                </p>
              </div>
            </div>

          </div>

          {/* Bottom of Master Cinema Stage: Amber Transport Bar Controls (Matching Image 1) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '4px' }}>
            {/* Amber Range Slider with glowing thumb and dual color track */}
            <input
              type="range"
              min="0"
              max={duration}
              step="0.05"
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="timeline-slider-amber"
              style={{
                width: '100%',
                background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.15) ${(currentTime / duration) * 100}%, rgba(255, 255, 255, 0.15) 100%)`,
                cursor: 'pointer',
                height: '3px'
              }}
            />

            {/* Transport Bar Row: Left Timecode 01:22:15 | Centered Controls | Right Timecode 01:22:15 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', fontWeight: 600 }}>
                01:22:15
              </span>

              {/* Center Controls: SkipBack, Amber Play/Stop, SkipForward */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handlePrevScene}
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
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    boxShadow: '0 0 12px rgba(245, 158, 11, 0.7)',
                    border: 'none',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={12} fill="#000000" /> : <Play size={12} fill="#000000" style={{ marginLeft: '1px' }} />}
                </button>

                <button
                  type="button"
                  onClick={handleNextScene}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                  title="Next Scene"
                >
                  <SkipForward size={14} />
                </button>
              </div>

              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', fontWeight: 600 }}>
                01:22:15
              </span>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 3: GEMINI VISION CRITIC (EXACT MATCH TO IMAGE 1) */}
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
          boxSizing: 'border-box',
          position: 'relative'
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
            <MoreVertical 
              size={14} 
              color="#64748b" 
              style={{ cursor: 'pointer' }} 
              onClick={() => setCriticMenuOpen(!criticMenuOpen)}
            />
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
            gap: '6px'
          }}>
            <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Quality Breakdown
            </span>

            {[
              { label: 'Visuals', pct: 95, color: '#2dd4bf' },
              { label: 'Audio', pct: 88, color: '#38bdf8' },
              { label: 'Pacing', pct: 96, color: '#fbbf24' },
              { label: 'Narrative', pct: 80, color: '#34d399' },
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
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.68rem',
            color: '#94a3b8',
            lineHeight: 1.4
          }}>
            <strong style={{ color: '#e2e8f0' }}>CRITIQUE:</strong> Strong visual hook; excellent pacing; dynamic audio sync.
          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------ */}
      {/* LOWER SECTION: MASTER NLE TIMELINE (39% OF WORKSPACE) */}
      {/* ------------------------------------------------------------ */}
      <div style={{
        background: '#080a10',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        padding: '8px 14px 10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        minHeight: '260px',
        maxHeight: '380px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Timeline Header Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '6px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {/* Left: Sequence Title & Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowSequenceDropdown(!showSequenceDropdown)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <span>TIMELINE: {activeSequence}</span>
                <span style={{ fontSize: '0.64rem', color: '#64748b' }}>⌵</span>
              </button>

              {showSequenceDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: 0,
                  width: '180px',
                  background: '#0d1017',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '6px',
                  padding: '4px',
                  zIndex: 100,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                  fontSize: '0.68rem'
                }}>
                  {['SEQUENCE 14 (Active Master)', 'SEQUENCE 13 (Rough Cut)', 'SEQUENCE 12 (Teaser Cut)'].map((seq) => (
                    <button
                      key={seq}
                      onClick={() => { setActiveSequence(seq.split(' ')[0] + ' ' + seq.split(' ')[1]); setShowSequenceDropdown(false); }}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: activeSequence.includes(seq.split(' ')[1]) ? '#38bdf8' : '#cbd5e1',
                        textAlign: 'left',
                        padding: '5px 8px',
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                    >
                      {seq}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Editing Tools: Scissors, Link, Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
              <button
                type="button"
                onClick={() => { setActiveTool('scissors'); alert(`Split clip at 01:22:15`); }}
                title="Razor / Cut Clip"
                style={{ background: 'transparent', border: 'none', color: activeTool === 'scissors' ? '#38bdf8' : '#64748b', cursor: 'pointer', padding: '2px' }}
              >
                <Scissors size={13} />
              </button>
              <button
                type="button"
                onClick={() => { setActiveTool('link'); alert("Tracks linked"); }}
                title="Link Audio & Video"
                style={{ background: 'transparent', border: 'none', color: activeTool === 'link' ? '#38bdf8' : '#64748b', cursor: 'pointer', padding: '2px' }}
              >
                <Link size={13} />
              </button>
              <button
                type="button"
                onClick={() => setShowSearchInput(!showSearchInput)}
                title="Search Cues"
                style={{ background: 'transparent', border: 'none', color: showSearchInput ? '#38bdf8' : '#64748b', cursor: 'pointer', padding: '2px' }}
              >
                <Search size={13} />
              </button>
              {showSearchInput && (
                <input
                  type="text"
                  placeholder="Filter cue..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{
                    background: '#07090f',
                    border: '1px solid #38bdf8',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    padding: '2px 6px',
                    width: '80px',
                    outline: 'none'
                  }}
                />
              )}
            </div>
          </div>

          {/* Center: Playback Transport Buttons & Glowing Cyan Timecode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
              <button
                type="button"
                onClick={handlePrevScene}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '3px' }}
                title="Previous Cue"
              >
                <SkipBack size={13} />
              </button>
              <button
                type="button"
                onClick={toggleTimelinePlayback}
                style={{ background: 'transparent', border: 'none', color: isPlaying ? '#38bdf8' : '#ffffff', cursor: 'pointer', padding: '3px' }}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              </button>
              <button
                type="button"
                onClick={handleStopPlayback}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '3px' }}
                title="Stop"
              >
                <Square size={11} />
              </button>
              <button
                type="button"
                onClick={handleNextScene}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '3px' }}
                title="Next Cue"
              >
                <SkipForward size={13} />
              </button>
            </div>

            {/* Glowing Cyan Timecode Badge 01:22:15 */}
            <div style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38bdf8',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.45)',
              borderRadius: '4px',
              padding: '2px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              fontWeight: 800,
              color: '#38bdf8'
            }}>
              01:22:15
            </div>
          </div>

          {/* Right Tools: Bookmark, Aspect, Settings, Zoom Slider, Fullscreen */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
            <button
              type="button"
              onClick={() => alert(`Marker set at 01:22:15`)}
              title="Add Marker"
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
            >
              <Bookmark size={13} />
            </button>
            <button
              type="button"
              onClick={() => alert("Timeline Track Settings")}
              title="Track Settings"
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
            >
              <Sliders size={13} />
            </button>

            {/* Zoom Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setTimelineZoom(Math.max(0.6, timelineZoom - 0.2))}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.74rem', cursor: 'pointer', padding: '0 2px' }}
                title="Zoom Out"
              >
                -
              </button>
              <input
                type="range"
                min="0.6"
                max="2.0"
                step="0.1"
                value={timelineZoom}
                onChange={(e) => setTimelineZoom(parseFloat(e.target.value))}
                style={{ width: '42px', height: '2px', accentColor: '#38bdf8', cursor: 'pointer' }}
                title={`Zoom ${Math.round(timelineZoom * 100)}%`}
              />
              <button
                type="button"
                onClick={() => setTimelineZoom(Math.min(2.0, timelineZoom + 0.2))}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.74rem', cursor: 'pointer', padding: '0 2px' }}
                title="Zoom In"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleToggleFullscreen}
              title="Toggle Fullscreen"
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>

        {/* Tracks Area with Relative Container & Aligned Playhead */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
          justifyContent: 'space-between',
          marginTop: '6px'
        }}>
          
          {/* Vertical Cyan Playhead Needle Aligned to 01:22:15 */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `calc(134px + (100% - 146px) * 0.49)`,
            width: '2px',
            background: '#38bdf8',
            boxShadow: '0 0 8px #38bdf8',
            zIndex: 30,
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

          {/* Time Ruler (01:00, 01:15, 01:22:15, 01:30, 01:45, 01:40) */}
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(clickX / rect.width, 1));
              handleSeek(ratio * duration);
            }}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingLeft: '134px',
              paddingRight: '12px',
              fontSize: '0.54rem',
              color: '#64748b',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <span>01:00</span>
            <span>01:15</span>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>01:22:15</span>
            <span>01:30</span>
            <span>01:45</span>
            <span>01:40</span>
          </div>

          {/* Track 1: Video Track (Filmstrip Thumbnails) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '126px', minWidth: '126px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Film size={10} color="#38bdf8" /> Video Track
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setTrackVisibility({ ...trackVisibility, video: !trackVisibility.video })}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                  >
                    {trackVisibility.video ? <Eye size={10} /> : <EyeOff size={10} color="#ef4444" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrackLocked({ ...trackLocked, video: !trackLocked.video })}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                  >
                    {trackLocked.video ? <Lock size={10} color="#f59e0b" /> : <Unlock size={10} />}
                  </button>
                </div>
              </div>
              <span style={{ fontSize: '0.5rem', color: '#64748b' }}>Filmstrip Thumbnails</span>
            </div>

            {/* Video Track Content: Real Video Frames Filmstrip */}
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(clickX / rect.width, 1));
                handleSeek(ratio * duration);
              }}
              style={{
                flex: 1,
                display: 'flex',
                gap: '2px',
                height: '42px',
                background: '#040507',
                borderRadius: '4px',
                border: '1.5px solid #38bdf8',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: trackVisibility.video ? 1 : 0.3
              }}
            >
              {/* Badge Overlay */}
              <div style={{
                position: 'absolute',
                top: '2px',
                left: '4px',
                background: 'rgba(0,0,0,0.8)',
                padding: '1px 5px',
                borderRadius: '2px',
                fontSize: '0.5rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                zIndex: 10
              }}>
                Racing sequence
              </div>

              {/* Real Video Thumbnails Strip */}
              <div style={{
                flex: 1,
                display: 'flex',
                height: '100%',
                width: '100%',
                transform: `scaleX(${timelineZoom})`,
                transformOrigin: 'left center'
              }}>
                {thumbFrames.map((frameSrc, idx) => (
                  <img
                    key={idx}
                    src={frameSrc}
                    alt={`Frame ${idx + 1}`}
                    style={{
                      flex: 1,
                      height: '100%',
                      objectFit: 'cover',
                      borderRight: '1px solid rgba(0,0,0,0.4)',
                      pointerEvents: 'none'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Track 2: Audio Track (Green Acoustic Waveform) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '126px', minWidth: '126px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Music size={10} color="#34d399" /> Audio Track
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setTrackVisibility({ ...trackVisibility, audio: !trackVisibility.audio })}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                  >
                    {trackVisibility.audio ? <Eye size={10} /> : <EyeOff size={10} color="#ef4444" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrackLocked({ ...trackLocked, audio: !trackLocked.audio })}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                  >
                    {trackLocked.audio ? <Lock size={10} color="#f59e0b" /> : <Unlock size={10} />}
                  </button>
                </div>
              </div>
              <span style={{ fontSize: '0.5rem', color: '#64748b' }}>Green Acoustic Waveform</span>
            </div>

            {/* Audio Track Content: Vibrant Green Acoustic Waveform */}
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(clickX / rect.width, 1));
                handleSeek(ratio * duration);
              }}
              style={{
                flex: 1,
                height: '36px',
                background: '#05140d',
                borderRadius: '4px',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                padding: '0 6px',
                cursor: 'pointer',
                opacity: trackVisibility.audio ? 1 : 0.3
              }}
            >
              <span style={{
                position: 'absolute',
                top: '2px',
                left: '6px',
                fontSize: '0.5rem',
                color: '#34d399',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                background: 'rgba(5, 20, 13, 0.85)',
                padding: '1px 5px',
                borderRadius: '2px',
                zIndex: 10
              }}>
                Racing SFX
              </span>

              <svg 
                width="100%" 
                height="32" 
                viewBox="0 0 1000 32" 
                preserveAspectRatio="none" 
                style={{
                  opacity: 0.95,
                  transform: `scaleX(${timelineZoom})`,
                  transformOrigin: 'left center'
                }}
              >
                <defs>
                  <linearGradient id="waveformNeonGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 16 L 5 8 L 10 16 L 15 4 L 20 16 L 25 9 L 30 16 L 35 2 L 40 16 L 45 10 L 50 16 L 55 5 L 60 16 L 65 11 L 70 16 L 75 4 L 80 16 L 85 7 L 90 16 L 95 2 L 100 16 L 105 8 L 110 16 L 115 5 L 120 16 L 125 11 L 130 16 L 135 4 L 140 16 L 145 9 L 150 16 L 155 2 L 160 16 L 165 7 L 170 16 L 175 4 L 180 16 L 185 8 L 190 16 L 195 2 L 200 16 L 205 9 L 210 16 L 215 5 L 220 16 L 225 11 L 230 16 L 235 4 L 240 16 L 245 8 L 250 16 L 255 2 L 260 16 L 265 7 L 270 16 L 275 5 L 280 16 L 285 9 L 290 16 L 295 4 L 300 16 L 305 8 L 310 16 L 315 2 L 320 16 L 325 7 L 330 16 L 335 5 L 340 16 L 345 11 L 350 16 L 355 4 L 360 16 L 365 8 L 370 16 L 375 2 L 380 16 L 385 7 L 390 16 L 395 5 L 400 16 L 405 9 L 410 16 L 415 4 L 420 16 L 425 8 L 430 16 L 435 2 L 440 16 L 445 7 L 450 16 L 455 5 L 460 16 L 465 11 L 470 16 L 475 4 L 480 16 L 485 8 L 490 16 L 495 2 L 500 16 L 505 7 L 510 16 L 515 5 L 520 16 L 525 9 L 530 16 L 535 4 L 540 16 L 545 8 L 550 16 L 555 2 L 560 16 L 565 7 L 570 16 L 575 5 L 580 16 L 585 11 L 590 16 L 595 4 L 600 16 L 605 8 L 610 16 L 615 2 L 620 16 L 625 7 L 630 16 L 635 5 L 640 16 L 645 9 L 650 16 L 655 4 L 660 16 L 665 8 L 670 16 L 675 2 L 680 16 L 685 7 L 690 16 L 695 5 L 700 16 L 705 11 L 710 16 L 715 4 L 720 16 L 725 8 L 730 16 L 735 2 L 740 16 L 745 7 L 750 16 L 755 5 L 760 16 L 765 9 L 770 16 L 775 4 L 780 16 L 785 8 L 790 16 L 795 2 L 800 16 L 805 7 L 810 16 L 815 5 L 820 16 L 825 11 L 830 16 L 835 4 L 840 16 L 845 8 L 850 16 L 855 2 L 860 16 L 865 7 L 870 16 L 875 5 L 880 16 L 885 9 L 890 16 L 895 4 L 900 16 L 905 8 L 910 16 L 915 2 L 920 16 L 925 7 L 930 16 L 935 5 L 940 16 L 945 11 L 950 16 L 955 4 L 960 16 L 965 8 L 970 16 L 975 2 L 980 16 L 985 7 L 990 16 L 995 4 L 1000 16 L 1000 16 L 995 28 L 990 16 L 985 25 L 980 16 L 975 30 L 970 16 L 965 24 L 960 16 L 955 28 L 950 16 L 945 21 L 940 16 L 935 27 L 930 16 L 925 25 L 920 16 L 915 30 L 910 16 L 905 24 L 900 16 L 895 28 L 890 16 L 885 22 L 880 16 L 875 27 L 870 16 L 865 25 L 860 16 L 855 30 L 850 16 L 845 24 L 840 16 L 835 28 L 830 16 L 825 21 L 820 16 L 815 27 L 810 16 L 805 25 L 800 16 L 795 30 L 790 16 L 785 24 L 780 16 L 775 28 L 770 16 L 765 22 L 760 16 L 755 27 L 750 16 L 745 25 L 740 16 L 735 30 L 730 16 L 725 24 L 720 16 L 715 28 L 710 16 L 705 21 L 700 16 L 695 27 L 690 16 L 685 25 L 680 16 L 675 30 L 670 16 L 665 24 L 660 16 L 655 28 L 650 16 L 645 22 L 640 16 L 635 27 L 630 16 L 625 25 L 620 16 L 615 30 L 610 16 L 605 24 L 600 16 L 595 28 L 590 16 L 585 21 L 580 16 L 575 27 L 570 16 L 565 25 L 560 16 L 555 30 L 550 16 L 545 24 L 540 16 L 535 28 L 530 16 L 525 22 L 520 16 L 515 27 L 510 16 L 505 25 L 500 16 L 495 30 L 490 16 L 485 24 L 480 16 L 475 28 L 470 16 L 465 21 L 460 16 L 455 27 L 450 16 L 445 25 L 440 16 L 435 30 L 430 16 L 425 24 L 420 16 L 415 28 L 410 16 L 405 22 L 400 16 L 395 27 L 390 16 L 385 25 L 380 16 L 375 30 L 370 16 L 365 24 L 360 16 L 355 28 L 350 16 L 345 21 L 340 16 L 335 27 L 330 16 L 325 25 L 320 16 L 315 30 L 310 16 L 305 24 L 300 16 L 295 28 L 290 16 L 285 22 L 280 16 L 275 27 L 270 16 L 265 25 L 260 16 L 255 30 L 250 16 L 245 24 L 240 16 L 235 28 L 230 16 L 225 21 L 220 16 L 215 27 L 210 16 L 205 22 L 200 16 L 195 30 L 190 16 L 185 24 L 180 16 L 175 28 L 170 16 L 165 25 L 160 16 L 155 30 L 150 16 L 145 22 L 140 16 L 135 28 L 130 16 L 125 21 L 120 16 L 115 27 L 110 16 L 105 24 L 100 16 L 95 30 L 90 16 L 85 25 L 80 16 L 75 28 L 70 16 L 65 21 L 60 16 L 55 27 L 50 16 L 45 22 L 40 16 L 35 30 L 30 16 L 25 24 L 20 16 L 15 28 L 10 16 L 5 25 Z"
                  fill="url(#waveformNeonGreen)"
                  stroke="#34d399"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
          </div>

          {/* Track 3: Camera Cues Track (Cue 02, Cue 03, Cue 04) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '24px' }}>
            <div style={{ width: '126px', minWidth: '126px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Camera size={10} color="#38bdf8" /> Camera Cues Track
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setTrackVisibility({ ...trackVisibility, cues: !trackVisibility.cues })}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                  >
                    {trackVisibility.cues ? <Eye size={10} /> : <EyeOff size={10} color="#ef4444" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrackLocked({ ...trackLocked, cues: !trackLocked.cues })}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                  >
                    {trackLocked.cues ? <Lock size={10} color="#f59e0b" /> : <Unlock size={10} />}
                  </button>
                </div>
              </div>
              <span style={{ fontSize: '0.5rem', color: '#64748b' }}>Cue 02</span>
            </div>

            {/* Cue Blocks Container matching Image 1 placement */}
            <div style={{
              flex: 1,
              display: 'flex',
              gap: '12px',
              height: '24px',
              alignItems: 'center',
              position: 'relative',
              opacity: trackVisibility.cues ? 1 : 0.3
            }}>
              <div style={{
                position: 'absolute',
                left: '35%',
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                borderRadius: '3px',
                padding: '2px 14px',
                fontSize: '0.56rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              onClick={() => handleSeek(1.5)}
              title="Seek to Cue 02"
              >
                Cue 02
              </div>

              <div style={{
                position: 'absolute',
                left: '52%',
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                borderRadius: '3px',
                padding: '2px 14px',
                fontSize: '0.56rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              onClick={() => handleSeek(3.0)}
              title="Seek to Cue 03"
              >
                Cue 03
              </div>

              <div style={{
                position: 'absolute',
                left: '75%',
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                borderRadius: '3px',
                padding: '2px 14px',
                fontSize: '0.56rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              onClick={() => handleSeek(4.8)}
              title="Seek to Cue 04"
              >
                Cue 04
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
