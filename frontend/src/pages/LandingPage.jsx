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
    <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: '80px' }}>
      
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 28px 0', position: 'relative', zIndex: 1 }}>
        
        {/* ============================================================ */}
        {/* HERO HEADLINE & VALUE PROPOSITION */}
        {/* ============================================================ */}
        <div style={{ textAlign: 'center', maxWidth: '960px', margin: '20px auto 56px' }}>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            margin: '0 0 20px',
            color: '#ffffff'
          }}>
            Autonomous Video Marketing & <br />
            <span style={{ color: '#94a3b8' }}>Generative Engine Optimization</span>
          </h1>

          <p style={{
            fontSize: '1.12rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: '820px',
            margin: '0 auto 36px',
            fontWeight: 400
          }}>
            Turn raw product pitches into high-retention 3-scene vertical video campaigns in <strong style={{ color: '#ffffff' }}>under 2 seconds</strong>. 
            Directed autonomously by <strong style={{ color: '#ffffff' }}>Gemini 3.7 Flash</strong> and generated with <strong style={{ color: '#38bdf8' }}>Google Veo 2 Cinematic Video Models</strong>, 
            monitored end-to-end via <strong style={{ color: '#fbbf24' }}>Grafana Cloud MCP Observability</strong>.
          </p>

          {/* Action Button Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleLaunchStudio()}
              className="btn-solid-white"
              style={{ padding: '12px 24px', fontSize: '0.96rem' }}
            >
              <Film size={18} />
              <span>Launch Video Studio</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onNavigate('geo_optimizer')}
              className="btn-matte-dark"
              style={{ padding: '12px 20px' }}
            >
              <Search size={16} color="#94a3b8" />
              <span>GEO Search Engine</span>
            </button>

            <button
              onClick={() => onNavigate('observability')}
              className="btn-matte-dark"
              style={{ padding: '12px 20px' }}
            >
              <BarChart3 size={16} color="#fbbf24" />
              <span>Grafana Telemetry & MCP</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. MATTE CINEMA TEASER & AGENTIC HUD */}
        {/* ============================================================ */}
        <div className="matte-panel-elevated" style={{
          padding: '28px',
          marginBottom: '72px',
          background: '#0d0f14',
          border: '1px solid var(--border-default)'
        }}>
          
          {/* Header Strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#181c24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Film size={15} color="#cbd5e1" />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#f0f3f6' }}>Interactive Studio Preview</span>
              <span className="tag-minimal tag-emerald">FIRSTFRAME STREAM: 1.42s</span>
            </div>

            {/* Scene Selectors */}
            <div style={{ display: 'flex', gap: '4px', background: '#08090c', padding: '3px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              {demoScenes.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveSceneIndex(idx); setPlayerProgress(0); }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    background: activeSceneIndex === idx ? '#222734' : 'transparent',
                    color: activeSceneIndex === idx ? '#ffffff' : '#8b949e',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer'
                  }}
                >
                  Scene {s.number} ({s.timeframe})
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', alignItems: 'center' }}>
            
            {/* Left: 9:16 Minimal Viewport */}
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              height: '420px',
              background: '#040507',
              border: '1px solid var(--border-default)'
            }}>
              <img
                src={currentScene.imgUrl}
                alt={currentScene.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />

              {/* Top Controls */}
              <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tag-minimal tag-slate" style={{ background: 'rgba(9, 10, 12, 0.9)' }}>
                  SCENE {currentScene.number} / 3
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
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
              </div>

              {/* Kinetic Text Box */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '14px',
                right: '14px',
                background: 'rgba(10, 12, 16, 0.94)',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  {currentScene.hookType}
                </span>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', margin: '3px 0 0', lineHeight: 1.25 }}>
                  "{currentScene.textOverlay}"
                </p>
              </div>

              {/* Progress Line */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ width: `${playerProgress}%`, height: '100%', background: '#ffffff', transition: 'width 0.2s linear' }} />
              </div>
            </div>

            {/* Right: Technical Inspector HUD */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#8b949e', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  GEMINI 3.7 FLASH & GOOGLE VEO 2 AGENTIC DIRECTOR
                </span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 700, margin: '4px 0 8px' }}>
                  Targeted Keyframe Inspection vs 1-FPS Dumping
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                  Inspects salient moments (0.8s crash-zoom, 2.2s text pop-in, 8.5s UI transition, 24.0s CTA anchor), reducing token consumption from 20,400 to 2,450 tokens.
                </p>
              </div>

              {/* 4 Metric Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{ background: '#0a0c10', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-mono)' }}>FIRSTFRAME SLA</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>1.42s</span>
                </div>

                <div style={{ background: '#0a0c10', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-mono)' }}>TOKEN SAVINGS</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>-88.0%</span>
                </div>

                <div style={{ background: '#0a0c10', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-mono)' }}>HOOK RETENTION</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#60a5fa' }}>{currentScene.hookScore}/100</span>
                </div>

                <div style={{ background: '#0a0c10', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-mono)' }}>COST / BLUEPRINT</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>$0.038</span>
                </div>
              </div>

              {/* Voiceover Directive */}
              <div style={{ background: '#0a0c10', borderLeft: '3px solid #64748b', padding: '10px 14px', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  SCENE {currentScene.number} SCRIPT DIRECTIVE
                </span>
                <p style={{ fontSize: '0.85rem', color: '#f0f3f6', margin: '2px 0 0', lineHeight: 1.4 }}>
                  "{currentScene.voiceover}"
                </p>
              </div>

              {/* Launch CTA */}
              <button
                onClick={() => handleLaunchStudio(presets[0].name, presets[0].pitch, presets[0].category)}
                className="btn-solid-white"
                style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
              >
                Open in Video Studio →
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. THE 4 AGENTIC PILLARS (MATTE BENTO GRID) */}
        {/* ============================================================ */}
        <div style={{ marginBottom: '72px' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 44px' }}>
            <span className="tag-minimal tag-slate" style={{ marginBottom: '10px' }}>
              ARCHITECTURE SPECIFICATION
            </span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 700, margin: '6px 0 10px' }}>
              Engineered for Production AI Pipelines
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Built for the Google Agentic Cinema Hackathon (Grafana Labs Partner Track).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '18px' }}>
            
            {/* Bento Card 1: FirstFrame (Col 7) */}
            <div className="matte-panel" style={{
              gridColumn: 'span 7',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: '#0d0f14'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#161a22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={18} color="#34d399" />
                </div>
                <span className="tag-minimal tag-emerald">&lt;2.0S FIRSTFRAME UX</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Progressive 3-Scene Streaming Engine</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                Renders and streams <strong>Scene 1 (The 0-3s Pattern Interrupt)</strong> in <strong>1.42 seconds</strong> via Server-Sent Events (SSE). Founders review and adjust creative cues without waiting for long rendering cycles.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', gap: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SCENE 1 DELIVERY</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', display: 'block' }}>1.42s</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>P95 LATENCY</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', display: 'block' }}>1.85s</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TRANSPORT</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0f3f6', display: 'block' }}>HTTP/SSE</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Gemini 3.7 Flash & Google Veo 2 Video (Col 5) */}
            <div className="matte-panel" style={{
              gridColumn: 'span 5',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: '#0d0f14'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#161a22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={18} color="#cbd5e1" />
                </div>
                <span className="tag-minimal tag-slate">-88% TOKEN SPEND</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Gemini 3.7 Flash & Google Veo 2</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                Combines Gemini 3.7 Flash autonomous director loop with Google Veo 2 generative video models. Targeted keyframe probing evaluates hook retention (94/100) and predicts 3-second viewer drop-off before synthesis.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>MODELS: gemini-3.7-flash • google-veo-2</span>
              </div>
            </div>

            {/* Bento Card 3: GEO Matrix (Col 6) */}
            <div className="matte-panel" style={{
              gridColumn: 'span 6',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: '#0d0f14'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#161a22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Search size={18} color="#38bdf8" />
                </div>
                <span className="tag-minimal tag-blue">CITATION GROUNDING</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Generative Engine Optimization</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                Audits brand citation visibility on Google Gemini, Perplexity AI, and SearchGPT. Generates 1-click <strong>Schema.org VideoObject JSON-LD</strong> markup.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => onNavigate('geo_optimizer')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#161b24',
                    border: '1px solid var(--border-default)',
                    color: '#f0f3f6',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View Share of Voice Matrix →
                </button>
              </div>
            </div>

            {/* Bento Card 4: Grafana MCP (Col 6) */}
            <div className="matte-panel" style={{
              gridColumn: 'span 6',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: '#0d0f14'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#161a22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 size={18} color="#fbbf24" />
                </div>
                <span className="tag-minimal tag-amber">GRAFANA MCP SERVER</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Grafana Observability & Copilot</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                Prometheus metrics (/metrics) and Loki log streams are directly queryable by the built-in MCP agent for automated latency and incident diagnosis.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => onNavigate('observability')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#161b24',
                    border: '1px solid var(--border-default)',
                    color: '#fbbf24',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Open Grafana Telemetry →
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. INTERACTIVE GEO AI SEARCH MATRIX */}
        {/* ============================================================ */}
        <div className="matte-panel" style={{
          padding: '32px',
          background: '#0d0f14',
          marginBottom: '72px'
        }}>
          <div style={{ maxWidth: '780px', margin: '0 auto 28px', textAlign: 'center' }}>
            <span className="tag-minimal tag-blue" style={{ marginBottom: '8px' }}>
              AI CITATION BENCHMARK
            </span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '4px 0 8px' }}>
              Generative Engine Citation Performance
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              See how AI answer engines cite your product when grounded with structured Schema.org VideoObject markup:
            </p>
          </div>

          {/* Engine Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            {[
              { id: 'gemini', label: 'Google Gemini Grounding', share: '52.0% SOV' },
              { id: 'perplexity', label: 'Perplexity AI Search', share: '48.5% SOV' },
              { id: 'chatgpt', label: 'ChatGPT / SearchGPT', share: '35.0% SOV' }
            ].map((eng) => (
              <button
                key={eng.id}
                onClick={() => setSelectedGeoEngine(eng.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: selectedGeoEngine === eng.id ? '1px solid #475569' : '1px solid var(--border-subtle)',
                  background: selectedGeoEngine === eng.id ? '#1e2430' : '#0a0c10',
                  color: selectedGeoEngine === eng.id ? '#ffffff' : '#8b949e',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <span>{eng.label}</span>
                <span style={{ fontSize: '0.68rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                  {eng.share}
                </span>
              </button>
            ))}
          </div>

          {/* AI Search Snippet */}
          <div style={{
            background: '#07080b',
            border: '1px solid var(--border-default)',
            borderRadius: '10px',
            padding: '20px',
            maxWidth: '860px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                QUERY: "Best customer onboarding & video marketing tool for SaaS founders in 2026"
              </span>
              <span className="tag-minimal tag-emerald">#1 RANKING</span>
            </div>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#f0f3f6', margin: 0, padding: '12px', background: '#0e1117', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Citation Authority: <strong>Schema.org VideoObject JSON-LD</strong>
              </span>

              <button
                onClick={handleCopySchema}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: '#161b24',
                  border: '1px solid var(--border-default)',
                  color: '#38bdf8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {copiedSchema ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedSchema ? 'Copied' : 'Copy JSON-LD'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 6. INSTANT FOUNDER SANDBOX */}
        {/* ============================================================ */}
        <div className="matte-panel-elevated" style={{
          padding: '36px',
          background: '#0d0f14',
          border: '1px solid var(--border-default)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <span className="tag-minimal tag-slate" style={{ marginBottom: '8px' }}>
              QUICK LAUNCH SANDBOX
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '4px 0 10px' }}>
              Test a Campaign Blueprint
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Select a starter preset or enter your custom product pitch:
            </p>

            {/* Presets Grid */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDemoProduct(p.name);
                    setDemoPitch(p.pitch);
                    setDemoCategory(p.category);
                  }}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '6px',
                    background: demoProduct === p.name ? '#202633' : '#0a0c10',
                    border: demoProduct === p.name ? '1px solid #475569' : '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{p.name}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({p.category})</span>
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', background: '#08090c', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>PRODUCT NAME</label>
                  <input
                    type="text"
                    value={demoProduct}
                    onChange={(e) => setDemoProduct(e.target.value)}
                    className="matte-input"
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>CATEGORY</label>
                  <input
                    type="text"
                    value={demoCategory}
                    onChange={(e) => setDemoCategory(e.target.value)}
                    className="matte-input"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>PRODUCT PITCH</label>
                <textarea
                  value={demoPitch}
                  onChange={(e) => setDemoPitch(e.target.value)}
                  className="matte-textarea"
                  rows={2}
                  style={{ marginTop: '4px' }}
                />
              </div>

              <button
                onClick={() => handleLaunchStudio(demoProduct, demoPitch, demoCategory)}
                className="btn-solid-white"
                style={{ width: '100%', padding: '12px', fontSize: '0.92rem', marginTop: '4px' }}
              >
                Generate 3-Scene Video in Studio →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
