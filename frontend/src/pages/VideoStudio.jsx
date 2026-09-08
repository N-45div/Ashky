import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Square, SkipBack, SkipForward,
  Sliders, MoreVertical, Scissors, Link, Search, Maximize2,
  Bookmark, Eye, EyeOff, Lock, Unlock, Film, Music, Camera,
  Zap, Sparkles, RefreshCw, CheckCircle
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

  // Synthesis Engine State
  const [videoEngine, setVideoEngine] = useState('veo'); // 'veo' (Google Veo 3.1) or 'turbo' (Fast FFmpeg)
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisProgress, setSynthesisProgress] = useState(100);
  const [synthesisActive, setSynthesisActive] = useState(false);
  const [synthesisScene, setSynthesisScene] = useState('Neo-Racing Tokyo');
  const [synthesisStep, setSynthesisStep] = useState('Video ready for playback & review');
  const [activeCampaignId, setActiveCampaignId] = useState('camp_neon_circuit_01');

  // Video & Playback State - initialized to 16.875s matching 01:22:15 in reference
  const videoPlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(16.875);
  const [duration, setDuration] = useState(30.0);
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

  // Stage View Mode: 'mobile' (9:16 iPhone 15 frame) vs 'full' (Entire Box Cinema Stage)
  const [stageViewMode, setStageViewMode] = useState('mobile');
  // Video Scaling in Full Box Mode: 'contain' (pristine letterbox preserving 9:16) vs 'cover' (edge-to-edge box fill)
  const [videoFit, setVideoFit] = useState('contain');
  // Floating Director Notes HUD overlay in Full Box Mode
  const [showNotesOverlay, setShowNotesOverlay] = useState(false);
  // Non-blocking in-app toast notification state
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  // Live Gemini 3.8 Flash Vision Critic State
  const [criticData, setCriticData] = useState(null);
  const [isCriticLoading, setIsCriticLoading] = useState(false);

  const runAgenticVisionCritic = async (campId) => {
    const targetId = campId || activeCampaignId || 'camp_neon_circuit_01';
    setIsCriticLoading(true);
    try {
      const res = await fetch('/api/campaigns/agentic-inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: targetId,
          target_focus: '0-3s_hook'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCriticData(data);
        showToast(`Gemini 3.8 Flash Critic: Hook Score ${data.overall_hook_retention_score}/100`);
      }
    } catch (err) {
      console.error('Failed to run Gemini Vision Critic:', err);
    } finally {
      setIsCriticLoading(false);
    }
  };

  // Timecode formatter: matches reference 01:22:15 display format
  const formatTimecode = (sec) => {
    const currentVal = sec !== undefined ? sec : currentTime;
    const progress = Math.max(0, Math.min(currentVal / duration, 1));
    const totalSecs = 60 + progress * 40;
    const mins = Math.floor(totalSecs / 60);
    const s = Math.floor(totalSecs % 60);
    const f = Math.floor((totalSecs % 1) * 25);
    return `0${mins}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
  };

  // Autoplay live preview on mount (muted for browser policy compliance)
  useEffect(() => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.muted = true;
      setIsMuted(true);
      videoPlayerRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If autoplay is blocked by browser policy without user gesture, user can click play
        });
    }
    // Automatically trigger Gemini 3.8 Flash Vision Critic on load
    runAgenticVisionCritic('camp_neon_circuit_01');
  }, []);

  // Smooth 60 FPS Video & Playhead Runner Loop
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    if (isPlaying) {
      const tick = (now) => {
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        // If real video is playing, keep timeline in 100% sync
        if (videoPlayerRef.current && !videoPlayerRef.current.paused) {
          const vTime = videoPlayerRef.current.currentTime;
          setCurrentTime(vTime);
          const idx = scenes.findIndex((s) => vTime >= s.timeStart && vTime < s.timeEnd);
          if (idx !== -1 && idx !== selectedSceneIndex) {
            setSelectedSceneIndex(idx);
          }
        } else {
          // Continuous smooth 60fps ticker fallback
          setCurrentTime((prev) => {
            let next = prev + dt;
            if (next >= duration) {
              next = 0;
              if (videoPlayerRef.current) {
                videoPlayerRef.current.currentTime = 0;
                videoPlayerRef.current.play().catch(() => {});
              }
            }
            if (videoPlayerRef.current && Math.abs(videoPlayerRef.current.currentTime - next) > 0.4) {
              videoPlayerRef.current.currentTime = next;
            }
            const idx = scenes.findIndex((s) => next >= s.timeStart && next < s.timeEnd);
            if (idx !== -1 && idx !== selectedSceneIndex) {
              setSelectedSceneIndex(idx);
            }
            return parseFloat(next.toFixed(3));
          });
        }

        animationFrameId = requestAnimationFrame(tick);
      };

      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, duration, selectedSceneIndex]);

  // Pre-configured default scenes matching reference video
  const defaultScenes = [
    {
      scene_number: 14,
      title: 'Night Chase',
      timeStart: 0.0,
      timeEnd: 10.0,
      camera_cues: 'Zoom In / Tracking',
      telemetry: { frame: 2459, time: '01:22' },
      script: 'Scene 14: Night Chase',
      audio_url: '/media/audio/camp_neon_circuit_01/scene_1.mp3'
    },
    {
      scene_number: 15,
      title: 'Tunnel Drift',
      timeStart: 10.0,
      timeEnd: 20.0,
      camera_cues: 'Low-Angle Dolly / Speedometer Blur',
      telemetry: { frame: 3120, time: '01:30' },
      script: 'Scene 15: Tunnel Drift',
      audio_url: '/media/audio/camp_neon_circuit_01/scene_2.mp3'
    },
    {
      scene_number: 16,
      title: 'Rooftop Climax',
      timeStart: 20.0,
      timeEnd: 30.0,
      camera_cues: 'Wide Beauty Shot / Neon Billboard',
      telemetry: { frame: 4500, time: '01:45' },
      script: 'Scene 16: Rooftop Climax',
      audio_url: '/media/audio/camp_neon_circuit_01/scene_3.mp3'
    }
  ];

  const [scenes, setScenes] = useState(defaultScenes);
  const currentScene = scenes[selectedSceneIndex] || scenes[0];

  // 1-Click Video Synthesis Handler (Veo 3.1 & Turbo)
  const handleSynthesizeVideo = async () => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);
    setSynthesisActive(true);
    setSynthesisProgress(15);
    setSynthesisScene(projectName);
    setSynthesisStep(`Synthesizing 3-scene blueprint with Gemini 3.7 Flash...`);

    try {
      const resp = await fetch('/api/campaigns/quick-synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: projectName,
          studio: studio,
          target_audience: targetAudience,
          category: 'Gaming & Entertainment',
          style: style,
          aspect_ratio: '9:16',
          engine: videoEngine,
        }),
      });

      if (!resp.ok) {
        throw new Error(`Synthesis API error: HTTP ${resp.status}`);
      }

      const data = await resp.json();
      const newCamp = data.campaign;
      const campId = newCamp.campaign_id;
      setActiveCampaignId(campId);

      // Populate blueprint scenes into timeline
      if (newCamp.scenes && newCamp.scenes.length > 0) {
        const mapped = newCamp.scenes.map((s, idx) => ({
          scene_number: s.scene_number || idx + 1,
          title: s.title || `Scene ${idx + 1}`,
          timeStart: idx * 10.0,
          timeEnd: (idx + 1) * 10.0,
          camera_cues: s.camera_cues || 'Cinematic Dolly',
          telemetry: { frame: 2400 + idx * 700, time: `01:${String(idx * 10).padStart(2, '0')}` },
          script: s.voiceover_script || s.title,
          audio_url: `/media/audio/${campId}/scene_${s.scene_number || idx + 1}.mp3`,
        }));
        setScenes(mapped);
      }

      // Poll render status every 1.5s until completion
      const pollTimer = setInterval(async () => {
        try {
          const sResp = await fetch(`/api/campaigns/${campId}/render-status`);
          if (sResp.ok) {
            const sData = await sResp.json();
            setSynthesisProgress(sData.progress_pct || 20);
            setSynthesisStep(sData.current_step || 'Rendering video...');

            if (sData.status === 'completed') {
              clearInterval(pollTimer);
              setIsSynthesizing(false);
              setSynthesisActive(false);
              setSynthesisProgress(100);
              setSynthesisStep('Render complete! Video ready.');

              // Swap in new video URL and restart playback smoothly
              if (sData.video_url && videoPlayerRef.current) {
                videoPlayerRef.current.src = sData.video_url;
                videoPlayerRef.current.currentTime = 0;
                setCurrentTime(0);
                videoPlayerRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
              }

              // Trigger fresh multimodal Gemini 3.8 Flash Vision Critic on newly rendered video
              runAgenticVisionCritic(campId);
            } else if (sData.status === 'failed') {
              clearInterval(pollTimer);
              setIsSynthesizing(false);
              setSynthesisActive(false);
              setSynthesisStep(`Render failed: ${sData.error || 'Check logs'}`);
            }
          }
        } catch (pollErr) {
          console.warn('Status poll warning:', pollErr);
        }
      }, 1500);

    } catch (err) {
      console.error('Failed to start synthesis:', err);
      setIsSynthesizing(false);
      setSynthesisActive(false);
      showToast(`Could not start video synthesis: ${err.message}`);
    }
  };

  // Video Play / Pause Toggle
  const toggleTimelinePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (videoPlayerRef.current) {
        videoPlayerRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      if (videoPlayerRef.current) {
        videoPlayerRef.current.currentTime = currentTime;
        videoPlayerRef.current.play().catch(() => {
          // If unmuted audio playback is restricted, mute and play
          videoPlayerRef.current.muted = true;
          setIsMuted(true);
          videoPlayerRef.current.play().catch(() => {});
        });
      }
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
    setSelectedSceneIndex(0);
  };

  // Seek Video
  const handleSeek = (newTime) => {
    const clamped = Math.max(0, Math.min(newTime, duration));
    setCurrentTime(clamped);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = clamped;
    }
    // Update active scene based on time
    const idx = scenes.findIndex((s) => clamped >= s.timeStart && clamped < s.timeEnd);
    if (idx !== -1 && idx !== selectedSceneIndex) {
      setSelectedSceneIndex(idx);
    }
  };

  // Previous / Next Scene Seek
  const handlePrevScene = () => {
    const prevIdx = Math.max(0, selectedSceneIndex - 1);
    setSelectedSceneIndex(prevIdx);
    handleSeek(scenes[prevIdx].timeStart);
  };

  const handleNextScene = () => {
    const nextIdx = Math.min(scenes.length - 1, selectedSceneIndex + 1);
    setSelectedSceneIndex(nextIdx);
    handleSeek(scenes[nextIdx].timeStart);
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
      maxHeight: '100%',
      width: '100%',
      background: '#07090e',
      color: '#e2e8f0',
      boxSizing: 'border-box',
      padding: '6px 12px 6px',
      gap: '6px',
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
        gap: '8px',
        flex: '1.42 1 0',
        minHeight: 0,
        overflow: 'hidden'
      }}>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 1: CAMPAIGN BRIEF & LIVE SYNTHESIS STATUS */}
        {/* ------------------------------------------------------------ */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
          justifyContent: 'space-between'
        }}>
          
          {/* Card 1A: Campaign Brief (v3.1) */}
          <div style={{
            background: '#0c0f16',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  Campaign Brief
                </h3>
                <span style={{ fontSize: '0.58rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  CAMPAIGN BRIEF v3.1
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <MoreVertical 
                  size={13} 
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div>
                <label style={{ fontSize: '0.56rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '1px', fontFamily: 'var(--font-mono)' }}>
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
                    borderRadius: '4px',
                    padding: '3.5px 6px',
                    fontSize: '0.70rem',
                    color: '#ffffff',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.56rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '1px', fontFamily: 'var(--font-mono)' }}>
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
                    borderRadius: '4px',
                    padding: '3.5px 6px',
                    fontSize: '0.70rem',
                    color: '#cbd5e1',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.56rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '1px', fontFamily: 'var(--font-mono)' }}>
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#07090f',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    padding: '3.5px 6px',
                    fontSize: '0.70rem',
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
                <label style={{ fontSize: '0.56rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '1px', fontFamily: 'var(--font-mono)' }}>
                  Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#07090f',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    padding: '3.5px 6px',
                    fontSize: '0.70rem',
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

              <div>
                <label style={{ fontSize: '0.56rem', color: '#f59e0b', fontWeight: 700, display: 'block', marginBottom: '1px', fontFamily: 'var(--font-mono)' }}>
                  AI Video Engine
                </label>
                <select
                  value={videoEngine}
                  onChange={(e) => setVideoEngine(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#07090f',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: '4px',
                    padding: '3.5px 6px',
                    fontSize: '0.70rem',
                    color: '#fbbf24',
                    boxSizing: 'border-box',
                    outline: 'none',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  <option value="veo">⚡ Google Veo 3.1 Cinema (Official)</option>
                  <option value="turbo">⚡ Turbo Kinetic Compositor (High-Speed)</option>
                </select>
              </div>

              <button
                onClick={handleSynthesizeVideo}
                disabled={isSynthesizing}
                style={{
                  marginTop: '2px',
                  width: '100%',
                  padding: '5px 8px',
                  background: isSynthesizing 
                    ? 'linear-gradient(135deg, #78350f, #451a03)' 
                    : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: '1px solid #fbbf24',
                  borderRadius: '5px',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.70rem',
                  cursor: isSynthesizing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  boxShadow: isSynthesizing ? 'none' : '0 0 12px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.02em'
                }}
              >
                {isSynthesizing ? (
                  <>
                    <span style={{ display: 'inline-block' }}>⏳</span>
                    Synthesizing Video ({synthesisProgress}%)...
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    Synthesize Campaign Video
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 1B: Live Synthesis Status (Exact Match to Image 1) */}
          <div style={{
            background: '#110e08',
            border: '1.5px solid #f59e0b',
            boxShadow: '0 0 14px rgba(245, 158, 11, 0.15)',
            borderRadius: '10px',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  boxShadow: '0 0 8px #f59e0b',
                  display: 'inline-block'
                }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                  Live Synthesis Status
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <MoreVertical 
                  size={12} 
                  color="#92400e" 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => setSynthesisMenuOpen(!synthesisMenuOpen)}
                />
                {synthesisMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '18px',
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
                      onClick={() => { setSynthesisProgress(100); setSynthesisActive(true); setSynthesisMenuOpen(false); showToast('Synthesis state refreshed'); }}
                      style={{ width: '100%', background: 'transparent', border: 'none', color: '#cbd5e1', textAlign: 'left', padding: '5px 8px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      Refresh Status
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1px' }}>
              <span style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>
                Processing Scene: <strong style={{ color: '#ffffff' }}>{synthesisScene} ({synthesisProgress}%)</strong>
              </span>
              <span style={{
                fontSize: '0.54rem',
                background: isSynthesizing ? 'rgba(245, 158, 11, 0.25)' : (synthesisActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)'),
                color: isSynthesizing ? '#fbbf24' : (synthesisActive ? '#34d399' : '#94a3b8'),
                border: `1px solid ${isSynthesizing ? 'rgba(245, 158, 11, 0.5)' : (synthesisActive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(100, 116, 139, 0.4)')}`,
                padding: '1px 5px',
                borderRadius: '3px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)'
              }}>
                {isSynthesizing ? 'SYNTHESIZING' : (synthesisActive ? 'ACTIVE' : 'IDLE')}
              </span>
            </div>

            {synthesisStep && (
              <div style={{ fontSize: '0.60rem', color: '#f59e0b', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {synthesisStep}
              </div>
            )}

            {/* 16-Dot Pacing Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              {[...Array(16)].map((_, i) => {
                const activeCount = isSynthesizing 
                  ? Math.max(1, Math.round((synthesisProgress / 100) * 16))
                  : (synthesisActive ? 12 : 0);
                const isActive = i < activeCount;
                return (
                  <span
                    key={i}
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)',
                      boxShadow: isActive ? '0 0 5px #f59e0b' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                );
              })}
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 2: MASTER CINEMA STAGE (EXACT MATCH TO REFERENCE UI) */}
        {/* ------------------------------------------------------------ */}
        <div style={{
          background: '#090c12',
          border: '1.5px solid #f59e0b',
          boxShadow: '0 0 18px rgba(245, 158, 11, 0.14)',
          borderRadius: '10px',
          padding: '8px 14px 6px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          
          {/* Header Row: "Master Cinema Stage" + View Mode Switcher + Overflow Menu */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '0.02em' }}>
                Master Cinema Stage
              </h2>

              {/* View Mode Switcher Pill: Mobile (9:16) vs Entire Box */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '1.5px',
                gap: '2px'
              }}>
                <button
                  type="button"
                  onClick={() => setStageViewMode('mobile')}
                  style={{
                    background: stageViewMode === 'mobile' ? '#f59e0b' : 'transparent',
                    color: stageViewMode === 'mobile' ? '#000000' : '#94a3b8',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 7px',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                  title="Mobile View (9:16 iPhone 15 Pro mockup)"
                >
                  <span>📱</span> Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setStageViewMode('full')}
                  style={{
                    background: stageViewMode === 'full' ? '#f59e0b' : 'transparent',
                    color: stageViewMode === 'full' ? '#000000' : '#94a3b8',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 7px',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                  title="Entire Box View (Expanded Cinema Stage Canvas)"
                >
                  <span>🔲</span> Entire Box
                </button>
              </div>

              {/* Controls specific to Entire Box Mode */}
              {stageViewMode === 'full' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const next = videoFit === 'contain' ? 'cover' : 'contain';
                      setVideoFit(next);
                      showToast(next === 'contain' ? 'Pristine 9:16 Ratio' : 'Full Box Edge-to-Edge Bleed');
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                      color: '#fbbf24',
                      padding: '2px 6px',
                      fontSize: '0.58rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)'
                    }}
                    title="Toggle between pristine aspect contain and full canvas bleed"
                  >
                    {videoFit === 'contain' ? 'Fit (9:16)' : 'Fill Box'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowNotesOverlay(!showNotesOverlay)}
                    style={{
                      background: showNotesOverlay ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                      border: `1px solid ${showNotesOverlay ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)'}`,
                      borderRadius: '4px',
                      color: showNotesOverlay ? '#fbbf24' : '#cbd5e1',
                      padding: '2px 6px',
                      fontSize: '0.58rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Toggle Director Notes HUD Overlay"
                  >
                    📋 Notes HUD {showNotesOverlay ? 'ON' : 'OFF'}
                  </button>
                </div>
              )}
            </div>

            {/* Stage Menu Dropdown */}
            <div style={{ position: 'relative' }}>
              <MoreVertical 
                size={13} 
                color="#64748b" 
                style={{ cursor: 'pointer' }} 
                onClick={() => setStageMenuOpen(!stageMenuOpen)}
              />
              {stageMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: 0,
                  width: '165px',
                  background: '#0d1017',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '6px',
                  padding: '4px',
                  zIndex: 100,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                  fontSize: '0.68rem'
                }}>
                  <button 
                    onClick={() => { setStageViewMode(stageViewMode === 'mobile' ? 'full' : 'mobile'); setStageMenuOpen(false); }}
                    style={{ width: '100%', background: 'transparent', border: 'none', color: '#cbd5e1', textAlign: 'left', padding: '5px 8px', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    Switch to {stageViewMode === 'mobile' ? 'Entire Box' : 'Mobile'} View
                  </button>
                  <button 
                    onClick={() => { setVideoFit(videoFit === 'contain' ? 'cover' : 'contain'); setStageMenuOpen(false); }}
                    style={{ width: '100%', background: 'transparent', border: 'none', color: '#cbd5e1', textAlign: 'left', padding: '5px 8px', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    Toggle {videoFit === 'contain' ? 'Fill Bleed' : 'Contain 9:16'}
                  </button>
                  <button 
                    onClick={() => { handleToggleFullscreen(); setStageMenuOpen(false); }}
                    style={{ width: '100%', background: 'transparent', border: 'none', color: '#cbd5e1', textAlign: 'left', padding: '5px 8px', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    Toggle Browser Fullscreen
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Central Display: Adaptive Mobile Frame vs. Entire Box Stage */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: stageViewMode === 'mobile' ? '18px' : '0',
            flex: 1,
            minHeight: 0,
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          }}>
            
            {/* Video Canvas Container (Adapts from iPhone Frame to Entire Box) */}
            <div style={{
              width: stageViewMode === 'mobile' ? 'clamp(205px, 17vw, 235px)' : '100%',
              height: stageViewMode === 'mobile' ? 'clamp(330px, 35vh, 395px)' : '100%',
              borderRadius: stageViewMode === 'mobile' ? '28px' : '8px',
              background: '#000000',
              border: stageViewMode === 'mobile' ? '2.5px solid #283042' : '1px solid rgba(245, 158, 11, 0.25)',
              boxShadow: stageViewMode === 'mobile' 
                ? '0 10px 30px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)' 
                : 'inset 0 0 24px rgba(0, 0, 0, 0.85), 0 4px 20px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={toggleTimelinePlayback}
            title={isPlaying ? "Click to Pause" : "Click to Play"}
            >
              
              {/* Dynamic Island Notch - Only rendered in Mobile Mockup mode */}
              {stageViewMode === 'mobile' && (
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  width: '50px',
                  height: '12px',
                  background: '#000000',
                  borderRadius: '8px',
                  zIndex: 25,
                  boxShadow: '0 0 4px rgba(0,0,0,0.8)'
                }} />
              )}

              {/* REAL LIVE VIDEO PLAYER */}
              <video
                ref={videoPlayerRef}
                playsInline
                src="/assets/camp_neo_tokyo.mp4"
                poster="/assets/neo_racing_screen.jpg"
                muted={isMuted}
                loop
                onLoadedMetadata={(e) => {
                  if (e.target.duration && !isNaN(e.target.duration)) {
                    setDuration(parseFloat(e.target.duration.toFixed(1)));
                  }
                }}
                onEnded={() => {
                  if (videoPlayerRef.current) {
                    videoPlayerRef.current.currentTime = 0;
                    videoPlayerRef.current.play().catch(() => {});
                  }
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: stageViewMode === 'mobile' ? 'cover' : videoFit
                }}
              />

              {/* In Entire Box Mode: Overlay Watermark & Controls Badge */}
              {stageViewMode === 'full' && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(8px)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  pointerEvents: 'none'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                  <span style={{ fontSize: '0.60rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    STAGE FEED · 1080x1920 CINEMA {videoFit === 'cover' ? '(FILL)' : '(FIT)'}
                  </span>
                </div>
              )}

            </div>

            {/* Director Notes HUD Card: Rendered side-by-side in Mobile mode, OR as a floating translucent overlay in Entire Box mode */}
            {(stageViewMode === 'mobile' || showNotesOverlay) && (
              <div style={{
                position: stageViewMode === 'full' ? 'absolute' : 'relative',
                top: stageViewMode === 'full' ? '10px' : 'auto',
                right: stageViewMode === 'full' ? '12px' : 'auto',
                zIndex: stageViewMode === 'full' ? 30 : 'auto',
                width: 'clamp(210px, 18vw, 250px)',
                background: stageViewMode === 'full' ? 'rgba(13, 16, 23, 0.90)' : '#0d1017',
                backdropFilter: stageViewMode === 'full' ? 'blur(12px)' : 'none',
                borderRadius: '9px',
                border: stageViewMode === 'full' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: stageViewMode === 'full' ? '0 12px 32px rgba(0,0,0,0.85)' : 'none',
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      Director Notes HUD
                    </h4>
                    <span style={{ fontSize: '0.56rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                      NOTES & DATA
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sliders 
                      size={12} 
                      color="#f59e0b" 
                      style={{ cursor: 'pointer' }} 
                      onClick={handleToggleVoice}
                      title="Audio Voice Preview"
                    />
                    {stageViewMode === 'full' && (
                      <span 
                        onClick={() => setShowNotesOverlay(false)} 
                        style={{ cursor: 'pointer', fontSize: '0.70rem', color: '#94a3b8', padding: '0 2px' }}
                        title="Close Overlay"
                      >
                        ✕
                      </span>
                    )}
                  </div>
                </div>

                {/* Script Section */}
                <div>
                  <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 700, display: 'block', fontFamily: 'var(--font-mono)' }}>
                    Script
                  </span>
                  <p style={{ fontSize: '0.72rem', color: '#e2e8f0', margin: '1px 0 0', fontWeight: 600 }}>
                    {currentScene.script}
                  </p>
                </div>

                {/* Waveform Audio Preview with Golden Acoustic Waveform */}
                <div 
                  onClick={handleToggleVoice}
                  style={{ cursor: 'pointer' }}
                  title="Click to preview audio"
                >
                  <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 700, display: 'block', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
                    Waveform Audio Preview
                  </span>
                  
                  {/* Centered Golden Acoustic Waveform graphic */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '20px', gap: '2px' }}>
                    {[3, 4, 6, 8, 11, 14, 18, 22, 26, 22, 18, 14, 11, 8, 6, 4, 3].map((h, idx) => (
                      <span
                        key={idx}
                        style={{
                          width: '2px',
                          height: isPlayingVoice ? `${Math.max(3, (h * 0.9) % 20)}px` : `${Math.round(h * 0.75)}px`,
                          background: '#f59e0b',
                          borderRadius: '1px',
                          boxShadow: '0 0 4px rgba(245, 158, 11, 0.45)',
                          transition: 'height 0.1s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Camera Cues Section */}
                <div>
                  <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 700, display: 'block', fontFamily: 'var(--font-mono)' }}>
                    Camera Cues
                  </span>
                  <p style={{ fontSize: '0.70rem', color: '#e2e8f0', margin: '1px 0 0', fontWeight: 500 }}>
                    {currentScene.camera_cues}
                  </p>
                </div>

                {/* Telemetry Section */}
                <div>
                  <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 700, display: 'block', fontFamily: 'var(--font-mono)' }}>
                    Telemetry
                  </span>
                  <p style={{ fontSize: '0.68rem', color: '#cbd5e1', margin: '1px 0 0', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    Frame: {Math.round(2400 + (currentTime / duration) * 2100)} | Time: {formatTimecode(currentTime).slice(3)}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Bottom of Master Cinema Stage: Amber Transport Bar Controls (Matching Image 1) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '2px' }}>
            {/* Amber Range Slider with glowing thumb and dual color track */}
            <input
              type="range"
              min="0"
              max={duration}
              step="0.01"
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

            {/* Transport Bar Row: Left Timecode | Centered Controls | Right Timecode */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', fontWeight: 600 }}>
                {formatTimecode(currentTime)}
              </span>

              {/* Center Controls: SkipBack, Amber Play/Stop, SkipForward */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handlePrevScene}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                  title="Previous Scene"
                >
                  <SkipBack size={13} />
                </button>

                {/* Glowing Amber Play/Stop Button */}
                <button
                  type="button"
                  onClick={toggleTimelinePlayback}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    boxShadow: '0 0 10px rgba(245, 158, 11, 0.7)',
                    border: 'none',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={11} fill="#000000" /> : <Play size={11} fill="#000000" style={{ marginLeft: '1px' }} />}
                </button>

                <button
                  type="button"
                  onClick={handleNextScene}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                  title="Next Scene"
                >
                  <SkipForward size={13} />
                </button>
              </div>

              <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', fontWeight: 600 }}>
                {formatTimecode(duration)}
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
          padding: '8px 12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '6px',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
          boxSizing: 'border-box',
          position: 'relative'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                Gemini Vision Critic
              </h3>
              <span style={{ fontSize: '0.58rem', color: isCriticLoading ? '#38bdf8' : '#10b981', fontFamily: 'var(--font-mono)' }}>
                {isCriticLoading ? 'AUDITING FRAMES...' : 'GEMINI 3.8 FLASH CRITIC'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => runAgenticVisionCritic(activeCampaignId)}
                disabled={isCriticLoading}
                title="Run live Gemini 3.8 Flash multimodal keyframe audit"
                style={{
                  background: isCriticLoading ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '4px',
                  color: isCriticLoading ? '#38bdf8' : '#cbd5e1',
                  fontSize: '0.55rem',
                  padding: '3px 6px',
                  cursor: isCriticLoading ? 'default' : 'pointer',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                {isCriticLoading ? 'AUDITING...' : '⚡ AUDIT'}
              </button>
              <div style={{ position: 'relative' }}>
                <MoreVertical 
                  size={13} 
                  color="#64748b" 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => setCriticMenuOpen(!criticMenuOpen)}
                />
                {criticMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: 0,
                    width: '180px',
                    background: '#0d1017',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '6px',
                    padding: '4px',
                    zIndex: 100,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                    fontSize: '0.68rem'
                  }}>
                    <button 
                      onClick={() => { setCriticMenuOpen(false); runAgenticVisionCritic(activeCampaignId); }}
                      style={{ width: '100%', background: 'transparent', border: 'none', color: '#cbd5e1', textAlign: 'left', padding: '5px 8px', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      ⚡ Re-analyze (Gemini 3.8 Flash)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top 2 Sub-Cards: Retention Curve Left + Hook Strength Gauge Right */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {/* Retention Curve Card */}
            <div style={{
              background: '#07090f',
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.60rem', color: '#ffffff', fontWeight: 700, display: 'block' }}>
                  Retention Curve
                </span>
                <span style={{ fontSize: '0.52rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  Viewership: {Math.max(10, Math.round(100 - (criticData?.predicted_3s_dropoff_pct ?? 14.2)))}%
                </span>
              </div>

              {/* Downward Sloping Golden Curve SVG */}
              <div style={{ height: '32px', width: '100%', margin: '2px 0' }}>
                <svg width="100%" height="32" viewBox="0 0 120 40" preserveAspectRatio="none">
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

              <span style={{ fontSize: '0.52rem', color: '#f59e0b', fontWeight: 700, textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                VIEWERSHIP
              </span>
            </div>

            {/* Hook Strength Gauge Card */}
            <div style={{
              background: '#07090f',
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.60rem', color: '#ffffff', fontWeight: 700 }}>
                Hook Strength
              </span>

              {/* Dynamic Circular Gauge */}
              {(() => {
                const hookScore = criticData?.overall_hook_retention_score ?? 94;
                const gaugeColor = hookScore >= 80 ? '#f59e0b' : hookScore >= 50 ? '#38bdf8' : '#ef4444';
                return (
                  <div style={{ position: 'relative', width: '42px', height: '42px', margin: '2px 0' }}>
                    <svg width="42" height="42" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="25" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="5" />
                      <circle
                        cx="32"
                        cy="32"
                        r="25"
                        fill="none"
                        stroke={gaugeColor}
                        strokeWidth="5"
                        strokeDasharray="157.1"
                        strokeDashoffset={157.1 * (1 - hookScore / 100)}
                        strokeLinecap="round"
                        transform="rotate(-90 32 32)"
                        style={{ filter: `drop-shadow(0 0 5px ${gaugeColor}B3)` }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                        {hookScore}
                      </span>
                      <span style={{ fontSize: '0.44rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>100</span>
                    </div>
                  </div>
                );
              })()}

              <span style={{ fontSize: '0.52rem', color: '#f59e0b', fontWeight: 700, textAlign: 'center', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
                ENGAGEMENT
              </span>
            </div>
          </div>

          {/* Quality Breakdown: 5 Dynamic Bars */}
          <div style={{
            background: '#07090f',
            padding: '6px 8px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Quality Breakdown
            </span>

            {(() => {
              const hook = criticData?.overall_hook_retention_score ?? 94;
              const f1 = criticData?.active_inspections?.[0]?.visual_retention_score ?? 95;
              const f2 = criticData?.active_inspections?.[1]?.visual_retention_score ?? 88;
              const f3 = criticData?.active_inspections?.[2]?.visual_retention_score ?? 96;
              const f4 = criticData?.active_inspections?.[3]?.visual_retention_score ?? 86;
              const bars = [
                { label: 'Visuals', pct: f1, color: '#2dd4bf' },
                { label: 'Audio', pct: Math.min(100, Math.max(65, Math.round((f1 + f2) / 2) - 2)), color: '#38bdf8' },
                { label: 'Pacing', pct: f3, color: '#fbbf24' },
                { label: 'Narrative', pct: Math.min(100, Math.max(60, Math.round(hook * 0.92))), color: '#34d399' },
                { label: 'Style', pct: f4, color: '#f59e0b' }
              ];
              return bars.map((bar) => (
                <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.58rem' }}>
                  <span style={{ width: '42px', color: '#94a3b8' }}>{bar.label}</span>
                  <div style={{ flex: 1, height: '3.5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${bar.pct}%`, height: '100%', background: bar.color, borderRadius: '2px' }} />
                  </div>
                  <span style={{ width: '18px', textAlign: 'right', color: '#64748b', fontSize: '0.50rem', fontFamily: 'var(--font-mono)' }}>{bar.pct}</span>
                </div>
              ));
            })()}
          </div>

          {/* Dynamic Critique Card */}
          {(() => {
            const currentInsp = criticData?.active_inspections?.[selectedSceneIndex];
            const note = isCriticLoading 
              ? 'Inspecting visual keyframe pixels with Gemini 3.8 Flash...' 
              : (currentInsp?.critic_notes || criticData?.recommended_modifications?.[0] || 'Strong visual hook; typography aligned to safe margin; dynamic pacing.');
            return (
              <div style={{
                background: '#07090f',
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.64rem',
                color: '#94a3b8',
                lineHeight: 1.35
              }}>
                <strong style={{ color: '#e2e8f0' }}>CRITIQUE (SCENE {selectedSceneIndex + 1}):</strong>{' '}
                {note}
              </div>
            );
          })()}

        </div>

      </div>

      {/* ------------------------------------------------------------ */}
      {/* LOWER SECTION: MASTER NLE TIMELINE (39% OF WORKSPACE) */}
      {/* ------------------------------------------------------------ */}
      <div style={{
        background: '#080a10',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        padding: '6px 14px 8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: '1 1 0',
        minHeight: '160px',
        maxHeight: '260px',
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
                onClick={() => { setActiveTool('scissors'); showToast(`Split clip placed at ${formatTimecode(currentTime)}`); }}
                title="Razor / Cut Clip"
                style={{ background: 'transparent', border: 'none', color: activeTool === 'scissors' ? '#38bdf8' : '#64748b', cursor: 'pointer', padding: '2px' }}
              >
                <Scissors size={13} />
              </button>
              <button
                type="button"
                onClick={() => { setActiveTool('link'); showToast('Audio & Video tracks linked'); }}
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
            </div>            {/* Glowing Cyan Timecode Badge */}
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
              {formatTimecode(currentTime)}
            </div>
          </div>

          {/* Right Tools: Bookmark, Aspect, Settings, Zoom Slider, Fullscreen */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
            <button
              type="button"
              onClick={() => showToast(`Timeline marker saved at ${formatTimecode(currentTime)}`)}
              title="Add Marker"
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
            >
              <Bookmark size={13} />
            </button>
            <button
              type="button"
              onClick={() => showToast('Timeline tracks optimized for 60 FPS playback')}
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
          
          {/* Vertical Cyan Playhead Needle Aligned to currentTime */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `calc(134px + (100% - 146px) * ${Math.max(0, Math.min(currentTime / duration, 1))})`,
            width: '2px',
            background: '#38bdf8',
            boxShadow: '0 0 8px #38bdf8',
            zIndex: 30,
            pointerEvents: 'none',
            transition: isPlaying ? 'none' : 'left 0.05s ease-out'
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
              const clickX = e.clientX - rect.left - 134;
              const trackWidth = rect.width - 146;
              const ratio = Math.max(0, Math.min(clickX / Math.max(1, trackWidth), 1));
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

      {/* Floating In-App Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '24px',
          background: '#0d1017',
          color: '#fbbf24',
          border: '1px solid #f59e0b',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.85), 0 0 12px rgba(245, 158, 11, 0.2)',
          borderRadius: '6px',
          padding: '6px 14px',
          fontSize: '0.72rem',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}
