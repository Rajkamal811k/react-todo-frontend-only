import React, { useState } from 'react';
import {
  Check,
  Trash2,
  Edit3,
  Star,
  Clock,
  Copy,
  Save,
  X,
} from 'lucide-react';
import { natureAudio } from '../utils/audio';

const CATEGORY_MAP = {
  mindful: { label: 'Mindful', emoji: '🌱', className: 'realm-mindful' },
  work: { label: 'Work', emoji: '💼', className: 'realm-work' },
  home: { label: 'Living', emoji: '🏡', className: 'realm-home' },
  wellness: { label: 'Wellness', emoji: '🌿', className: 'realm-wellness' },
  creative: { label: 'Creative', emoji: '✨', className: 'realm-creative' },
};

const PRIORITY_MAP = {
  low: { label: 'Sprout', icon: '🌱', badgeClass: 'priority-low' },
  medium: { label: 'Fern', icon: '🌿', badgeClass: 'priority-med' },
  high: { label: 'Bloom', icon: '🌸', badgeClass: 'priority-high' },
};

export default function TaskItem({
  task,
  onToggleComplete,
  onTogglePin,
  onUpdateText,
  onDelete,
  onDuplicate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleToggle = () => {
    if (!task.completed) {
      natureAudio.playHarmonicBloom();
    } else {
      natureAudio.playWoodClick();
    }
    onToggleComplete(task.id);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText.trim() !== task.text) {
      onUpdateText(task.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  const catMeta = CATEGORY_MAP[task.category] || CATEGORY_MAP.mindful;
  const prioMeta = PRIORITY_MAP[task.priority] || PRIORITY_MAP.medium;

  return (
    <div
      className={`task-row-card ${task.completed ? 'completed' : ''} ${
        task.pinned ? 'pinned' : ''
      }`}
    >
      {/* Botanical Checkbox */}
      <button
        type="button"
        className={`botanical-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={handleToggle}
        aria-label={task.completed ? 'Mark task as active' : 'Mark task as blossomed'}
        title={task.completed ? 'Mark uncompleted' : 'Mark completed'}
      >
        {task.completed ? (
          <Check size={14} className="check-svg" strokeWidth={3} />
        ) : (
          <span className="uncompleted-dot" />
        )}
      </button>

      {/* Center content */}
      <div className="task-content-block">
        {isEditing ? (
          <div className="inline-edit-wrap">
            <input
              type="text"
              className="inline-edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <button
              type="button"
              className="inline-action-btn save"
              onClick={handleSaveEdit}
              title="Save changes"
            >
              <Save size={14} />
            </button>
            <button
              type="button"
              className="inline-action-btn cancel"
              onClick={() => {
                setEditText(task.text);
                setIsEditing(false);
              }}
              title="Cancel"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <span
            className="task-title-text"
            onDoubleClick={() => setIsEditing(true)}
            title="Double click to edit"
          >
            {task.text}
          </span>
        )}

        {/* Badges metadata */}
        <div className="task-meta-row">
          <span className={`realm-badge ${catMeta.className}`}>
            <span>{catMeta.emoji}</span>
            <span>{catMeta.label}</span>
          </span>

          <span className={`prio-badge ${prioMeta.badgeClass}`}>
            <span>{prioMeta.icon}</span>
            <span>{prioMeta.label}</span>
          </span>

          {task.dueTime && (
            <span className="time-badge">
              <Clock size={11} />
              <span>{task.dueTime}</span>
            </span>
          )}
        </div>
      </div>

      {/* Right action icons */}
      <div className="task-actions-cluster">
        <button
          type="button"
          className={`row-action-btn pin-btn ${task.pinned ? 'is-pinned' : ''}`}
          onClick={() => {
            natureAudio.playWoodClick();
            onTogglePin(task.id);
          }}
          title={task.pinned ? 'Unpin intention' : 'Pin to top'}
          aria-label={task.pinned ? 'Unpin intention' : 'Pin to top'}
        >
          <Star size={15} fill={task.pinned ? 'currentColor' : 'none'} />
        </button>

        {!isEditing && (
          <button
            type="button"
            className="row-action-btn"
            onClick={() => {
              natureAudio.playWoodClick();
              setIsEditing(true);
            }}
            title="Edit"
            aria-label="Edit task"
          >
            <Edit3 size={15} />
          </button>
        )}

        <button
          type="button"
          className="row-action-btn"
          onClick={() => {
            natureAudio.playWoodClick();
            onDuplicate(task);
          }}
          title="Duplicate intention"
          aria-label="Duplicate intention"
        >
          <Copy size={15} />
        </button>

        <button
          type="button"
          className="row-action-btn delete-btn"
          onClick={() => {
            natureAudio.playWoodClick();
            onDelete(task);
          }}
          title="Release task"
          aria-label="Delete task"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
