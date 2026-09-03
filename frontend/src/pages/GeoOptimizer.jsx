import React, { useState } from 'react';
import { Search, Sparkles, Code, FileText, Check, Copy, ExternalLink, ShieldCheck, AlertCircle, TrendingUp, Globe } from 'lucide-react';

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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="tag-minimal tag-blue">
            <TrendingUp size={12} /> GENERATIVE ENGINE OPTIMIZATION (GEO)
          </span>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Benchmark & Ground Your Brand Across SearchGPT • Google Gemini • Perplexity
          </span>
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
          AI Search Optimization (GEO)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '4px', maxWidth: '680px' }}>
          When buyer queries happen inside AI answers, traditional SEO is replaced by entity grounding. Probe citation authority and export Schema.org JSON-LD.
        </p>
      </div>

      {/* Prober Controls Card */}
      <div className="matte-panel" style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '14px', alignItems: 'end', background: '#0d0f14' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PRODUCT NAME</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="matte-input"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CATEGORY</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="matte-input"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>KEY COMPETITORS</label>
          <input
            type="text"
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
            className="matte-input"
          />
        </div>

        <button
          onClick={handleRunProbe}
          disabled={probing}
          className="btn-solid-white"
          style={{ height: '42px', padding: '0 20px', fontSize: '0.88rem' }}
        >
          {probing ? 'Probing Citations...' : 'Simulate 24+ AI Queries'}
        </button>
      </div>

      {/* Results Section */}
      {probeResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div className="matte-panel" style={{ padding: '16px', background: '#0d0f14' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SHARE OF VOICE</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
                {probeResult.overall_share_of_voice_pct}%
              </div>
              <span style={{ fontSize: '0.72rem', color: '#10b981' }}>+8.2% vs competitor avg</span>
            </div>

            <div className="matte-panel" style={{ padding: '16px', background: '#0d0f14' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TOP RANKING ENGINE</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#60a5fa', marginTop: '4px' }}>
                {probeResult.top_ranking_engine}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Position #1 Grounded</span>
            </div>

            <div className="matte-panel" style={{ padding: '16px', background: '#0d0f14' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>QUERIES SIMULATED</span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f0f3f6', marginTop: '2px' }}>
                {probeResult.queries_tested}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>High-intent buyer prompts</span>
            </div>

            <div className="matte-panel" style={{ padding: '16px', background: '#0d0f14' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CITATION GAP</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
                1 Opportunity
              </div>
              <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>SearchGPT comparison missing</span>
            </div>
          </div>

          {/* Citation Probe Breakdown */}
          <div className="matte-panel" style={{ padding: '20px', background: '#0d0f14' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
              Live AI Citation Benchmark Table
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {probeResult.citations.map((cit, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#07080b',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="tag-minimal tag-slate">
                        {cit.engine}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>"{cit.query}"</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {cit.product_mentioned ? (
                        <span className="tag-minimal tag-emerald">
                          <Check size={11} /> CITED (POS #{cit.citation_position})
                        </span>
                      ) : (
                        <span className="tag-minimal tag-slate" style={{ color: '#f87171' }}>
                          NOT CITED
                        </span>
                      )}
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        SoV: <strong>{cit.share_of_voice_pct}%</strong>
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', background: '#0d0f14', padding: '8px 12px', borderRadius: '6px', margin: 0 }}>
                    {cit.generated_snippet}
                  </p>

                  <div style={{ fontSize: '0.76rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
                    <AlertCircle size={13} />
                    <span>GEO GAP: {cit.gap_analysis}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1-Click JSON-LD & Semantic PR Exporter */}
          {schemaResult && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* JSON-LD VideoObject Schema */}
              <div className="matte-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#0d0f14' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Code size={16} color="#cbd5e1" />
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>JSON-LD VideoObject Schema</h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(schemaResult.video_object_schema, 'video_schema')}
                    className="btn-matte-dark"
                    style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                  >
                    {copiedKey === 'video_schema' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copiedKey === 'video_schema' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre style={{
                  background: '#07080b',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: '#34d399',
                  overflowX: 'auto',
                  maxHeight: '220px'
                }}>
                  {JSON.stringify(schemaResult.video_object_schema, null, 2)}
                </pre>
              </div>

              {/* Semantic Transcript & Press Pitch */}
              <div className="matte-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#0d0f14' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={16} color="#60a5fa" />
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>Semantic Video Transcript</h4>
                  </div>
                  <button
                    onClick={() => copyToClipboard(schemaResult.semantic_transcript, 'transcript')}
                    className="btn-matte-dark"
                    style={{ fontSize: '0.74rem', padding: '4px 8px' }}
                  >
                    {copiedKey === 'transcript' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copiedKey === 'transcript' ? 'Copied!' : 'Copy Transcript'}</span>
                  </button>
                </div>
                <pre style={{
                  background: '#07080b',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  color: '#fbbf24',
                  whiteSpace: 'pre-wrap',
                  overflowY: 'auto',
                  maxHeight: '220px'
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
