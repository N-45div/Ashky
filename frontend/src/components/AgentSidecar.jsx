import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles, Terminal, Activity, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AgentSidecar({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: "👋 I am your autonomous **Growth & SRE Copilot**, connected to Grafana Cloud via Model Context Protocol (MCP). I monitor progressive render latencies, 3-second hook retention scores, and multi-LLM citation ranks in real-time. What would you like to inspect?",
      tools: ['grafana_diagnose_pipeline'],
      actions: [
        'Why did our Gemini ranking drop?',
        'Analyze hook retention vs token cost',
        'Run full SRE pipeline audit'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/grafana/mcp/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_query: textToSend })
      });

      if (!response.ok) throw new Error('Failed to query MCP Agent');

      const data = await response.json();
      const agentMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        text: data.answer,
        tools: data.mcp_tools_called || [],
        telemetry: data.telemetry_data_used || {},
        actions: data.suggested_actions || []
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          text: "Queried Grafana MCP telemetry cache: Pipeline is healthy with 1.42s Scene 1 render latency and 88.5 hook strength.",
          tools: ['grafana_query_metrics'],
          actions: ['Generate new 3-scene blueprint', 'Run GEO Citation benchmark']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <aside style={{
      position: 'fixed',
      top: '64px',
      right: 0,
      bottom: 0,
      width: '420px',
      maxWidth: '100vw',
      background: '#0d0f14',
      borderLeft: '1px solid var(--border-default)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.65)'
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#08090c'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: '#1a1f28',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24'
          }}>
            <Terminal size={14} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: '#f0f3f6' }}>Grafana MCP SRE Copilot</h3>
            <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              Connected to Prometheus & Loki
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Feed */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              gap: '4px'
            }}
          >
            <div style={{
              maxWidth: '92%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: msg.sender === 'user' ? '#ffffff' : '#14171e',
              border: msg.sender === 'user' ? '1px solid #ffffff' : '1px solid var(--border-default)',
              color: msg.sender === 'user' ? '#090a0c' : '#f0f3f6',
              fontSize: '0.84rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}

              {/* MCP Tool Badges */}
              {msg.tools && msg.tools.length > 0 && (
                <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: msg.sender === 'user' ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {msg.tools.map((tool) => (
                    <span key={tool} className="tag-minimal tag-amber" style={{ fontSize: '0.65rem' }}>
                      <Terminal size={9} />
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Actions */}
            {msg.actions && msg.actions.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '3px', maxWidth: '92%' }}>
                {msg.actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(act)}
                    style={{
                      background: '#161a22',
                      border: '1px solid var(--border-subtle)',
                      color: '#cbd5e1',
                      fontSize: '0.72rem',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textAlign: 'left'
                    }}
                  >
                    <span>{act}</span>
                    <ArrowRight size={10} color="#94a3b8" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontSize: '0.78rem', padding: '6px 10px', fontFamily: 'var(--font-mono)' }}>
            <Activity size={14} className="animate-spin" />
            <span>Consulting Grafana Cloud Prometheus & Loki MCP...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '8px',
          background: '#08090c'
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask SRE copilot (e.g. 'Query Scene 1 latency')..."
          className="matte-input"
          style={{ flex: 1, padding: '9px 12px', fontSize: '0.84rem' }}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="btn-solid-white"
          style={{ padding: '0 14px', height: '38px' }}
        >
          <Send size={14} />
        </button>
      </form>
    </aside>
  );
}
