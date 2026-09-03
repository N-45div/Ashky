import React, { useState } from 'react';
import { Search, Sparkles, Code, FileText, Check, Copy, ExternalLink, ShieldCheck, AlertCircle, TrendingUp } from 'lucide-react';

export default function GeoOptimizer() {
  const [productName, setProductName] = useState('LaunchFlow');
  const [category, setCategory] = useState('B2B SaaS');
  const [competitors, setCompetitors] = useState('Pendo, WalkMe, Userflow');
  const [probing, setProbing] = useState(false);
  const [probeResult, setProbeResult] = useState(null);
  const [schemaResult, setSchemaResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleRunProbe = async () => {
    setProbing(true);
    try {
      const compList = competitors.split(',').map(s => s.trim()).filter(Boolean);
      const [probeRes, schemaRes] = await Promise.all([
        fetch('/api/geo/probe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_name: productName, category, competitors: compList })
        }),
        fetch('/api/geo/schema', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_name: productName, category, competitors: compList })
        })
      ]);

      if (probeRes.ok) {
        const pData = await probeRes.json();
        setProbeResult(pData);
      }
      if (schemaRes.ok) {
        const sData = await schemaRes.json();
        setSchemaResult(sData);
      }
    } catch (err) {
      console.error("GEO probe error:", err);
    } finally {
      setProbing(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <span className="badge-hook" style={{ background: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.3)', color: '#60a5fa' }}>
            <TrendingUp size={12} /> GENERATIVE ENGINE OPTIMIZATION (GEO)
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Benchmark & Ground Your Brand Across SearchGPT • Google Gemini • Perplexity
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
          AI Search Optimization <span className="gradient-text-cinema">& Citation Arm</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px', maxWidth: '720px' }}>
          When 70% of buyer searches happen inside AI answers, traditional SEO is dead. Probe where your product gets cited and generate 1-click JSON-LD schemas to dominate LLM search recommendations.
        </p>
      </div>

      {/* Prober Controls Card */}
      <div className="glass-panel" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="cinema-input"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="cinema-input"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Key Competitors (comma separated)</label>
          <input
            type="text"
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
            className="cinema-input"
          />
        </div>

        <button
          onClick={handleRunProbe}
          disabled={probing}
          className="btn-cinema-primary"
          style={{ height: '46px', padding: '0 24px' }}
        >
          {probing ? 'Probing LLM Citations...' : 'Simulate 24+ AI Queries'}
        </button>
      </div>

      {/* Results Section */}
      {probeResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Overall Share of Voice</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                {probeResult.overall_share_of_voice_pct}%
              </div>
              <span style={{ fontSize: '0.72rem', color: '#10b981' }}>+8.2% vs competitor avg</span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Top Ranking Engine</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#60a5fa', marginTop: '6px' }}>
                {probeResult.top_ranking_engine}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Position #1 Grounded</span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Queries Simulated</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>
                {probeResult.queries_tested}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>High-intent buyer prompts</span>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Citation Gap Status</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>
                1 Opportunity
              </div>
              <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>SearchGPT comparison missing</span>
            </div>
          </div>

          {/* Citation Probe Breakdown */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
              Live AI Citation Benchmark Table
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {probeResult.citations.map((cit, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: cit.engine.includes('Gemini') ? 'rgba(66, 133, 244, 0.15)' : cit.engine.includes('Perplexity') ? 'rgba(20, 184, 166, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: cit.engine.includes('Gemini') ? '#60a5fa' : cit.engine.includes('Perplexity') ? '#2dd4bf' : '#34d399',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        {cit.engine}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>"{cit.query}"</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {cit.product_mentioned ? (
                        <span className="badge-hook">
                          <Check size={12} /> CITED (POS #{cit.citation_position})
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '20px', background: 'rgba(239, 68, 68, 0.12)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                          NOT CITED
                        </span>
                      )}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        SoV: <strong>{cit.share_of_voice_pct}%</strong>
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                    {cit.generated_snippet}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={14} />
                    <span>GEO Gap Insight: {cit.gap_analysis}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1-Click JSON-LD & Semantic PR Exporter */}
          {schemaResult && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* JSON-LD VideoObject Schema */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Code size={18} color="#c084fc" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>JSON-LD VideoObject Schema</h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(schemaResult.video_object_schema, 'video_schema')}
                    className="btn-cinema-secondary"
                    style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                  >
                    {copiedKey === 'video_schema' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    <span>{copiedKey === 'video_schema' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '14px',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  color: '#a7f3d0',
                  overflowX: 'auto',
                  maxHeight: '260px'
                }}>
                  {JSON.stringify(schemaResult.video_object_schema, null, 2)}
                </pre>
              </div>

              {/* Semantic Transcript & Press Pitch */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="#60a5fa" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Semantic Video Transcript</h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(schemaResult.semantic_transcript, 'transcript')}
                    className="btn-cinema-secondary"
                    style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                  >
                    {copiedKey === 'transcript' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    <span>{copiedKey === 'transcript' ? 'Copied!' : 'Copy Transcript'}</span>
                  </button>
                </div>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '14px',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  color: '#fef08a',
                  whiteSpace: 'pre-wrap',
                  overflowY: 'auto',
                  maxHeight: '260px'
                }}>
                  {schemaResult.semantic_transcript}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
