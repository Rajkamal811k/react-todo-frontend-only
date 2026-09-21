import React, { useState } from 'react';
import { Plus, Tag, Clock, Sparkles } from 'lucide-react';
import { natureAudio } from '../utils/audio';

const CATEGORIES = [
  { id: 'mindful', label: 'Mindful', emoji: '🌱' },
  { id: 'work', label: 'Deep Work', emoji: '💼' },
  { id: 'home', label: 'Living', emoji: '🏡' },
  { id: 'wellness', label: 'Wellness', emoji: '🌿' },
  { id: 'creative', label: 'Creative', emoji: '✨' },
];

const PRIORITIES = [
  { id: 'low', label: 'Sprout', icon: '🌱' },
  { id: 'medium', label: 'Fern', icon: '🌿' },
  { id: 'high', label: 'Bloom', icon: '🌸' },
];

export default function TaskInput({ onAddTask }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('mindful');
  const [priority, setPriority] = useState('medium');
  const [dueTime, setDueTime] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    natureAudio.playWoodClick();
    onAddTask({
      id: Date.now().toString(),
      text: text.trim(),
      category,
      priority,
      dueTime: dueTime || null,
      completed: false,
      pinned: false,
      createdAt: new Date().toISOString(),
    });

    setText('');
    setDueTime('');
  };

  return (
    <form className={`task-input-card ${isExpanded ? 'expanded' : ''}`} onSubmit={handleSubmit}>
      <div className="input-main-row">
        <div className="input-seed-indicator">🌱</div>
        <input
          type="text"
          className="task-text-field"
          placeholder="Plant a new task or quiet intention..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          maxLength={120}
        />
        <button
          type="submit"
          className="add-task-btn"
          disabled={!text.trim()}
          title="Add intention"
          aria-label="Add intention"
        >
          <Plus size={18} />
          <span>Plant</span>
        </button>
      </div>

      {isExpanded && (
        <div className="input-drawer">
          {/* Categories */}
          <div className="drawer-group">
            <span className="drawer-label">Realm:</span>
            <div className="drawer-pills">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  className={`pill-btn ${category === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    natureAudio.playWoodClick();
                    setCategory(cat.id);
                  }}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority & Time */}
          <div className="drawer-group bottom-row">
            <div className="sub-group">
              <span className="drawer-label">Energy:</span>
              <div className="drawer-pills">
                {PRIORITIES.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    className={`pill-btn priority-pill ${priority === p.id ? 'active' : ''}`}
                    onClick={() => {
                      natureAudio.playWoodClick();
                      setPriority(p.id);
                    }}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sub-group time-group">
              <span className="drawer-label">Time:</span>
              <div className="time-input-wrap">
                <Clock size={13} className="time-icon" />
                <input
                  type="time"
                  className="time-picker-field"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
