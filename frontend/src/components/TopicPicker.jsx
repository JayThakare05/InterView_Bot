import { useState, useEffect } from 'react';
import { getTopics } from '../api/client';

export default function TopicPicker({ mode, onSelect, selected }) {
  const [topics, setTopics] = useState([]);
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mode) return;
    setLoading(true);
    getTopics()
      .then((data) => setTopics(data[mode] || []))
      .catch(() => setTopics([]))
      .finally(() => setLoading(false));
  }, [mode]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (custom.trim()) {
      onSelect(custom.trim());
      setCustom('');
    }
  };

  if (!mode) return null;

  return (
    <div className="slide-up">
      <p className="text-sm text-gray-400 mb-3">Choose a topic or type your own:</p>

      {loading ? (
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-28 rounded-full bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mb-4">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => onSelect(t)}
              className={`chip ${selected === t ? 'active' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <input
          type="text"
          className="chat-input flex-1 text-sm"
          placeholder="Or type your own topic…"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          id="custom-topic-input"
        />
        <button
          type="submit"
          disabled={!custom.trim()}
          className="btn-primary text-sm px-4 py-2 disabled:opacity-40"
        >
          Set
        </button>
      </form>

      {selected && (
        <p className="mt-2 text-xs text-teal-400 flex items-center gap-1">
          <span>✓</span> Topic: <strong>{selected}</strong>
        </p>
      )}
    </div>
  );
}
