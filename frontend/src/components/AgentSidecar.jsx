import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles, Terminal, Activity, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AgentSidecar({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: "👋 Hi Founder! I am your autonomous **Growth & SRE Agent**, powered by the Grafana Model Context Protocol (MCP). I monitor your progressive render latencies, 3-second hook retention scores, and multi-LLM citation ranks in real time. How can I optimize your distribution today?",
      tools: ['grafana_diagnose_pipeline'],
      actions: [
        'Why did our Gemini ranking drop?',
        'Analyze our hook retention vs token cost',
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
          text: "I was able to query the Grafana MCP telemetry cache: Your current pipeline is healthy with 1.42s Scene 1 render latency and 88.5 hook strength. Let's run another campaign to test prompt tuning.",
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
      top: '72px',
      right: 0,
      bottom: 0,
      width: '440px',
      maxWidth: '100vw',
      background: 'rgba(10, 12, 18, 0.95)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.6)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(18, 22, 34, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={18} color="#000" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Growth & SRE Agent</h3>
            <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              Connected via Grafana MCP Tools
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
            padding: '6px'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Feed */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              gap: '6px'
            }}
          >
            <div style={{
              maxWidth: '90%',
              padding: '12px 16px',
              borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              background: msg.sender === 'user'
                ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
                : 'rgba(25, 30, 46, 0.85)',
              border: msg.sender === 'user'
                ? '1px solid rgba(255, 255, 255, 0.2)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}

              {/* MCP Tool Badges */}
              {msg.tools && msg.tools.length > 0 && (
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {msg.tools.map((tool) => (
                    <span key={tool} className="badge-mcp" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      <Wrench size={10} />
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested Actions Pill Buttons */}
            {msg.actions && msg.actions.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px', maxWidth: '90%' }}>
                {msg.actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(act)}
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#fef08a',
                      fontSize: '0.74rem',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textAlign: 'left'
                    }}
                  >
                    <span>{act}</span>
                    <ArrowRight size={10} />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.82rem', padding: '8px 12px' }}>
            <Activity size={16} className="animate-spin" />
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
          padding: '14px 18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(14, 16, 23, 0.8)',
          display: 'flex',
          gap: '8px'
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Grafana SRE agent..."
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#ffffff',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            border: 'none',
            borderRadius: '8px',
            padding: '0 14px',
            color: '#000000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </aside>
  );
}
