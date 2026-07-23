import { useState } from 'react';

const sentimentColor = {
  positive: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  neutral: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
  negative: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
};

export default function Home() {
  const [site, setSite] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('mentions');

  const analyze = async () => {
    if (!site.trim()) return;
    setLoading(true); setData(null); setError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site: site.trim() }),
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#4c1d95)', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 40 }}>🔍</div>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '8px 0' }}>AI Brand Monitor</h1>
        <p style={{ color: '#c7d2fe', marginBottom: 32 }}>Chuf kifash l-AI tools kaydawwzo site dyalek</p>
        <div style={{ display: 'flex', gap: 10, maxWidth: 520, margin: '0 auto' }}>
          <input
            value={site} onChange={e => setSite(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && analyze()}
            placeholder="smartvpro.com"
            style={{ flex: 1, height: 48, borderRadius: 12, border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0 16px', fontSize: 15 }}
          />
          <button onClick={analyze} disabled={loading}
            style={{ height: 48, padding: '0 24px', borderRadius: 12, border: 'none', background: loading ? '#6b7280' : '#6366f1', color: '#fff', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Scanning...' : 'Analyze →'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        {error && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 12, padding: 16, color: '#991b1b', marginBottom: 20 }}>{error}</div>}

        {loading && <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>🔄 Kan-analyze...</div>}

        {data && (
          <div>
            <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid #e5e7eb', marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>AI Visibility — {site}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: data.score >= 70 ? '#10b981' : data.score >= 40 ? '#f59e0b' : '#ef4444' }}>{data.score}<span style={{ fontSize: 14, color: '#9ca3af' }}>/100</span></div>
                <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, margin: 0 }}>{data.summary}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: '#f3f4f6', borderRadius: 10, padding: 4 }}>
              {['mentions','opportunities','issues'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none', cursor: 'pointer', background: tab === t ? '#fff' : 'transparent', fontWeight: tab === t ? 600 : 400, fontSize: 13, color: tab === t ? '#111' : '#6b7280' }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)} ({(data[t] || []).length})
                </button>
              ))}
            </div>

            {tab === 'mentions' && (data.mentions || []).map((m, i) => {
              const sc = sentimentColor[m.sentiment] || sentimentColor.neutral;
              return (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderLeft: `4px solid ${sc.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <strong style={{ fontSize: 15 }}>{m.source}</strong>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: sc.bg, color: sc.text, fontWeight: 600 }}>{m.sentiment}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.6 }}>{m.context}</p>
                </div>
              );
            })}

            {tab === 'opportunities' && (data.opportunities || []).map((o, i) => (
              <div key={i} style={{ background: '#fff', borderLeft: '4px solid #10b981', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 16px', marginBottom: 10, display: 'flex', gap: 10 }}>
                <span>🚀</span><span style={{ fontSize: 14, color: '#374151' }}>{o}</span>
              </div>
            ))}

            {tab === 'issues' && (data.issues || []).map((iss, i) => (
              <div key={i} style={{ background: '#fff', borderLeft: '4px solid #ef4444', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 16px', marginBottom: 10, display: 'flex', gap: 10 }}>
                <span>⚠️</span><span style={{ fontSize: 14, color: '#374151' }}>{iss}</span>
              </div>
            ))}
          </div>
        )}

        {!loading && !data && !error && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
            <p>Kteb URL dial site dyalek u click Analyze</p>
          </div>
        )}
      </div>
    </div>
  );
}
