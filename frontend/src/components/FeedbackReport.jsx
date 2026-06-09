import { useEffect, useRef, useState } from 'react';

const MODE_LABELS = { interview: 'Interview', debate: 'Debate', gd: 'Group Discussion', casual: 'Casual' };

function ScoreRing({ score }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 10) * circumference);
    }, 200);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  const color =
    score >= 8 ? '#2dd4bf' : score >= 6 ? '#a78bfa' : score >= 4 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring-circle"
          style={{ transition: 'stroke-dashoffset 1.5s ease-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="text-center">
        <div className="text-3xl font-bold" style={{ color }}>{score}</div>
        <div className="text-xs text-gray-400">/ 10</div>
      </div>
    </div>
  );
}

function Section({ icon, title, children, delay = 0 }) {
  return (
    <div className="feedback-section" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="flex items-center gap-2 font-semibold text-white mb-3">
        <span className="text-lg">{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

export default function FeedbackReport({ feedback, mode, topic, onStartNew }) {
  if (!feedback) return null;

  const {
    summary,
    grammar = [],
    vocabulary = [],
    fluency_score = 5,
    fluency_reason = '',
    strengths = [],
    improve_next = [],
    encouragement = '',
  } = feedback;

  return (
    <div className="h-full overflow-y-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8 slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-violet-300 mb-4 border border-violet-500/20">
          ✨ Session Complete
        </div>
        <h2 className="text-2xl font-bold gradient-text mb-1">Your Feedback Report</h2>
        <p className="text-sm text-gray-400">
          {MODE_LABELS[mode] || mode} · {topic} · {summary?.exchanges || '?'} exchanges
        </p>
      </div>

      {/* Fluency Score */}
      <Section icon="📊" title="Fluency Score" delay={100}>
        <div className="flex items-center gap-6">
          <ScoreRing score={fluency_score} />
          <p className="text-gray-300 text-sm leading-relaxed flex-1">{fluency_reason}</p>
        </div>
      </Section>

      {/* Strengths */}
      {strengths.length > 0 && (
        <Section icon="💪" title="Strengths" delay={200}>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-teal-400 mt-0.5">✓</span> {s}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Grammar */}
      {grammar.length > 0 && (
        <Section icon="📝" title="Grammar & Sentences" delay={300}>
          <div className="space-y-3">
            {grammar.map((g, i) => (
              <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <div className="flex items-start gap-2 mb-1 flex-wrap">
                  <span className="text-xs line-through text-red-400 bg-red-400/10 px-2 py-0.5 rounded">{g.original}</span>
                  <span className="text-xs text-gray-400">→</span>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">{g.corrected}</span>
                </div>
                {g.reason && <p className="text-xs text-gray-400 mt-1">{g.reason}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Vocabulary */}
      {vocabulary.length > 0 && (
        <Section icon="📚" title="Vocabulary Upgrades" delay={400}>
          <div className="space-y-2">
            {vocabulary.map((v, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-gray-400 line-through">{v.weak_word}</span>
                <span className="text-gray-500">→</span>
                <span className="text-violet-300 font-medium">{v.suggestion}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Improvements */}
      {improve_next.length > 0 && (
        <Section icon="🎯" title="3 Things to Improve Next Time" delay={500}>
          <ol className="space-y-2">
            {improve_next.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-violet-400 font-bold shrink-0">{i + 1}.</span> {tip}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Encouragement */}
      {encouragement && (
        <div
          className="rounded-2xl p-5 mb-4 text-center slide-up"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(45,212,191,0.08))',
            border: '1px solid rgba(139,92,246,0.2)',
            animationDelay: '600ms',
          }}
        >
          <div className="text-2xl mb-2">🌟</div>
          <p className="text-gray-200 text-sm italic leading-relaxed">"{encouragement}"</p>
        </div>
      )}

      {/* CTA */}
      <div className="text-center pb-4 slide-up" style={{ animationDelay: '700ms' }}>
        <button
          id="start-new-session-btn"
          onClick={onStartNew}
          className="btn-primary px-8 py-3"
        >
          🚀 Start New Session
        </button>
      </div>
    </div>
  );
}
