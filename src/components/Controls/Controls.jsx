import React from 'react';
import './Controls.css';

const Controls = ({ isPlaying, onStart, onPause }) => {
  return (
    <div className="controls">
      {!isPlaying ? (
        <button className="btn" onClick={onStart}>
          🚀 START REACTOR
        </button>
      ) : (
        <button className="btn" onClick={onPause}>
          ⏸️ PAUSE
        </button>
      )}
    </div>
  );
};

export default Controls;