import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 4 + Math.random() * 12,
  left: Math.random() * 100,
  duration: 12 + Math.random() * 20,
  delay: Math.random() * 15,
}));

const STATS = [
  { value: '4', label: 'Practice Modes' },
  { value: 'AI', label: 'Powered Feedback' },
  { value: '∞', label: 'Topics to Explore' },
];

const FEATURES = [
  { icon: '🎙️', title: 'Voice Input', desc: 'Speak naturally using your microphone — just like a real conversation.' },
  { icon: '📊', title: 'Fluency Score', desc: 'Get scored out of 10 with detailed reasoning after every session.' },
  { icon: '🧠', title: 'Grammar Fix', desc: 'See exactly where you went wrong with side-by-side corrections.' },
  { icon: '📚', title: 'Vocab Upgrade', desc: 'Replace weak words with powerful alternatives suggested by AI.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { resetSession } = useSessionStore();

  useEffect(() => {
    resetSession();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #05080f 0%, #0a0f1e 40%, #05101a 100%)' }}>
      {/* Particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(45,212,191,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-sm font-bold">T</div>
          <span className="font-bold text-white text-lg">talk_to_me</span>
        </div>
        <button
          id="nav-history-btn"
          onClick={() => navigate('/history')}
          className="btn-ghost text-sm px-4 py-2"
        >
          📋 History
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-16 pb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-500/20 text-xs text-violet-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          Powered by Groq AI · Llama 3.3 70B
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="text-white">Practice English.</span>
          <br />
          <span className="gradient-text">Sound Confident.</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Your AI-powered English practice partner — master job interviews, debates, group discussions
          and casual conversation with real-time feedback.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-12 mb-12">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <button
          id="start-practice-btn"
          onClick={() => navigate('/session')}
          className="btn-primary text-lg px-10 py-4 mb-4"
        >
          🚀 Start Practising Free
        </button>
        <p className="text-xs text-gray-600">No account needed · Instant start</p>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-5 text-left hover:border-violet-500/30 transition-all duration-300">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
