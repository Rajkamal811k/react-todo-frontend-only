import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wind } from 'lucide-react';
import { natureAudio } from '../utils/audio';

export default function BreatheModal({ isOpen, onClose }) {
  const [phase, setPhase] = useState('Inhale'); // Inhale (4s), Hold (4s), Exhale (4s)
  const [secondsLeft, setSecondsLeft] = useState(4);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        // switch phase
        setPhase((currentPhase) => {
          if (currentPhase === 'Inhale') return 'Hold';
          if (currentPhase === 'Hold') return 'Exhale';
          return 'Inhale';
        });
        return 4;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="breathe-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="breathe-close"
          onClick={() => {
            natureAudio.playWoodClick();
            onClose();
          }}
          aria-label="Close breathing modal"
        >
          <X size={18} />
        </button>

        <div className="breathe-header">
          <div className="breathe-icon-wrap">
            <Wind size={22} />
          </div>
          <h3>Mindful Respite</h3>
          <p className="breathe-sub">Center yourself with natural rhythm</p>
        </div>

        <div className="breathe-visual-area">
          <div className={`breath-circle ${phase.toLowerCase()}`}>
            <div className="breath-inner-ring">
              <span className="phase-text">{phase}</span>
              <span className="phase-counter">{secondsLeft}s</span>
            </div>
          </div>
        </div>

        <p className="breathe-tip">
          <Sparkles size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          Return to your tasks with clarity and gentle presence.
        </p>

        <button
          className="breathe-finish-btn"
          onClick={() => {
            natureAudio.playHarmonicBloom();
            onClose();
          }}
        >
          Finished Breathing
        </button>
      </div>
    </div>
  );
}
