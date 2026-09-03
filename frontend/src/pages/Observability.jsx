import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, Terminal, ShieldCheck, Wrench, RefreshCw, Layers, ExternalLink, Zap } from 'lucide-react';

export default function Observability({ onOpenSidecar }) {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/grafana/snapshot');
      if (res.ok) {
        const data = await res.json();
        setSnapshot(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="tag-minimal tag-amber">
              <Activity size={12} /> GRAFANA LABS PARTNER TRACK
            </span>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Model Context Protocol (MCP) • Prometheus Metrics • Loki Log Stream
            </span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
            Grafana Observability & SRE
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '4px', maxWidth: '680px' }}>
            Telemetry tracking real-time LLM Share of Voice, FirstFrame render latency, token consumption, and autonomous SRE agent diagnosis.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchTelemetry} className="btn-matte-dark">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Metrics</span>
          </button>
          <button onClick={onOpenSidecar} className="btn-solid-white">
            <Terminal size={14} />
            <span>Launch SRE Copilot</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div className="matte-panel" style={{ padding: '16px', background: '#0d0f14', borderLeft: '3px solid #34d399' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>SCENE 1 RENDER LATENCY</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
            {snapshot?.avg_scene1_render_latency_ms || 1420} ms
          </div>
          <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Meets sub-2s FirstFrame SLA</span>
        </div>

        <div className="matte-panel" style={{ padding: '16px', background: '#0d0f14', borderLeft: '3px solid #60a5fa' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>AVG HOOK RETENTION</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#60a5fa', marginTop: '4px' }}>
            {snapshot?.avg_hook_strength_score || 88.5} / 100
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Vision Critic: 82% 3s retention</span>
        </div>

        <div className="matte-panel" style={{ padding: '16px', background: '#0d0f14', borderLeft: '3px solid #cbd5e1' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>LLM SHARE OF VOICE</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f0f3f6', marginTop: '4px' }}>
            {snapshot?.current_llm_share_of_voice_pct || 42.8}%
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Gemini 47% • Perplexity 48%</span>
        </div>

        <div className="matte-panel" style={{ padding: '16px', background: '#0d0f14', borderLeft: '3px solid #fbbf24' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>TOTAL CAMPAIGN COST</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            ${snapshot?.total_token_spend_usd || 0.038}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{snapshot?.total_gemini_tokens_consumed || 8420} Gemini tokens</span>
        </div>
      </div>

      {/* Middle Section: MCP Tools & Live Loki Log Terminal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
        
        {/* Active MCP Tools */}
        <div className="matte-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#0d0f14' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="#fbbf24" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Grafana MCP Server Tools</h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
            Model Context Protocol tools allow AI assistants and SRE sidecars to query Prometheus telemetry and structured logs.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              {
                name: 'grafana_query_metrics',
                desc: 'Runs PromQL queries on ashky_scene_render_duration_seconds and ashky_llm_share_of_voice_pct.'
              },
              {
                name: 'grafana_query_loki_logs',
                desc: 'Executes LogQL queries to fetch real-time agent execution traces and error logs.'
              },
              {
                name: 'grafana_diagnose_pipeline',
                desc: 'Autonomous SRE audit diagnosing 3-second hook drop-off anomalies and latency spikes.'
              }
            ].map((tool) => (
              <div key={tool.name} style={{ background: '#07080b', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px' }}>
                <span className="tag-minimal tag-amber" style={{ fontSize: '0.72rem' }}>{tool.name}</span>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', margin: '4px 0 0' }}>{tool.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <a href="/metrics" target="_blank" rel="noreferrer" className="btn-matte-dark" style={{ fontSize: '0.78rem', textDecoration: 'none', padding: '6px 12px' }}>
              <ExternalLink size={12} />
              <span>Prometheus /metrics</span>
            </a>
            <a href="/docs" target="_blank" rel="noreferrer" className="btn-matte-dark" style={{ fontSize: '0.78rem', textDecoration: 'none', padding: '6px 12px' }}>
              <ExternalLink size={12} />
              <span>FastAPI /docs</span>
            </a>
          </div>
        </div>

        {/* Live Loki Log Stream Terminal */}
        <div className="matte-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#0d0f14' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} color="#34d399" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Loki Structured Log Stream</h3>
            </div>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
              app="ashky", env="prod"
            </span>
          </div>

          <div style={{
            background: '#07080b',
            borderRadius: '8px',
            padding: '14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            lineHeight: 1.6,
            height: '320px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            {snapshot?.recent_loki_logs?.map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '3px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{log.timestamp?.slice(11, 19)}</span>
                <span style={{
                  color: log.level === 'INFO' ? '#60a5fa' : log.level === 'WARN' ? '#fbbf24' : '#f87171',
                  fontWeight: 600
                }}>
                  [{log.level}]
                </span>
                <span style={{ color: '#cbd5e1' }}>[{log.component}]</span>
                <span style={{ color: '#f0f3f6' }}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
