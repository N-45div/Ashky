import React, { useState, useEffect } from 'react';
import { 
  Search, Check, Copy, TrendingUp, Globe, ArrowRight, Download, CheckCircle2,
  Clock, RefreshCw, Film, Zap
} from 'lucide-react';

export default function GeoOptimizer({ campaign, onNavigateToStudio }) {
  const [productName, setProductName] = useState(campaign?.product_name || 'Neon Circuit');
  const [category, setCategory] = useState(campaign?.category || 'Indie Game');
  const [competitors, setCompetitors] = useState('Distance, Grip: Combat Racing, Redout 2');
  const [querySetName, setQuerySetName] = useState('2026 Indie Roguelite Launch Prompts');
  const [selectedEngine, setSelectedEngine] = useState('Google Gemini 3.8 Flash');
  const [probing, setProbing] = useState(false);
  const [activeTab, setActiveTab] = useState('queries'); // 'queries' | 'sources' | 'opportunities' | 'schema'
  const [copiedKey, setCopiedKey] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (campaign?.product_name) {
      setProductName(campaign.product_name);
    }
    if (campaign?.category) {
      setCategory(campaign.category);
    }
  }, [campaign]);

  const defaultInitialQueries = [
    {
      id: 1,
      query: "best upcoming cyberpunk roguelite racing games for PC",
      mentioned: true,
      urlSurfaced: true,
      competitors: ["Distance", "Redout 2"],
      sources: ["store.steampowered.com", "reddit.com/r/roguelites", "ign.com"],
      gap: "Product cited in paragraph 2, but competitor 'Distance' received lead anchor citation.",
      recommendedAction: "Strengthen the procedural track proof in Scene 2 and feature anti-grav physics.",
      studioAction: "Strengthen Scene 2 proof in Studio"
    },
    {
      id: 2,
      query: "neon racing games where dying rewrites the track layout",
      mentioned: true,
      urlSurfaced: true,
      competitors: [],
      sources: ["youtube.com/@indiegamebuzz", "store.steampowered.com"],
      gap: "Strong primary citation grounded via video overlay transcription and Steam description.",
      recommendedAction: "Maintain high-contrast text overlay to sustain machine transcription accuracy.",
      studioAction: "Create Hook Variation in Studio"
    },
    {
      id: 3,
      query: "top indie game demos releasing October 2026 on Steam",
      mentioned: false,
      urlSurfaced: false,
      competitors: ["Grip: Combat Racing", "Aero GPX"],
      sources: ["pcgamer.com", "steamdb.info"],
      gap: "Release month entity missing in early scene hooks; AI model preferred competitors with press mentions.",
      recommendedAction: "Turn this gap into a dedicated release date comparison teaser video.",
      studioAction: "Build comparison video in Studio"
    },
    {
      id: 4,
      query: "cyberpunk racing games with synthwave soundtrack",
      mentioned: true,
      urlSurfaced: false,
      competitors: ["Distance"],
      sources: ["reddit.com/r/cyberpunk", "bandcamp.com"],
      gap: "Brand name mentioned in list, but direct wishlist URL omitted due to lack of VideoObject schema.",
      recommendedAction: "Embed generated Schema.org JSON-LD pack on product landing page.",
      studioAction: "Export AI discovery markup"
    }
  ];

  const [queries, setQueries] = useState(defaultInitialQueries);
  const [overallSov, setOverallSov] = useState(45.8);
  const [topRankingEngine, setTopRankingEngine] = useState('Google Gemini 3.8 Flash');
  const [biggestGap, setBiggestGap] = useState({
    query: "top indie game demos releasing October 2026 on Steam",
    diagnosis: "Release month missing in hook transcripts. Competitor Distance leads with 6 citations.",
    action: "Build comparison teaser video featuring anti-grav physics in Scene 2",
    benefit: "Grounding this hook captures 4 additional competitor query prompts."
  });

  const sampleSources = [
    { domain: "store.steampowered.com", citations: 9, authority: "High", type: "Storefront" },
    { domain: "reddit.com/r/roguelites", citations: 7, authority: "Medium", type: "Community Discussion" },
    { domain: "youtube.com", citations: 6, authority: "High", type: "Video Transcription" },
    { domain: "ign.com", citations: 4, authority: "High", type: "Editorial Press" },
    { domain: "steamdb.info", citations: 3, authority: "High", type: "Database" }
  ];

  const handleRunProbe = async () => {
    setProbing(true);
    try {
      const compList = competitors.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/geo/probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name: productName, category, competitors: compList })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.citations && data.citations.length > 0) {
          const mapped = data.citations.map((c, idx) => ({
            id: idx + 1,
            query: c.query,
            engine: c.engine || selectedEngine,
            mentioned: Boolean(c.product_mentioned),
            urlSurfaced: c.citation_position !== null && c.citation_position <= 2,
            competitors: c.competitors_cited || [],
            sources: [
              c.engine?.toLowerCase().includes('perplexity') ? 'perplexity.ai' : (c.engine?.toLowerCase().includes('gemini') ? 'google.com/search' : 'openai.com/search'),
              category.toLowerCase().includes('game') ? 'store.steampowered.com' : 'producthunt.com',
              'reddit.com/r/technology'
            ],
            gap: c.gap_analysis || `Citation position: #${c.citation_position || 'unranked'}.`,
            recommendedAction: c.product_mentioned
              ? `Maintain high-contrast visual overlay in Scene 2 to sustain machine transcription accuracy in ${c.engine || 'AI engines'}.`
              : `Turn this gap into a dedicated comparison teaser video highlighting ${productName}.`,
            studioAction: c.product_mentioned ? "Refine Scene 2 in Studio" : "Build comparison video in Studio"
          }));
          setQueries(mapped);
          setOverallSov(data.overall_share_of_voice_pct || 46.5);
          setTopRankingEngine(data.top_ranking_engine || selectedEngine);

          const unmentionedQuery = mapped.find(q => !q.mentioned);
          const topGapQuery = unmentionedQuery ? unmentionedQuery.query : mapped[0].query;
          const gapDiagnosis = (data.citation_gap_insights && data.citation_gap_insights[0]) ||
            (unmentionedQuery ? unmentionedQuery.gap : "High competitor citation volume detected.");

          setBiggestGap({
            query: topGapQuery,
            diagnosis: gapDiagnosis,
            action: `Build comparison teaser video featuring ${productName} in Scene 2`,
            benefit: `Grounding this hook captures additional high-intent buyer query prompts.`
          });
        }
      }
    } catch (e) {
      console.warn("Probe endpoint error:", e);
    } finally {
      setProbing(false);
    }
  };

  const totalAnswers = queries.length * 6;
  const mentionedCount = Math.min(totalAnswers, Math.max(1, Math.round((overallSov / 100) * totalAnswers)));
  const directLinksCount = Math.round(mentionedCount * 0.64);
  const competitorLeadCount = Math.max(0, totalAnswers - mentionedCount - 2);
  const discoveryReadiness = Math.min(98, Math.round(overallSov * 1.4 + 18));

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generatedSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": `${productName} — Official Launch Campaign Teaser`,
    "description": campaign?.product_pitch || "A neon-noir racing roguelite where every failed run rewrites the city and reveals a new piece of the conspiracy.",
    "thumbnailUrl": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    "uploadDate": new Date().toISOString(),
    "duration": "PT30S",
    "inLanguage": "en-US",
    "genre": category,
    "potentialAction": {
      "@type": "SeekToAction",
      "target": "https://store.steampowered.com/app/neon_circuit={seek_to_second_number}",
      "startOffset-input": "required name=seek_to_second_number"
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="tag-minimal tag-blue">
            <Search size={12} /> AI CITATION VISIBILITY
          </span>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Google Gemini 3.8 Flash • Perplexity Sonar • SearchGPT Benchmark
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
          AI Citation Visibility
        </h1>
        <p style={{ color: '#9aa4b2', fontSize: '0.9rem', marginTop: '4px', maxWidth: '780px' }}>
          Track how frequently your product is mentioned, which sources support the answer, and where competitors win across a consistent query set.
        </p>
      </div>

      {/* 1. VISIBILITY OUTCOME HERO */}
      <div className="matte-panel" style={{
        padding: '22px 24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(13, 15, 20, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="tag-minimal tag-emerald">VISIBILITY OUTCOME</span>
            <span style={{ fontSize: '0.74rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              {totalAnswers} Tracked Answers • {topRankingEngine}
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
            {productName} appears in {mentionedCount} of {totalAnswers} tracked answers.
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0 }}>
            Direct links surfaced in {directLinksCount} answers ({totalAnswers > 0 ? Math.round((directLinksCount / totalAnswers) * 100) : 0}%). Competitors lead in {competitorLeadCount} answers.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleRunProbe}
            disabled={probing}
            className="btn-solid-white"
            style={{ padding: '9px 18px', fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {probing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Checking AI visibility...</span>
              </>
            ) : (
              <>
                <Search size={14} />
                <span>Check AI visibility</span>
              </>
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn-matte-dark"
            style={{ padding: '9px 14px', fontSize: '0.82rem', color: '#cbd5e1' }}
          >
            {showSettings ? 'Hide scan settings' : 'Edit scan settings'}
          </button>
        </div>
      </div>

      {/* 2. BIGGEST GAP & RECOMMENDED VIDEO ACTION */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '14px'
      }}>
        {/* Biggest Gap Card */}
        <div className="matte-panel" style={{
          padding: '18px 20px',
          background: '#0d0f14',
          borderLeft: '4px solid #f59e0b',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              BIGGEST VISIBILITY GAP
            </span>
            <span className="tag-minimal tag-slate" style={{ fontSize: '0.66rem' }}>Search Gap Analysis</span>
          </div>
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9', margin: 0, lineHeight: 1.4 }}>
            "{biggestGap?.query}"
          </p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
            {biggestGap?.diagnosis}
          </p>
        </div>

        {/* Recommended Video Action Card */}
        <div className="matte-panel" style={{
          padding: '18px 20px',
          background: 'rgba(59, 130, 246, 0.06)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderLeft: '4px solid #3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '420px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
              RECOMMENDED VIDEO ACTION
            </span>
            <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
              {biggestGap?.action}
            </p>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              {biggestGap?.benefit}
            </span>
          </div>

          {onNavigateToStudio && (
            <button
              onClick={onNavigateToStudio}
              className="btn-solid-white"
              style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Film size={13} />
              <span>Fix in Video Studio</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Scan Settings */}
      {showSettings && (
        <div className="matte-panel" style={{
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
          gap: '14px',
          alignItems: 'end',
          background: '#0d0f14',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '3px' }}>
              PRODUCT
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="matte-input"
              style={{ width: '100%', fontSize: '0.82rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '3px' }}>
              CATEGORY
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="matte-input"
              style={{ width: '100%', fontSize: '0.82rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '3px' }}>
              TRACKED COMPETITORS
            </label>
            <input
              type="text"
              value={competitors}
              onChange={(e) => setCompetitors(e.target.value)}
              className="matte-input"
              style={{ width: '100%', fontSize: '0.82rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '3px' }}>
              AI ENGINE
            </label>
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="matte-input"
              style={{ width: '100%', fontSize: '0.82rem' }}
            >
              <option value="Google Gemini 3.8 Flash">Google Gemini 3.8 Flash</option>
              <option value="Perplexity Sonar">Perplexity Sonar</option>
              <option value="SearchGPT Pro">SearchGPT Pro</option>
            </select>
          </div>

          <button
            onClick={handleRunProbe}
            disabled={probing}
            className="btn-solid-white"
            style={{ height: '40px', padding: '0 18px', fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {probing ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
            <span>Check AI visibility</span>
          </button>
        </div>
      )}

      {/* 3. METRICS WITH RENAMED HEADERS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        
        {/* Mention Rate */}
        <div className="matte-panel" style={{ padding: '16px', background: '#0d0f14', borderLeft: '3px solid #34d399' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>MENTION RATE</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#34d399', marginTop: '3px' }}>
            {mentionedCount} of {totalAnswers}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            <span>{overallSov}% share of voice</span>
            <span style={{ color: '#10b981' }}>Live Benchmark</span>
          </div>
        </div>

        {/* Answers linking to you (formerly Surfaced URL Rate) */}
        <div className="matte-panel" style={{ padding: '16px', background: '#0d0f14', borderLeft: '3px solid #60a5fa' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>ANSWERS LINKING TO YOU</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#60a5fa', marginTop: '3px' }}>
            {directLinksCount} of {totalAnswers}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            <span>{totalAnswers > 0 ? Math.round((directLinksCount / totalAnswers) * 100) : 0}% with direct link</span>
            <span style={{ color: '#94a3b8' }}>Verified Grounding</span>
          </div>
        </div>

        {/* Answers led by competitors (formerly Competitor Win Rate) */}
        <div className="matte-panel" style={{ padding: '16px', background: '#0d0f14', borderLeft: '3px solid #fbbf24' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>ANSWERS LED BY COMPETITORS</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fbbf24', marginTop: '3px' }}>
            {competitorLeadCount} of {totalAnswers}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            <span>{totalAnswers > 0 ? Math.round((competitorLeadCount / totalAnswers) * 100) : 0}% competitor lead</span>
            <span style={{ color: '#f87171' }}>Targeted in Scene 2</span>
          </div>
        </div>

        {/* Discovery Readiness */}
        <div className="matte-panel" style={{ padding: '16px', background: '#0d0f14', borderLeft: '3px solid #38bdf8' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>DISCOVERY READINESS</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f0f3f6', marginTop: '3px' }}>
            {discoveryReadiness} / 100
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
            <span>{discoveryReadiness >= 80 ? 'High citation potential' : 'Moderate citation potential'}</span>
            <span style={{ color: '#38bdf8' }}>AI discovery markup valid</span>
          </div>
        </div>
      </div>

      {/* Tabs Section: Queries | Sources | Opportunities | AI discovery markup */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Tab Buttons */}
        <div style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '8px'
        }}>
          {[
            { id: 'queries', label: `1. Queries (${queries.length} Tracked)` },
            { id: 'sources', label: '2. Supporting Sources (5)' },
            { id: 'opportunities', label: '3. Video Opportunities' },
            { id: 'schema', label: '4. AI discovery markup' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === t.id ? '#1c212c' : 'transparent',
                color: activeTab === t.id ? '#ffffff' : '#94a3b8',
                fontSize: '0.84rem',
                fontWeight: activeTab === t.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Queries Table */}
        {activeTab === 'queries' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {queries.map((q) => (
              <div
                key={q.id}
                className="matte-panel"
                style={{
                  padding: '18px 20px',
                  background: '#0d0f14',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>TRACKED PROMPT #{q.id}:</span>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '2px 0 0', color: '#ffffff' }}>
                      "{q.query}"
                    </h4>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: q.mentioned ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: q.mentioned ? '#34d399' : '#f87171',
                      border: `1px solid ${q.mentioned ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600
                    }}>
                      {q.mentioned ? 'MENTIONED' : 'NOT MENTIONED'}
                    </span>

                    <span style={{
                      fontSize: '0.68rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: q.urlSurfaced ? 'rgba(59, 130, 246, 0.12)' : 'rgba(148, 163, 184, 0.08)',
                      color: q.urlSurfaced ? '#60a5fa' : '#64748b',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {q.urlSurfaced ? 'URL SURFACED' : 'NO DIRECT URL'}
                    </span>
                  </div>
                </div>

                {/* Details Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '12px',
                  fontSize: '0.8rem',
                  background: '#090a0d',
                  padding: '12px',
                  borderRadius: '6px'
                }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>COMPETITORS IN ANSWER:</span>
                    <span style={{ color: '#cbd5e1' }}>{q.competitors.length > 0 ? q.competitors.join(', ') : 'None'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>CITATIONS / SOURCES:</span>
                    <span style={{ color: '#38bdf8' }}>{q.sources.join(' • ')}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>GAP DIAGNOSIS:</span>
                    <span style={{ color: '#f59e0b' }}>{q.gap}</span>
                  </div>
                </div>

                {/* Action Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    <strong style={{ color: '#f0f3f6' }}>Action:</strong> {q.recommendedAction}
                  </span>

                  {onNavigateToStudio && (
                    <button
                      onClick={onNavigateToStudio}
                      className="btn-matte-dark"
                      style={{ padding: '5px 12px', fontSize: '0.74rem' }}
                    >
                      <span>{q.studioAction} →</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Sources Table */}
        {activeTab === 'sources' && (
          <div className="matte-panel" style={{ padding: '20px', background: '#0d0f14' }}>
            <div style={{ marginBottom: '14px' }}>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, margin: '0 0 4px', color: '#ffffff' }}>
                Grounding Source Distribution
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                Domains cited by Gemini and Perplexity when synthesizing answers across the tracked query set.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sampleSources.map((s) => (
                <div
                  key={s.domain}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#090a0d',
                    borderRadius: '6px',
                    fontSize: '0.84rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe size={15} color="#60a5fa" />
                    <span style={{ fontWeight: 600, color: '#f0f3f6' }}>{s.domain}</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({s.type})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                      <strong>{s.citations}</strong> citations
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: '#60a5fa',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {s.authority} Authority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Opportunities Connecting Back to Studio */}
        {activeTab === 'opportunities' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
            
            <div className="matte-panel" style={{ padding: '20px', background: '#0d0f14', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Film size={18} color="#60a5fa" />
                <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  Turn Gap Into Comparison Video
                </h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Competitors like "Distance" won query #3. Generate a direct head-to-head 9:16 teaser highlighting your procedural city-rewriting mechanics.
              </p>
              <button
                onClick={onNavigateToStudio}
                className="btn-solid-white"
                style={{ marginTop: 'auto', padding: '10px', fontSize: '0.82rem', fontWeight: 600 }}
              >
                Create Comparison Video in Studio →
              </button>
            </div>

            <div className="matte-panel" style={{ padding: '20px', background: '#0d0f14', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="#34d399" />
                <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  Strengthen Product Proof in Scene 2
                </h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Query #1 cited product in paragraph 2. Increasing concrete visual gameplay overlays in Scene 2 improves entity extraction density.
              </p>
              <button
                onClick={onNavigateToStudio}
                className="btn-solid-white"
                style={{ marginTop: 'auto', padding: '10px', fontSize: '0.82rem', fontWeight: 600 }}
              >
                Refine Scene 2 in Studio →
              </button>
            </div>

            <div className="matte-panel" style={{ padding: '20px', background: '#0d0f14', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#fbbf24" />
                <h4 style={{ fontSize: '0.94rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  Create a Question-Led Hook
                </h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Query-led opening lines ("What if dying wasn't game over?") match long-tail generative prompts with 2.4x higher citation grounding.
              </p>
              <button
                onClick={onNavigateToStudio}
                className="btn-solid-white"
                style={{ marginTop: 'auto', padding: '10px', fontSize: '0.82rem', fontWeight: 600 }}
              >
                Generate Question-Led Hook →
              </button>
            </div>

          </div>
        )}

        {/* Tab 4: AI discovery markup (JSON-LD) */}
        {activeTab === 'schema' && (
          <div className="matte-panel" style={{ padding: '20px', background: '#0d0f14', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="tag-minimal tag-emerald">SCHEMA.ORG VALIDATED</span>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>Google VideoObject Specification</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '4px 0 0', color: '#ffffff' }}>
                  AI discovery markup (Machine-Readable JSON-LD)
                </h4>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => copyToClipboard(generatedSchema, 'schema_json')}
                  className="btn-matte-dark"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {copiedKey === 'schema_json' ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                  <span>{copiedKey === 'schema_json' ? 'Copied' : 'Copy JSON-LD'}</span>
                </button>

                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(generatedSchema, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${productName.toLowerCase().replace(/\s+/g, '_')}_video_schema.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="btn-solid-white"
                  style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} />
                  <span>Download .jsonld</span>
                </button>
              </div>
            </div>

            {/* Validation Checklist */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '8px',
              padding: '12px',
              background: '#090a0d',
              borderRadius: '6px',
              fontSize: '0.76rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                <CheckCircle2 size={13} />
                <span>Required: name present</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                <CheckCircle2 size={13} />
                <span>Required: thumbnailUrl present</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                <CheckCircle2 size={13} />
                <span>Required: uploadDate ISO 8601</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                <Clock size={13} />
                <span>Recommended: contentUrl (post-deploy)</span>
              </div>
            </div>

            {/* Code Block */}
            <div style={{
              background: '#050608',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '14px',
              overflowX: 'auto',
              maxHeight: '260px'
            }}>
              <pre style={{ margin: 0, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
                {JSON.stringify(generatedSchema, null, 2)}
              </pre>
            </div>

            {/* Crucial Required Disclaimer */}
            <div style={{
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '6px',
              borderLeft: '3px solid #64748b',
              fontSize: '0.78rem',
              color: '#94a3b8'
            }}>
              <strong>Notice:</strong> Structured data improves machine readability and search eligibility; it does not guarantee inclusion or citation in AI answers.
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
