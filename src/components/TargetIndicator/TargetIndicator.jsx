import React from 'react';
import './TargetIndicator.css';

const TargetIndicator = ({ target }) => {
  if (!target) return null;

  return (
    <div 
      className="target-indicator"
      style={{
        color: target.value,
        borderColor: target.value
      }}
    >
      {target.text}
    </div>
  );
};

export default TargetIndicator;