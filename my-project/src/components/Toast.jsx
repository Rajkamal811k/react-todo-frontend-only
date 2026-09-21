import React from 'react';
import { RotateCcw, X } from 'lucide-react';
import { natureAudio } from '../utils/audio';

export default function Toast({ toast, onUndo, onClose }) {
  if (!toast) return null;

  return (
    <div className="sylvan-toast">
      <span className="toast-leaf">🍃</span>
      <span className="toast-message">{toast.message}</span>
      {toast.undoAction && (
        <button
          type="button"
          className="toast-undo-btn"
          onClick={() => {
            natureAudio.playWoodClick();
            onUndo();
          }}
        >
          <RotateCcw size={13} />
          <span>Undo</span>
        </button>
      )}
      <button
        type="button"
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Dismiss toast"
      >
        <X size={14} />
      </button>
    </div>
  );
}
