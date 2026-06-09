const MODES = [
  {
    id: 'interview',
    label: 'Interview',
    emoji: '🎙️',
    description: 'Practice job interviews with an AI interviewer asking real HR questions.',
    color: 'from-blue-600/20 to-blue-400/10',
    border: 'border-blue-500/30',
    glow: 'rgba(59,130,246,0.3)',
    tag: 'Most Popular',
  },
  {
    id: 'debate',
    label: 'Debate',
    emoji: '⚔️',
    description: 'Sharpen your arguments by debating the AI on trending topics.',
    color: 'from-red-600/20 to-orange-400/10',
    border: 'border-red-500/30',
    glow: 'rgba(239,68,68,0.3)',
    tag: 'Advanced',
  },
  {
    id: 'gd',
    label: 'Group Discussion',
    emoji: '👥',
    description: 'Simulate a group discussion with AI participants Priya & Arjun.',
    color: 'from-green-600/20 to-emerald-400/10',
    border: 'border-green-500/30',
    glow: 'rgba(34,197,94,0.3)',
    tag: 'Team Skills',
  },
  {
    id: 'casual',
    label: 'Casual Chat',
    emoji: '☕',
    description: 'Relax and have a natural conversation on any topic you enjoy.',
    color: 'from-purple-600/20 to-fuchsia-400/10',
    border: 'border-purple-500/30',
    glow: 'rgba(168,85,247,0.3)',
    tag: 'Beginner Friendly',
  },
];

export default function ModeSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          id={`mode-${mode.id}`}
          onClick={() => onSelect(mode.id)}
          className={`mode-card relative text-left ${selected === mode.id ? 'selected' : ''}`}
          style={
            selected === mode.id
              ? { boxShadow: `0 0 30px ${mode.glow}` }
              : {}
          }
        >
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mode.color} opacity-60`} />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{mode.emoji}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${mode.border}`}
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {mode.tag}
              </span>
            </div>
            <h3 className="font-semibold text-white mb-1">{mode.label}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{mode.description}</p>
          </div>

          {selected === mode.id && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
