import React from 'react';
import { Sprout, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MindfulStats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="stats-card">
      <div className="stats-header">
        <div className="stats-title-group">
          <div className="stats-sprout-icon">
            <Sprout size={18} />
          </div>
          <div>
            <h2 className="stats-heading">Daily Cultivation</h2>
            <p className="stats-subtext">
              {total === 0
                ? 'Your garden is peaceful and ready for seeds'
                : completed === total
                ? 'All intentions have blossomed in harmony today! 🌸'
                : `${completed} of ${total} intentions blossomed`}
            </p>
          </div>
        </div>

        <div className="stats-badge-pill">
          <span className="stats-pct">{percentage}%</span>
          <span className="stats-pct-label">flourished</span>
        </div>
      </div>

      {/* Organic Progress Bar */}
      <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 0 && <span className="progress-leaf-marker">🍃</span>}
        </div>
      </div>

      <div className="stats-footer">
        <div className="stat-pill">
          <span className="stat-num">{total}</span>
          <span className="stat-name">Planted</span>
        </div>
        <div className="stat-pill">
          <span className="stat-num">{total - completed}</span>
          <span className="stat-name">Growing</span>
        </div>
        <div className="stat-pill accent">
          <span className="stat-num">{completed}</span>
          <span className="stat-name">Blossomed</span>
        </div>
      </div>
    </div>
  );
}
