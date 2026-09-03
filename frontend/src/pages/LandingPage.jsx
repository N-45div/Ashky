import React, { useState } from 'react';
import { 
  Film, Sparkles, Zap, Search, BarChart3, Activity, ShieldCheck, 
  ArrowRight, Play, Eye, Layers, Clock, Cpu, CheckCircle2, TrendingUp,
  Terminal, Globe, Gauge, Database, Smartphone, Monitor, ChevronRight
} from 'lucide-react';

export default function LandingPage({ onNavigate, onSelectPreset }) {
  const [demoPitch, setDemoPitch] = useState('Autonomous customer onboarding & interactive walkthrough agent that triples free-to-paid conversion for SaaS founders.');
  const [demoProduct, setDemoProduct] = useState('LaunchFlow');
  const [demoCategory, setDemoCategory] = useState('B2B SaaS');
  const [activeFeatureTab, setActiveFeatureTab] = useState('firstframe');

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
    }
  ];

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

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Glows & Ambience */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1000px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 1 }}>
        
        {/* ============================================================ */}
        {/* HACKATHON RIBBON & HERO HEADLINE */}
        {/* ============================================================ */}
        <div style={{ textAlign: 'center', maxWidth: '980px', margin: '0 auto 60px' }}>
          
          {/* Hackathon Ribbon */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 0 24px rgba(245, 158, 11, 0.2)',
            marginBottom: '28px'
          }}>
            <Sparkles size={16} color="#fbbf24" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.04em', color: '#fbbf24' }}>
              GOOGLE AGENTIC CINEMA HACKATHON
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#c084fc' }}>
              GRAFANA LABS PARTNER TRACK
            </span>
          </div>

          {/* Master Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: '-0.04em',
            margin: '0 0 24px',
            fontFamily: 'var(--font-display)'
          }}>
            Autonomous Video Marketing & <br />
            <span style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(168, 85, 247, 0.3)'
            }}>
              AI Search Optimization (GEO)
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.2rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: '820px',
            margin: '0 auto 36px',
            fontWeight: 400
          }}>
            Transform raw product pitches into viral, high-retention 3-scene video campaigns in <strong style={{ color: '#ffffff' }}>under 2 seconds</strong>. 
            Powered by <strong style={{ color: '#c084fc' }}>Gemini 3.5 Flash Agentic Video Understanding</strong> (-88% token spend) 
            and real-time <strong style={{ color: '#fbbf24' }}>Grafana Cloud MCP Observability</strong>.
          </p>

          {/* Action Button Group */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleLaunchStudio()}
              className="btn-cinema-primary"
              style={{
                padding: '16px 32px',
                fontSize: '1.05rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '12px',
                boxShadow: '0 0 35px rgba(139, 92, 246, 0.45)'
              }}
            >
              <Film size={20} />
              <span>Launch Video Studio</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => onNavigate('geo_optimizer')}
              style={{
                padding: '16px 28px',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            >
              <Search size={18} color="#c084fc" />
              <span>Explore GEO Citation Matrix</span>
            </button>

            <button
              onClick={() => onNavigate('observability')}
              style={{
                padding: '16px 24px',
                fontSize: '0.95rem',
                fontWeight: 600,
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '12px',
                color: '#fbbf24',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <BarChart3 size={18} />
              <span>Grafana MCP Telemetry</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CINEMATIC LIVE PREVIEW & INTERACTIVE HUD TEASER */}
        {/* ============================================================ */}
        <div className="glass-panel" style={{
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(10, 12, 18, 0.95) 100%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(139, 92, 246, 0.15)',
          marginBottom: '80px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
            
            {/* Left: Interactive 9:16 Video Player Card */}
            <div style={{
              position: 'relative',
              borderRadius: '18px',
              overflow: 'hidden',
              height: '460px',
              background: '#000000',
              boxShadow: '0 0 35px rgba(139, 92, 246, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
                alt="Cinema Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />

              {/* Floating Top Badge */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                <span style={{
                  background: 'rgba(10, 12, 18, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Zap size={12} />
                  <span>FIRSTFRAME STREAM: 1.42s</span>
                </span>
              </div>

              {/* Center Kinetic Pop-In Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '16px',
                right: '16px',
                background: 'rgba(10, 12, 18, 0.88)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.68rem', color: '#c084fc', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  0-3s Pattern Interrupt Hook
                </span>
                <p style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0', lineHeight: 1.25 }}>
                  "Stop Burning Cash On Ineffective Ads: LaunchFlow"
                </p>
              </div>

              {/* Floating Timeline Indicator */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.7)',
                padding: '4px 8px',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontFamily: 'monospace'
              }}>
                00:01.4 / 00:30.0
              </div>
            </div>

            {/* Right: Live Agentic & Observability HUD Telemetry */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  LIVE AGENTIC MULTIMODAL BENCHMARKS
                </span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '6px 0 12px', fontFamily: 'var(--font-display)' }}>
                  Hollywood Direction at AI Agent Speed
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  Ashky decouples video script synthesis, scene-by-scene kinetic direction, and QA into parallel autonomous agent arms.
                </p>
              </div>

              {/* 4 Stat Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FirstFrame Latency</span>
                    <Zap size={14} color="#10b981" />
                  </div>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399' }}>1.42s</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Scene 1 instant SSE stream</span>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gemini Token Reduction</span>
                    <Sparkles size={14} color="#c084fc" />
                  </div>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#c084fc' }}>-88.0%</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Dynamic keyframe probing</span>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hook Retention Score</span>
                    <Eye size={14} color="#60a5fa" />
                  </div>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#60a5fa' }}>94/100</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Predicted 3s drop-off: 14.2%</span>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.35)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cost Per Blueprint</span>
                    <TrendingUp size={14} color="#fbbf24" />
                  </div>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fbbf24' }}>$0.038</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Optimized for solo founder ROI</span>
                </div>
              </div>

              {/* Direct Quick Launch Bar */}
              <div style={{
                background: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '14px 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={18} color="#34d399" />
                  <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                    Try with preset: <strong>LaunchFlow (B2B SaaS)</strong>
                  </span>
                </div>
                <button
                  onClick={() => handleLaunchStudio(presets[0].name, presets[0].pitch, presets[0].category)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#8b5cf6',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Generate 3-Scene Ad →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* THE 4 AGENTIC PILLARS GRID */}
        {/* ============================================================ */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              THE AGENTIC ARCHITECTURE
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '8px 0 16px', fontFamily: 'var(--font-display)' }}>
              Built for Speed, Retention & AI Search Authority
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.5 }}>
              Four specialized agentic systems engineered specifically for the Google Agentic Cinema Blockbuster Hackathon.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            
            {/* Pillar 1 */}
            <div className="glass-panel" style={{
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={24} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>FirstFrame Progressive Engine</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                Eliminates the painful 60-second blank screen. Scene 1 streams in under 2 seconds via Server-Sent Events (SSE), enabling instant creative alignment while Scenes 2 & 3 finalize.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>SLA: &lt;2.0s Scene 1 Delivery</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="glass-panel" style={{
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={24} color="#c084fc" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Gemini 3.5 Flash Agentic Video</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                Implements Google Gemini's <em>Think → Act → Observe</em> loop. Dynamically inspects targeted keyframes (0.8s, 2.2s, 8.5s, 24s) rather than uniform frame dumping—saving 88% tokens and 66% cost.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c084fc' }}>Vision Critic: 3s Drop-off QA</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="glass-panel" style={{
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={24} color="#38bdf8" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Generative Engine Optimization (GEO)</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                Audits brand citation visibility across Google Gemini, Perplexity AI, and SearchGPT. Generates 1-click Schema.org VideoObject JSON-LD to ground AI search answer engines.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>1-Click JSON-LD Exporter</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="glass-panel" style={{
              padding: '28px',
              borderRadius: '16px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={24} color="#fbbf24" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Grafana Cloud MCP Agent</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                Exposes Prometheus metrics (/metrics) and Loki logs through the Model Context Protocol. AI Copilot runs natural language queries to diagnose latency, token spend, and drop-off anomalies.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>MCP Tools: Metrics, Logs & SRE</span>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* LIVE FOUNDER PITCH SANDBOX */}
        {/* ============================================================ */}
        <div className="glass-panel" style={{
          padding: '40px',
          borderRadius: '20px',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          background: 'linear-gradient(135deg, rgba(20, 24, 38, 0.95) 0%, rgba(10, 12, 18, 0.98) 100%)',
          boxShadow: '0 0 50px rgba(139, 92, 246, 0.2)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              INSTANT FOUNDER SANDBOX
            </span>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0 16px', fontFamily: 'var(--font-display)' }}>
              Generate Your First Campaign in 60 Seconds
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '28px' }}>
              Choose a sample founder preset or enter your custom product details:
            </p>

            {/* Presets Chips */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDemoProduct(p.name);
                    setDemoPitch(p.pitch);
                    setDemoCategory(p.category);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: demoProduct === p.name ? 'rgba(139, 92, 246, 0.35)' : 'rgba(255,255,255,0.05)',
                    border: demoProduct === p.name ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={13} color={demoProduct === p.name ? '#c084fc' : 'currentColor'} />
                  <span>{p.name} ({p.category})</span>
                </button>
              ))}
            </div>

            {/* Quick Input Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRODUCT NAME</label>
                  <input
                    type="text"
                    value={demoProduct}
                    onChange={(e) => setDemoProduct(e.target.value)}
                    className="cinema-input"
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>CATEGORY</label>
                  <input
                    type="text"
                    value={demoCategory}
                    onChange={(e) => setDemoCategory(e.target.value)}
                    className="cinema-input"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>CORE PITCH / VALUE PROPOSITION</label>
                <textarea
                  value={demoPitch}
                  onChange={(e) => setDemoPitch(e.target.value)}
                  className="cinema-input"
                  rows={2}
                  style={{ marginTop: '4px', resize: 'vertical' }}
                />
              </div>

              <button
                onClick={() => handleLaunchStudio(demoProduct, demoPitch, demoCategory)}
                className="btn-cinema-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700, marginTop: '8px' }}
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
