import React from 'react';
import './GameStats.css';

const GameStats = ({ score, combo, timeLeft }) => {
  return (
    <div className="game-stats">
      <div className="stat">
        <div className="stat-value">{score}</div>
        <div className="stat-label">SCORE</div>
      </div>
      <div className="stat">
        <div className="stat-value">{combo}</div>
        <div className="stat-label">COMBO</div>
      </div>
      <div className="stat">
        <div className="stat-value">{timeLeft}</div>
        <div className="stat-label">TIME</div>
      </div>
    </div>
  );
};

export default GameStats;