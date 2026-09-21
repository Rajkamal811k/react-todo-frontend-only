import React from 'react';
import { Leaf, Sun, Sunset, Moon, Volume2, VolumeX, Wind } from 'lucide-react';
import { natureAudio } from '../utils/audio';

export default function Header({
  theme,
  setTheme,
  isMuted,
  setIsMuted,
  onOpenBreathe,
}) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    natureAudio.setMuted(nextMuted);
    if (!nextMuted) {
      natureAudio.playWoodClick();
    }
  };

  const cycleTheme = () => {
    natureAudio.playWoodClick();
    if (theme === 'mist') setTheme('sunset');
    else if (theme === 'sunset') setTheme('midnight');
    else setTheme('mist');
  };

  const getThemeIcon = () => {
    if (theme === 'sunset') return <Sunset size={17} />;
    if (theme === 'midnight') return <Moon size={17} />;
    return <Sun size={17} />;
  };

  const getThemeLabel = () => {
    if (theme === 'sunset') return 'Sunset Dune';
    if (theme === 'midnight') return 'Midnight Moss';
    return 'Morning Mist';
  };

  return (
    <header className="sylvan-header">
      <div className="header-brand-row">
        <div className="brand-logo">
          <div className="leaf-badge">
            <Leaf size={22} className="leaf-icon" />
          </div>
          <div>
            <h1 className="brand-title">Sylvan</h1>
            <p className="brand-subtitle">Natural & Mindful Tasks</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Quick Breathe Button */}
          <button
            type="button"
            className="action-pill-btn breathe-btn"
            onClick={() => {
              natureAudio.playWoodClick();
              onOpenBreathe();
            }}
            title="Take a mindful breath"
          >
            <Wind size={15} />
            <span>Breathe</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            className="action-pill-btn icon-only"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute nature sounds' : 'Mute nature sounds'}
            title={isMuted ? 'Unmute organic sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            className="action-pill-btn theme-toggle-btn"
            onClick={cycleTheme}
            title={`Current atmosphere: ${getThemeLabel()}. Click to change.`}
          >
            {getThemeIcon()}
            <span className="theme-text">{getThemeLabel()}</span>
          </button>
        </div>
      </div>

      <div className="header-zen-strip">
        <div className="zen-date">
          <span className="date-leaf-bullet">🌿</span>
          <span>{currentDate}</span>
        </div>
        <div className="zen-quote">
          <span className="quote-italic">“Simplicity is the natural bloom of quiet focus.”</span>
        </div>
      </div>
    </header>
  );
}
