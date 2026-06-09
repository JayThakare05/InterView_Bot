import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, getSessionFeedback } from '../api/client';

const MODE_EMOJI = { interview: '🎙️', debate: '⚔️', gd: '👥', casual: '☕' };
const MODE_COLOR = {
  interview: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  debate: 'text-red-400 bg-red-400/10 border-red-400/20',
  gd: 'text-green-400 bg-green-400/10 border-green-400/20',
  casual: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

function ScoreBadge({ score }) {
  const color = score >= 8 ? '#2dd4bf' : score >= 6 ? '#a78bfa' : score >= 4 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-1">
      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
        style={{ borderColor: color, color }}>
        {score}
      </div>
      <span className="text-xs text-gray-500">/10</span>
    </div>
  );
}

export default function History() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    getHistory({ limit, page })
      .then((d) => { setSessions(d.sessions); setTotal(d.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const handleViewFeedback = async (sessionId) => {
    setFeedbackLoading(true);
    try {
      const data = await getSessionFeedback(sessionId);
      setSelectedFeedback(data.feedback);
    } catch {
      alert('Feedback not available for this session.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen" style={{ background: '#0a0f1e' }}>
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <button
          id="back-home-history-btn"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← <span className="font-bold text-white">talk_to_me</span>
        </button>
        <button
          id="new-session-from-history-btn"
          onClick={() => navigate('/session')}
          className="btn-primary text-sm px-4 py-2"
        >
          + New Session
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8 slide-up">
          <h1 className="text-3xl font-bold text-white mb-1">Session History</h1>
          <p className="text-gray-400 text-sm">{total} completed session{total !== 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 glass rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl slide-up">
            <div className="text-5xl mb-4">🌱</div>
            <p className="text-gray-400 mb-4">No sessions yet. Start your first practice!</p>
            <button onClick={() => navigate('/session')} className="btn-primary px-6 py-2">
              Start Practising
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s, i) => (
              <div
                key={s.id}
                className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-violet-500/25 transition-all duration-200 slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="text-3xl">{MODE_EMOJI[s.mode] || '💬'}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${MODE_COLOR[s.mode]}`}>
                      {s.mode}
                    </span>
                    <span className="text-white font-medium text-sm truncate">{s.topic}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {s.exchange_count} exchanges · {new Date(s.ended_at || s.started_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                {s.fluency_score != null && <ScoreBadge score={s.fluency_score} />}
                <button
                  id={`view-feedback-${s.id}`}
                  onClick={() => handleViewFeedback(s.id)}
                  className="btn-ghost text-xs px-3 py-1.5 shrink-0"
                >
                  View Report
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost text-sm px-3 py-1.5 disabled:opacity-30">← Prev</button>
            <span className="text-sm text-gray-400 px-3 py-1.5">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-ghost text-sm px-3 py-1.5 disabled:opacity-30">Next →</button>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {selectedFeedback && (
        <div
          id="feedback-modal-overlay"
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedFeedback(null)}
        >
          <div className="glass-strong rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative">
            <button
              id="close-feedback-modal-btn"
              onClick={() => setSelectedFeedback(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 w-8 h-8 rounded-full glass flex items-center justify-center"
            >
              ✕
            </button>
            <div className="p-6">
              <h2 className="text-xl font-bold gradient-text mb-6">Session Feedback</h2>

              {/* Score */}
              <div className="feedback-section">
                <h3 className="font-semibold text-white mb-2">📊 Fluency Score</h3>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold gradient-text">{selectedFeedback.fluency_score}</span>
                  <span className="text-gray-400">/ 10</span>
                  <span className="text-sm text-gray-300 flex-1">{selectedFeedback.fluency_reason}</span>
                </div>
              </div>

              {/* Grammar */}
              {selectedFeedback.grammar?.length > 0 && (
                <div className="feedback-section">
                  <h3 className="font-semibold text-white mb-3">📝 Grammar</h3>
                  {selectedFeedback.grammar.map((g, i) => (
                    <div key={i} className="mb-2 p-2 rounded-lg bg-red-500/05 border border-red-500/10">
                      <span className="text-xs text-red-400 line-through">{g.original}</span>
                      <span className="text-xs text-gray-500 mx-2">→</span>
                      <span className="text-xs text-green-400">{g.corrected}</span>
                      {g.reason && <p className="text-xs text-gray-500 mt-1">{g.reason}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Vocab */}
              {selectedFeedback.vocabulary?.length > 0 && (
                <div className="feedback-section">
                  <h3 className="font-semibold text-white mb-3">📚 Vocabulary</h3>
                  {selectedFeedback.vocabulary.map((v, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm mb-1">
                      <span className="text-gray-400 line-through">{v.weak_word}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-violet-300">{v.suggestion}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Strengths & Improve */}
              <div className="grid grid-cols-2 gap-3">
                {selectedFeedback.strengths?.length > 0 && (
                  <div className="feedback-section">
                    <h3 className="font-semibold text-white mb-2 text-sm">💪 Strengths</h3>
                    {selectedFeedback.strengths.map((s, i) => (
                      <p key={i} className="text-xs text-gray-300 mb-1">✓ {s}</p>
                    ))}
                  </div>
                )}
                {selectedFeedback.improve_next?.length > 0 && (
                  <div className="feedback-section">
                    <h3 className="font-semibold text-white mb-2 text-sm">🎯 Improve</h3>
                    {selectedFeedback.improve_next.map((t, i) => (
                      <p key={i} className="text-xs text-gray-300 mb-1">{i + 1}. {t}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Encouragement */}
              {selectedFeedback.encouragement && (
                <div className="rounded-2xl p-4 text-center mt-2" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <p className="text-sm text-gray-200 italic">"{selectedFeedback.encouragement}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
