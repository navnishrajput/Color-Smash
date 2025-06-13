import React from 'react';
import './GameOverModal.css';

const GameOverModal = ({ show, score, maxCombo, performanceMessage, onRestart, onShare }) => {
  if (!show) return null;

  return (
    <div className="game-over-modal">
      <div className="modal-content">
        <h2 className="modal-title">🎯 REACTOR SHUTDOWN!</h2>
        <div className="modal-stats">
          <div className="modal-stat">Final Score: <strong>{score}</strong></div>
          <div className="modal-stat">Max Combo: <strong>{maxCombo}</strong></div>
        </div>
        <p className="performance-message">{performanceMessage}</p>
        <button className="btn share-btn" onClick={onShare}>
          📱 SHARE CHAOS
        </button>
        <button className="btn" onClick={onRestart}>
          🔄 RESTART REACTOR
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;