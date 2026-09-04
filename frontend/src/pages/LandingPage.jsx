import React, { useState, useEffect } from 'react';
import { 
  Film, Search, BarChart3, 
  ArrowRight, Play, Pause, Eye, Clock, CheckCircle2, TrendingUp,
  RefreshCw, ArrowDown
} from 'lucide-react';

export default function LandingPage({ onNavigate, onSelectPreset }) {
  // Default Demo Campaign: Neon Circuit (Indie Game)
  const defaultCampaign = {
    name: 'Neon Circuit',
    category: 'Indie Game',
    pitch: 'A neon-noir racing roguelite where every failed run rewrites the city and reveals a new piece of the conspiracy.',
    aspect_ratio: '9:16',
    style: 'Neon-Noir Cyberpunk Cinematic',
    campaign_goal: 'Drive wishlists before launch',
    target_audience: 'Roguelite and cyberpunk fans'
  };

  const [demoProduct, setDemoProduct] = useState(defaultCampaign.name);
  const [demoCategory, setDemoCategory] = useState(defaultCampaign.category);
  const [demoPitch, setDemoPitch] = useState(defaultCampaign.pitch);
  
  // Interactive Cinema Player State
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playerProgress, setPlayerProgress] = useState(45);

  const presets = [
    {
      name: 'Neon Circuit',
      category: 'Indie Game',
      pitch: 'A neon-noir racing roguelite where every failed run rewrites the city and reveals a new piece of the conspiracy.'
    },
    {
      name: 'LaunchFlow',
      category: 'B2B SaaS',
      pitch: 'Autonomous customer onboarding & interactive walkthrough agent that triples free-to-paid conversion for SaaS founders.'
    },
    {
      name: 'VectorLite',
      category: 'DevTool',
      pitch: 'Zero-latency embedded vector database designed specifically for edge AI agents and local RAG pipelines.'
    }
  ];

  const neonCircuitScenes = [
    {
      number: 1,
      title: "The 3-Second Pattern Interrupt",
      timeframe: "0.0s - 3.0s",
      hookType: "Crash Zoom Kinetic Hook",
      textOverlay: "Every Crash Rewrites The City: Neon Circuit",
      voiceover: "What if dying wasn't game over—but the only way to expose the city's dark syndicate?",
      imgUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
      hookScore: 94,
      dropoff: "13.8%"
    },
    {
      number: 2,
      title: "Procedural Racing & Lore",
      timeframe: "3.0s - 15.0s",
      hookType: "High-Speed Gameplay Reveal",
      textOverlay: "120+ Procedural Neon Tracks • Uncover The Conspiracy",
      voiceover: "Tear through neon-drenched sectors, hijack corporate data caches, and unlock experimental anti-grav hovercraft.",
      imgUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
      hookScore: 91,
      dropoff: "18.2%"
    },
    {
      number: 3,
      title: "The Wishlist Call-to-Action",
      timeframe: "15.0s - 30.0s",
      hookType: "Wishlist Value Anchor",
      textOverlay: "Wishlist Now On Steam ➔ Demo Dropping Oct 12",
      voiceover: "Wishlist Neon Circuit on Steam today and get exclusive access to the closed alpha telemetry playtest.",
      imgUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
      hookScore: 95,
      dropoff: "15.0%"
    }
  ];

  // Auto-advance preview when playing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayerProgress((prev) => {
          if (prev >= 100) {
            setActiveSceneIndex((s) => (s + 1) % neonCircuitScenes.length);
            return 0;
          }
          return prev + 5;
        });
      }, 220);
    }
    return () => clearInterval(interval);
  }, [isPlaying, neonCircuitScenes.length]);

  const handleLaunchStudio = (presetObj) => {
    const selected = presetObj || {
      product_name: demoProduct,
      product_pitch: demoPitch,
      category: demoCategory,
      aspect_ratio: '9:16',
      style: 'Neon-Noir Cyberpunk Cinematic',
      campaign_goal: 'Drive wishlists before launch',
      target_audience: 'Roguelite and cyberpunk fans'
    };

    if (onSelectPreset) {
      onSelectPreset(selected);
    }
    onNavigate('video_studio');
  };

  const currentScene = neonCircuitScenes[activeSceneIndex];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '60px' }}>
      
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '32px 24px 0', position: 'relative', zIndex: 1 }}>
        
        {/* ============================================================ */}
        {/* 1. HERO PROMISE & VALUE PROPOSITION */}
        {/* ============================================================ */}
        <div style={{ textAlign: 'center', maxWidth: '980px', margin: '16px auto 48px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '20px',
            fontSize: '0.8rem',
            color: '#94a3b8'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
            <span style={{ fontWeight: 600, color: '#f8fafc' }}>Autonomous Video Growth Studio</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span>Gemini 3.8 Flash & Grafana Cloud</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.2vw, 4.4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            margin: '0 0 20px',
            color: '#ffffff'
          }}>
            Create videos people watch—<br />
            <span style={{ color: '#94a3b8' }}>and AI answers can find.</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            color: '#9aa4b2',
            maxWidth: '820px',
            margin: '0 auto 36px',
            fontWeight: 400
          }}>
            Ashky turns one product pitch into a high-retention video campaign, reviews its opening hook, prepares it for AI-search discovery, and continuously improves the campaign through a Grafana-monitored production pipeline.
          </p>

          {/* Action CTAs: One dominant, one quieter secondary */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '22px' }}>
            <button
              onClick={() => handleLaunchStudio()}
              className="btn-solid-white"
              style={{ padding: '12px 26px', fontSize: '0.98rem', fontWeight: 600 }}
            >
              <Film size={18} />
              <span>Build a campaign</span>
              <ArrowRight size={16} />
            </button>

            <a
              href="#growth-loop"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                fontSize: '0.92rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              <span>See the growth loop</span>
              <ArrowDown size={14} />
            </a>
          </div>

          {/* Trust line */}
          <div style={{
            fontSize: '0.78rem',
            color: '#64748b',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.02em'
          }}>
            Gemini 3.8 Flash · Veo on Google Cloud · Grafana Cloud MCP
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. INTERACTIVE CAMPAIGN PREVIEW SURFACE: NEON CIRCUIT LAUNCH */}
        {/* ============================================================ */}
        <div className="matte-panel-elevated" style={{
          padding: '28px',
          marginBottom: '80px',
          background: '#0d0f14',
          border: '1px solid var(--border-default)',
          borderRadius: '12px'
        }}>
          
          {/* Top Campaign Surface Banner */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '22px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#161a22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa'
              }}>
                <Film size={17} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.02rem', fontWeight: 700, color: '#f0f3f6' }}>
                    Neon Circuit Launch
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#94a3b8',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    Indie Game · 9:16 Teaser
                  </span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  A neon-noir racing roguelite where every failed run rewrites the city.
                </span>
              </div>
            </div>

            {/* Pipeline status badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.74rem',
              color: '#34d399',
              background: 'rgba(16, 185, 129, 0.08)',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontFamily: 'var(--font-mono)'
            }}>
              <span className="status-dot status-dot-emerald" />
              <span>Pipeline healthy · Grafana Cloud</span>
            </div>
          </div>

          {/* Split Layout: Left 9:16 Viewport & Right Campaign Lifecycle Surface */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '28px', alignItems: 'start' }}>
            
            {/* Left: 9:16 Vertical Video Viewport */}
            <div style={{
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
              height: '460px',
              background: '#040507',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img
                src={currentScene.imgUrl}
                alt={currentScene.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }}
              />

              {/* Top Controls */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tag-minimal tag-slate" style={{ background: 'rgba(9, 10, 12, 0.9)' }}>
                  SCENE {currentScene.number} OF 3
                </span>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    background: 'rgba(9, 10, 12, 0.85)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title={isPlaying ? "Pause preview" : "Play preview"}
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
              </div>

              {/* Kinetic Text Overlay Box */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '12px',
                right: '12px',
                background: 'rgba(10, 12, 16, 0.92)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.64rem', color: '#60a5fa', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  {currentScene.hookType}
                </span>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', margin: '3px 0 0', lineHeight: 1.3 }}>
                  "{currentScene.textOverlay}"
                </p>
              </div>

              {/* Progress Line */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ width: `${playerProgress}%`, height: '100%', background: '#60a5fa', transition: 'width 0.2s linear' }} />
              </div>
            </div>

            {/* Right: Unified Campaign Lifecycle Surface */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Lifecycle Stage Steps */}
              <div style={{
                background: '#0a0c10',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '16px'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
                  Campaign Pipeline Lifecycle
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.86rem', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#34d399" />
                      <span style={{ fontWeight: 500, color: '#f0f3f6' }}>Brief</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#34d399', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Complete</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.86rem', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#34d399" />
                      <span style={{ fontWeight: 500, color: '#f0f3f6' }}>Scene plan</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#34d399', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Complete</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.86rem', padding: '6px 8px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw size={14} color="#60a5fa" className="animate-spin" />
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>Render</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#60a5fa', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>In progress · 2/3 scenes</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.86rem', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={15} color="#94a3b8" />
                      <span style={{ fontWeight: 500, color: '#94a3b8' }}>Hook review</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>Queued</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.86rem', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Search size={15} color="#94a3b8" />
                      <span style={{ fontWeight: 500, color: '#94a3b8' }}>AI discovery</span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>Queued</span>
                  </div>
                </div>
              </div>

              {/* 4 Outcome Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{ background: '#0a0c10', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontFamily: 'var(--font-mono)' }}>FIRST SCENE SLA</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>1.42s</span>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Target &lt;2.0s</span>
                </div>

                <div style={{ background: '#0a0c10', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontFamily: 'var(--font-mono)' }}>HOOK STRENGTH</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#60a5fa' }}>{currentScene.hookScore}/100</span>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Predicted drop: {currentScene.dropoff}</span>
                </div>

                <div style={{ background: '#0a0c10', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontFamily: 'var(--font-mono)' }}>DISCOVERY COVERAGE</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#cbd5e1' }}>11 / 24</span>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Tracked AI queries</span>
                </div>

                <div style={{ background: '#0a0c10', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontFamily: 'var(--font-mono)' }}>ESTIMATED COST</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fbbf24' }}>$0.038</span>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Per full campaign</span>
                </div>
              </div>

              {/* Direct Link to Studio */}
              <button
                onClick={() => handleLaunchStudio()}
                className="btn-solid-white"
                style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
              >
                Open Neon Circuit in Video Studio →
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. THE 4-STAGE GROWTH LOOP: CREATE -> REVIEW -> DISCOVER -> IMPROVE */}
        {/* ============================================================ */}
        <div id="growth-loop" style={{ marginBottom: '80px', scrollMarginTop: '80px' }}>
          <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 40px' }}>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#60a5fa',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontFamily: 'var(--font-mono)'
            }}>
              THE AUTONOMOUS GROWTH LOOP
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 700, margin: '8px 0 12px', color: '#ffffff' }}>
              One loop for retention, discovery, and reliability
            </h2>
            <p style={{ color: '#9aa4b2', fontSize: '0.96rem', margin: 0 }}>
              From initial hook design to AI search citation visibility, monitored continuously by Grafana Cloud.
            </p>
          </div>

          {/* 4 Connected Cards (Horizontal on desktop, vertical on mobile) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            position: 'relative'
          }}>
            {/* Stage 1: Create */}
            <div className="matte-panel" style={{ padding: '22px', background: '#0d0f14', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>01 / CREATE</span>
                <Film size={18} color="#60a5fa" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                3-Scene Campaign Blueprint
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#9aa4b2', lineHeight: 1.5, margin: 0 }}>
                Gemini 3.8 Flash structures a hook, core mechanism, and call-to-action. Scene 1 delivers in 1.42s while later scenes stream.
              </p>
            </div>

            {/* Stage 2: Review */}
            <div className="matte-panel" style={{ padding: '22px', background: '#0d0f14', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>02 / REVIEW</span>
                <Eye size={18} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                Pre-Launch Hook Scoring
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#9aa4b2', lineHeight: 1.5, margin: 0 }}>
                Evaluates opening hook strength, text contrast, brand clarity, and predicted 3-second drop-off before synthesis finishes.
              </p>
            </div>

            {/* Stage 3: Discover */}
            <div className="matte-panel" style={{ padding: '22px', background: '#0d0f14', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>03 / DISCOVER</span>
                <Search size={18} color="#38bdf8" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                AI Citation Visibility
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#9aa4b2', lineHeight: 1.5, margin: 0 }}>
                Probes multi-model answer shares, detects competitor wins across consistent prompt sets, and exports VideoObject Schema.org JSON-LD.
              </p>
            </div>

            {/* Stage 4: Improve */}
            <div className="matte-panel" style={{ padding: '22px', background: '#0d0f14', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>04 / IMPROVE</span>
                <TrendingUp size={18} color="#fbbf24" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                Closed-Loop Variations
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#9aa4b2', lineHeight: 1.5, margin: 0 }}>
                Turns discovery gaps and low-retention scenes into targeted video briefs, continuously refining performance and conversion.
              </p>
            </div>
          </div>

          {/* Grafana Observability Anchor Beneath all 4 stages */}
          <div style={{
            marginTop: '16px',
            padding: '14px 20px',
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart3 size={17} color="#fbbf24" />
              <span style={{ fontSize: '0.84rem', color: '#fef3c7', fontWeight: 500 }}>
                <strong>Grafana Cloud</strong> observes every planning step, render latency, token cost, and discovery probe across all four stages.
              </span>
            </div>
            <button
              onClick={() => onNavigate('observability')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fbbf24',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Explore Pipeline Ops</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. GRAFANA RELIABILITY STORY & INCIDENT NARRATIVE */}
        {/* ============================================================ */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#fbbf24',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontFamily: 'var(--font-mono)'
            }}>
              MANAGED AI RELIABILITY
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 700, margin: '8px 0 12px', color: '#ffffff' }}>
              A managed AI campaign pipeline, not a black box.
            </h2>
            <p style={{ color: '#9aa4b2', fontSize: '0.96rem', margin: 0 }}>
              Ashky traces every planning step, model call, tool execution, render job, quality check, and discovery probe. Grafana Cloud helps the Pipeline Agent detect failures, investigate the evidence, recover the affected stage, and verify the result.
            </p>
          </div>

          {/* Compact Incident Narrative Card */}
          <div className="matte-panel" style={{
            background: '#0d0f14',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '10px',
            padding: '24px',
            maxWidth: '920px',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#34d399'
                }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f0f3f6' }}>
                  Incident: Scene 2 render exceeded latency target
                </span>
              </div>
              <span style={{
                fontSize: '0.72rem',
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)'
              }}>
                RESOLVED AUTOMATICALLY
              </span>
            </div>

            {/* Narrative table */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              padding: '16px',
              background: '#090a0d',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontSize: '0.84rem',
              marginBottom: '16px'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontFamily: 'var(--font-mono)' }}>DETECTED</span>
                <span style={{ fontWeight: 600, color: '#cbd5e1' }}>14:32:08 UTC</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontFamily: 'var(--font-mono)' }}>ROOT CAUSE</span>
                <span style={{ color: '#f87171' }}>Provider throttling after burst</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontFamily: 'var(--font-mono)' }}>ACTION TAKEN</span>
                <span style={{ color: '#38bdf8' }}>Requeued Scene 2; preserved Scene 1</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontFamily: 'var(--font-mono)' }}>OUTCOME</span>
                <span style={{ fontWeight: 700, color: '#34d399' }}>Completed in 41s</span>
              </div>
            </div>

            {/* Evidence Consultation Strip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: '#94a3b8',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>EVIDENCE CONSULTED:</span>
                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>Prometheus SLO breach</span>
                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>Loki throttle log</span>
                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>Tempo trace ID 8f9b...</span>
              </div>

              <button
                onClick={() => onNavigate('observability')}
                className="btn-matte-dark"
                style={{ padding: '4px 12px', fontSize: '0.76rem' }}
              >
                Inspect in Pipeline Ops
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. QUICK-START CAMPAIGN SANDBOX */}
        {/* ============================================================ */}
        <div style={{
          background: '#0d0f14',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '32px',
          marginBottom: '60px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.74rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              QUICK-START CAMPAIGN SANDBOX
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '4px 0', color: '#ffffff' }}>
              Start with a verified product brief
            </h3>
            <p style={{ color: '#9aa4b2', fontSize: '0.88rem', margin: 0 }}>
              Select a pre-tuned campaign blueprint or customize the pitch directly.
            </p>
          </div>

          {/* Presets Row */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {presets.map((p) => {
              const isSelected = demoProduct === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => {
                    setDemoProduct(p.name);
                    setDemoCategory(p.category);
                    setDemoPitch(p.pitch);
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{p.name}</span>
                  <span style={{ fontSize: '0.7rem', color: isSelected ? '#93c5fd' : '#64748b' }}>({p.category})</span>
                </button>
              );
            })}
          </div>

          {/* Editable Pitch Sandbox */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '4px' }}>
                  CAMPAIGN PRODUCT
                </label>
                <input
                  type="text"
                  value={demoProduct}
                  onChange={(e) => setDemoProduct(e.target.value)}
                  className="matte-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '4px' }}>
                  CATEGORY
                </label>
                <input
                  type="text"
                  value={demoCategory}
                  onChange={(e) => setDemoCategory(e.target.value)}
                  className="matte-input"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '4px' }}>
                PRODUCT PITCH / CORE HOOK
              </label>
              <textarea
                value={demoPitch}
                onChange={(e) => setDemoPitch(e.target.value)}
                className="matte-input"
                rows={2}
                style={{ width: '100%', resize: 'none' }}
              />
            </div>

            <button
              onClick={() => handleLaunchStudio()}
              className="btn-solid-white"
              style={{ padding: '12px', fontSize: '0.94rem', fontWeight: 600, marginTop: '4px' }}
            >
              <span>Build this campaign in Video Studio →</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6. CONNECTED SERVICES SPECIFICATION */}
        {/* ============================================================ */}
        <div style={{
          padding: '24px',
          background: '#090a0d',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Google Cloud
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <span>Gemini 3.8 Flash Director & Critic</span>
                <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <span>Veo on Google Cloud Video Synthesis</span>
                <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Active</span>
              </div>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              Grafana Cloud
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <span>MCP Connection</span>
                <span style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <span>Prometheus, Loki, Tempo</span>
                <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Streaming</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
