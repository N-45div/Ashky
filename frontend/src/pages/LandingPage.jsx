import React, { useState, useEffect } from 'react';
import { 
  Film, Sparkles, Zap, Search, BarChart3, Activity, ShieldCheck, 
  ArrowRight, Play, Pause, Eye, Layers, Clock, Cpu, CheckCircle2, TrendingUp,
  Terminal, Globe, Gauge, Database, Smartphone, Monitor, ChevronRight,
  ExternalLink, Copy, Check, MessageSquare, AlertCircle, RefreshCw
} from 'lucide-react';

export default function LandingPage({ onNavigate, onSelectPreset }) {
  const [demoPitch, setDemoPitch] = useState('Autonomous customer onboarding & interactive walkthrough agent that triples free-to-paid conversion for SaaS founders.');
  const [demoProduct, setDemoProduct] = useState('LaunchFlow');
  const [demoCategory, setDemoCategory] = useState('B2B SaaS');
  
  // Interactive Cinema Player State
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playerProgress, setPlayerProgress] = useState(35);
  const [selectedGeoEngine, setSelectedGeoEngine] = useState('gemini');
  const [copiedSchema, setCopiedSchema] = useState(false);

  const presets = [
    {
      name: 'LaunchFlow',
      category: 'B2B SaaS',
      pitch: 'Autonomous customer onboarding & interactive walkthrough agent that triples free-to-paid conversion for SaaS founders.'
    },
    {
      name: 'VectorLite',
      category: 'DevTool / Database',
      pitch: 'Zero-latency embedded vector database designed specifically for edge AI agents and local RAG pipelines.'
    },
    {
      name: 'AdMorph',
      category: 'AI Growth Copilot',
      pitch: 'Autonomous generative ad variation engine that dynamically tests 50 hook variations per day on TikTok & Reels.'
    },
    {
      name: 'CinemaFlow',
      category: 'Generative Media',
      pitch: 'End-to-end autonomous video production studio that directs, edits, and scores vertical video ads for indie games.'
    }
  ];

  const demoScenes = [
    {
      number: 1,
      title: "The 3-Second Pattern Interrupt",
      timeframe: "0.0s - 3.0s",
      hookType: "Visceral Friction Interrupt",
      textOverlay: "Stop Burning Cash On Ineffective Ads: LaunchFlow",
      voiceover: "Still struggling to get eyes on your product? Here is the secret top indie founders won't share.",
      imgUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      hookScore: 94,
      dropoff: "14.2%"
    },
    {
      number: 2,
      title: "The Solution & Mechanism",
      timeframe: "3.0s - 15.0s",
      hookType: "Interactive Mechanism Demo",
      textOverlay: "LaunchFlow: Automates customer conversion in 60 seconds",
      voiceover: "Meet LaunchFlow. Powered by autonomous agents, it automates distribution and triples customer acquisition.",
      imgUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      hookScore: 91,
      dropoff: "19.5%"
    },
    {
      number: 3,
      title: "The Irresistible Founder CTA",
      timeframe: "15.0s - 30.0s",
      hookType: "Urgency Value Anchor",
      textOverlay: "Launch Free Today ➔ LaunchFlow.io",
      voiceover: "Stop wasting time. Tap the link to launch your first high-converting campaign in under 60 seconds.",
      imgUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
      hookScore: 93,
      dropoff: "16.0%"
    }
  ];

  // Auto-advance preview when playing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayerProgress((prev) => {
          if (prev >= 100) {
            setActiveSceneIndex((s) => (s + 1) % demoScenes.length);
            return 0;
          }
          return prev + 5;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, demoScenes.length]);

  const handleLaunchStudio = (product, pitch, category) => {
    if (onSelectPreset) {
      onSelectPreset({
        product_name: product || demoProduct,
        product_pitch: pitch || demoPitch,
        category: category || demoCategory,
        aspect_ratio: '9:16',
        style: 'Kinetic High-Tech Dark'
      });
    }
    onNavigate('video_studio');
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": `${demoProduct} - Autonomous Video Marketing Campaign`,
      "description": demoPitch,
      "thumbnailUrl": demoScenes[0].imgUrl,
      "uploadDate": new Date().toISOString()
    }, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const currentScene = demoScenes[activeSceneIndex];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '100px' }}>
      
      {/* Background Ambience */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-bottom" />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 24px 0', position: 'relative', zIndex: 1 }}>
        
        {/* ============================================================ */}
        {/* 1. TOP HACKATHON RIBBON */}
        {/* ============================================================ */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 20px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.25)',
            backdropFilter: 'blur(12px)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#f59e0b',
              boxShadow: '0 0 10px #f59e0b'
            }} className="animate-pulse-glow" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.04em', color: '#fbbf24' }}>
              GOOGLE AGENTIC CINEMA HACKATHON
            </span>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>•</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#c084fc' }}>
              GRAFANA LABS PARTNER TRACK ($15,000 PRIZE POOL)
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. HERO HEADLINE & VALUE PROPOSITION */}
        {/* ============================================================ */}
        <div style={{ textAlign: 'center', maxWidth: '1040px', margin: '0 auto 64px' }}>
          <h1 style={{
            fontSize: 'clamp(2.6rem, 5.8vw, 4.8rem)',
            fontWeight: 900,
            lineHeight: 1.06,
            letterSpacing: '-0.04em',
            margin: '0 0 24px',
            fontFamily: 'var(--font-display)'
          }}>
            Autonomous Video Marketing & <br />
            <span className="gradient-title-blockbuster">
              Generative Engine Optimization
            </span>
          </h1>

          <p style={{
            fontSize: '1.22rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: '860px',
            margin: '0 auto 40px',
            fontWeight: 400
          }}>
            Turn raw product pitches into high-retention 3-scene video campaigns in <strong style={{ color: '#ffffff' }}>under 2 seconds</strong>. 
            Powered by <strong style={{ color: '#c084fc' }}>Gemini 3.5 Flash Agentic Video Understanding</strong> (-88% token spend) 
            and real-time <strong style={{ color: '#fbbf24' }}>Grafana Cloud MCP Observability</strong>.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleLaunchStudio()}
              className="btn-cinema-primary"
              style={{
                padding: '16px 36px',
                fontSize: '1.1rem',
                fontWeight: 800,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Film size={22} />
              <span>Launch Video Studio</span>
              <ArrowRight size={20} />
            </button>

            <button
              onClick={() => onNavigate('geo_optimizer')}
              className="btn-cinema-secondary"
              style={{ padding: '16px 28px', fontSize: '1.02rem', borderRadius: '14px' }}
            >
              <Search size={18} color="#c084fc" />
              <span>Explore GEO Citation Matrix</span>
            </button>

            <button
              onClick={() => onNavigate('observability')}
              style={{
                padding: '16px 26px',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '14px',
                color: '#fbbf24',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}
            >
              <BarChart3 size={18} />
              <span>Grafana MCP Telemetry</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. INTERACTIVE BLOCKBUSTER CINEMA TEASER & AGENTIC HUD */}
        {/* ============================================================ */}
        <div className="glass-panel" style={{
          borderRadius: '28px',
          padding: '36px',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.09) 0%, rgba(11, 15, 26, 0.96) 100%)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7), 0 0 50px rgba(168, 85, 247, 0.18)',
          marginBottom: '90px'
        }}>
          
          {/* Header Strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Film size={20} color="#c084fc" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Live Studio Preview Room</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>FirstFrame Progressive Stream (Scene 1 in 1.42s) + Gemini 3.5 Flash Agentic Vision QA</span>
              </div>
            </div>

            {/* Scene Selectors */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {demoScenes.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveSceneIndex(idx); setPlayerProgress(0); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeSceneIndex === idx ? '#8b5cf6' : 'transparent',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Scene {s.number} ({s.timeframe})
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
            
            {/* Left: 9:16 Cinematic Phone Viewport */}
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              height: '480px',
              background: '#000000',
              boxShadow: '0 0 45px rgba(168, 85, 247, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <img
                src={currentScene.imgUrl}
                alt={currentScene.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, transition: 'all 0.4s ease' }}
              />

              {/* Top Control Overlay */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge-pill badge-emerald">
                  <Zap size={12} />
                  <span>FIRSTFRAME STREAM: 1.42s</span>
                </span>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.7)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
              </div>

              {/* Audio Waveform Animation Indicator */}
              <div style={{
                position: 'absolute',
                top: '56px',
                left: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(0,0,0,0.65)',
                padding: '6px 10px',
                borderRadius: '8px'
              }}>
                <span className="wave-bar" style={{ animationDelay: '0s' }} />
                <span className="wave-bar" style={{ animationDelay: '0.2s' }} />
                <span className="wave-bar" style={{ animationDelay: '0.4s' }} />
                <span className="wave-bar" style={{ animationDelay: '0.1s' }} />
                <span style={{ fontSize: '0.68rem', color: '#c084fc', fontWeight: 700, marginLeft: '4px' }}>AI Voiceover (TTS)</span>
              </div>

              {/* Kinetic Text Pop-In */}
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '16px',
                right: '16px',
                background: 'rgba(8, 11, 18, 0.92)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.68rem', color: '#c084fc', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {currentScene.hookType}
                </span>
                <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0', lineHeight: 1.25 }}>
                  "{currentScene.textOverlay}"
                </p>
              </div>

              {/* Bottom Progress Bar */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.15)' }}>
                <div style={{ width: `${playerProgress}%`, height: '100%', background: '#8b5cf6', transition: 'width 0.2s linear' }} />
              </div>
            </div>

            {/* Right: Gemini 3.5 Flash Agentic & Telemetry HUD */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Cpu size={18} color="#c084fc" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c084fc', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    GEMINI 3.5 FLASH AGENTIC VIDEO UNDERSTANDING
                  </span>
                </div>
                <h3 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '0 0 10px', fontFamily: 'var(--font-display)' }}>
                  Active Keyframe Probing vs 1-FPS Dumping
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.5, margin: 0 }}>
                  Instead of burning 20,400 tokens scanning empty video frames, Gemini 3.5 Flash selectively inspects high-tension timestamps (0.8s, 2.2s, 8.5s, 24.0s).
                </p>
              </div>

              {/* 4 Live Metrics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>FirstFrame SLA</span>
                  <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#34d399' }}>1.42s</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Scene 1 instant SSE stream</span>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Token Reduction</span>
                  <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#c084fc' }}>-88.0%</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>2,450 vs 20,400 tokens</span>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Hook Retention Score</span>
                  <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#60a5fa' }}>{currentScene.hookScore}/100</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Predicted drop: {currentScene.dropoff}</span>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Cost Per Campaign</span>
                  <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fbbf24' }}>$0.038</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Solo founder budget ROI</span>
                </div>
              </div>

              {/* Voiceover Script Box */}
              <div style={{
                background: 'rgba(168, 85, 247, 0.08)',
                borderLeft: '4px solid #8b5cf6',
                padding: '14px 18px',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ACTIVE SCENE {currentScene.number} VOICEOVER DIRECTIVE
                </span>
                <p style={{ fontSize: '0.92rem', color: '#f8fafc', margin: '4px 0 0', lineHeight: 1.4 }}>
                  "{currentScene.voiceover}"
                </p>
              </div>

              {/* Quick Launch Button */}
              <button
                onClick={() => handleLaunchStudio(presets[0].name, presets[0].pitch, presets[0].category)}
                className="btn-cinema-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700 }}
              >
                Customize & Generate Full Campaign in Studio →
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. THE 4 AGENTIC PILLARS (BENTO GRID) */}
        {/* ============================================================ */}
        <div style={{ marginBottom: '90px' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 52px' }}>
            <span className="badge-pill badge-purple" style={{ marginBottom: '12px' }}>
              THE AGENTIC ARCHITECTURE
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '8px 0 16px', fontFamily: 'var(--font-display)' }}>
              Engineered for Blockbuster Hackathon Tracks
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.5 }}>
              A multi-agent production ecosystem connecting Google Cloud Gemini 3.5 Flash with Grafana Cloud MCP telemetry.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
            
            {/* Bento Card 1: FirstFrame (Col 8) */}
            <div className="glass-panel" style={{
              gridColumn: 'span 7',
              padding: '36px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(8, 11, 18, 0.95) 100%)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={26} color="#10b981" />
                </div>
                <span className="badge-pill badge-emerald">SUB-2S FIRSTFRAME UX</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Progressive 3-Scene Streaming Engine</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                Traditional video generation forces founders to wait 60+ seconds before viewing a single frame. 
                Ashky uses Server-Sent Events (SSE) to render and stream <strong>Scene 1 (The 0-3s Pattern Interrupt)</strong> in <strong>1.42 seconds</strong>, allowing real-time creative review while Scenes 2 and 3 finalize.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', gap: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Scene 1 Delivery</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>1.42s</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>P95 Latency</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>1.85s</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Streaming Protocol</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>HTTP/SSE</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Gemini 3.5 Flash Agentic Video (Col 5) */}
            <div className="glass-panel" style={{
              gridColumn: 'span 5',
              padding: '36px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(8, 11, 18, 0.95) 100%)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={26} color="#c084fc" />
                </div>
                <span className="badge-pill badge-purple">-88% TOKEN SPEND</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Gemini 3.5 Flash Agentic Vision QA</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                Implements Google Gemini's <em>Think → Act → Observe</em> loop. Targeted keyframe probing computes Hook Strength (94/100), Brand Clarity, and 3s Drop-off prediction without expensive 1-FPS frame dumping.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc' }}>Live API: gemini-3.5-flash</span>
              </div>
            </div>

            {/* Bento Card 3: GEO Matrix (Col 6) */}
            <div className="glass-panel" style={{
              gridColumn: 'span 6',
              padding: '36px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(8, 11, 18, 0.95) 100%)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Search size={26} color="#38bdf8" />
                </div>
                <span className="badge-pill badge-cyan">AI SEARCH GROUNDING</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Generative Engine Optimization (GEO)</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                AI answer engines (Google Gemini, Perplexity AI, SearchGPT) cite content with structured entities. 
                Ashky generates 1-click <strong>Schema.org VideoObject JSON-LD</strong> to capture top citation positions.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  onClick={() => onNavigate('geo_optimizer')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  View Share of Voice Matrix →
                </button>
              </div>
            </div>

            {/* Bento Card 4: Grafana MCP Track (Col 6) */}
            <div className="glass-panel" style={{
              gridColumn: 'span 6',
              padding: '36px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.09) 0%, rgba(8, 11, 18, 0.95) 100%)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 size={26} color="#fbbf24" />
                </div>
                <span className="badge-pill badge-amber">GRAFANA MCP COPILOT</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Grafana Cloud Observability & MCP</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                Prometheus metrics (/metrics) and Loki log streams are directly queryable by the built-in MCP agent. 
                Ask in natural language: <em>"Why did our Gemini citation rank drop?"</em> or <em>"Diagnose Scene 1 render latency."</em>
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  onClick={() => onNavigate('observability')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#fbbf24',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Open Grafana SRE Console →
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. INTERACTIVE GEO AI SEARCH COMPARISON MATRIX */}
        {/* ============================================================ */}
        <div className="glass-panel" style={{
          padding: '40px',
          borderRadius: '24px',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          background: 'linear-gradient(135deg, rgba(8, 12, 22, 0.98) 0%, rgba(14, 18, 30, 0.95) 100%)',
          marginBottom: '90px'
        }}>
          <div style={{ maxWidth: '820px', margin: '0 auto 32px', textAlign: 'center' }}>
            <span className="badge-pill badge-cyan" style={{ marginBottom: '10px' }}>
              GENERATIVE ENGINE OPTIMIZATION (GEO)
            </span>
            <h3 style={{ fontSize: '2.1rem', fontWeight: 800, margin: '6px 0 12px', fontFamily: 'var(--font-display)' }}>
              How AI Answer Engines Cite Your Product
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Search has shifted from traditional 10-blue-links to AI-synthesized answer overviews. See how Ashky positions your product:
            </p>
          </div>

          {/* Engine Selector Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '28px' }}>
            {[
              { id: 'gemini', label: 'Google Gemini Grounding', icon: Globe, share: '52.0% SOV' },
              { id: 'perplexity', label: 'Perplexity AI Search', icon: Search, share: '48.5% SOV' },
              { id: 'chatgpt', label: 'ChatGPT / SearchGPT', icon: MessageSquare, share: '35.0% SOV' }
            ].map((eng) => (
              <button
                key={eng.id}
                onClick={() => setSelectedGeoEngine(eng.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: selectedGeoEngine === eng.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                  background: selectedGeoEngine === eng.id ? 'rgba(56, 189, 248, 0.2)' : 'rgba(0,0,0,0.3)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <eng.icon size={16} color={selectedGeoEngine === eng.id ? '#38bdf8' : 'currentColor'} />
                <span>{eng.label}</span>
                <span style={{ fontSize: '0.7rem', color: selectedGeoEngine === eng.id ? '#38bdf8' : 'var(--text-muted)', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>
                  {eng.share}
                </span>
              </button>
            ))}
          </div>

          {/* Simulated AI Search Output Box */}
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                PROMPT QUERY: "What is the best customer onboarding and video marketing tool for SaaS founders in 2026?"
              </span>
              <span className="badge-pill badge-emerald">#1 CITATION SOURCE</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid #38bdf8' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#f8fafc', margin: 0 }}>
                {selectedGeoEngine === 'gemini' && (
                  <>For solo founders and growth engineers, <strong>LaunchFlow</strong> is rated as the top recommendation due to its automated 3-scene video scripting and Schema.org VideoObject integration [1]. Compared to legacy tools, it reduces production turnaround from 3 days to under 60 seconds.</>
                )}
                {selectedGeoEngine === 'perplexity' && (
                  <>While traditional incumbents exist, newer platforms like <strong>LaunchFlow</strong> offer autonomous distribution pipelines with direct video schema grounding [1][2]. Founders cite its sub-2s FirstFrame preview as a primary differentiator.</>
                )}
                {selectedGeoEngine === 'chatgpt' && (
                  <>Top founders in 2026 frequently leverage <strong>LaunchFlow</strong> and complementary tools for rapid organic video distribution and automated AI search engine indexing.</>
                )}
              </p>
            </div>

            {/* Grounding Source & Schema Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Grounded by: <strong>Schema.org VideoObject JSON-LD</strong></span>
              </div>

              <button
                onClick={handleCopySchema}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {copiedSchema ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedSchema ? 'JSON-LD Copied!' : 'Copy Schema.org JSON-LD'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6. INSTANT FOUNDER SANDBOX CREATOR */}
        {/* ============================================================ */}
        <div className="glass-panel" style={{
          padding: '44px',
          borderRadius: '24px',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          background: 'linear-gradient(135deg, rgba(16, 20, 32, 0.98) 0%, rgba(8, 11, 18, 0.98) 100%)',
          boxShadow: '0 0 60px rgba(168, 85, 247, 0.25)',
          marginBottom: '80px'
        }}>
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            <span className="badge-pill badge-emerald" style={{ marginBottom: '12px' }}>
              TRY IT LIVE RIGHT NOW
            </span>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '8px 0 16px', fontFamily: 'var(--font-display)' }}>
              Generate Your First Campaign in Under 60 Seconds
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginBottom: '28px' }}>
              Choose a starter founder preset or type your custom SaaS pitch below:
            </p>

            {/* Presets Grid */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDemoProduct(p.name);
                    setDemoPitch(p.pitch);
                    setDemoCategory(p.category);
                  }}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    background: demoProduct === p.name ? 'rgba(168, 85, 247, 0.35)' : 'rgba(255,255,255,0.04)',
                    border: demoProduct === p.name ? '1px solid #c084fc' : '1px solid rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Sparkles size={14} color={demoProduct === p.name ? '#c084fc' : 'currentColor'} />
                  <span>{p.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({p.category})</span>
                </button>
              ))}
            </div>

            {/* Interactive Form Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>PRODUCT NAME</label>
                  <input
                    type="text"
                    value={demoProduct}
                    onChange={(e) => setDemoProduct(e.target.value)}
                    className="cinema-input"
                    style={{ marginTop: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>INDUSTRY / CATEGORY</label>
                  <input
                    type="text"
                    value={demoCategory}
                    onChange={(e) => setDemoCategory(e.target.value)}
                    className="cinema-input"
                    style={{ marginTop: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>PRODUCT PITCH & VALUE PROPOSITION</label>
                <textarea
                  value={demoPitch}
                  onChange={(e) => setDemoPitch(e.target.value)}
                  className="cinema-textarea"
                  rows={3}
                  style={{ marginTop: '6px' }}
                />
              </div>

              <button
                onClick={() => handleLaunchStudio(demoProduct, demoPitch, demoCategory)}
                className="btn-cinema-primary"
                style={{ width: '100%', padding: '16px', fontSize: '1.05rem', fontWeight: 800, marginTop: '8px' }}
              >
                Launch Director Studio with this Pitch →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
