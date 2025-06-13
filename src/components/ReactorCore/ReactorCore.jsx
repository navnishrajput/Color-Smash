import React, { forwardRef, useEffect, useState } from 'react';
import './ReactorCore.css';

const ReactorCore = forwardRef(({ orbs, onOrbClick, combo }, ref) => {
  const [explosions, setExplosions] = useState([]);
  const [comboTexts, setComboTexts] = useState([]);
  const [showMultiplier, setShowMultiplier] = useState(false);

  useEffect(() => {
    if (combo > 1) {
      setShowMultiplier(true);
      const timer = setTimeout(() => setShowMultiplier(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [combo]);

  const handleOrbClick = (orb) => {
    // Create explosion
    const newExplosion = {
      id: Date.now(),
      color: orb.colorValue,
      x: orb.x,
      y: orb.y
    };
    setExplosions(prev => [...prev, newExplosion]);
    
    // Create combo text if correct hit
    let newComboText = null;
    if (orb.colorName === orb.targetColor) {
      newComboText = {
        id: Date.now() + 1,
        text: `+${10 + (combo * 5)}`,
        x: orb.x,
        y: orb.y
      };
      setComboTexts(prev => [...prev, newComboText]);
    }
    
    // Remove effects after animation
    setTimeout(() => {
      setExplosions(prev => prev.filter(e => e.id !== newExplosion.id));
    }, 600);
    
    if (newComboText) {
      setTimeout(() => {
        setComboTexts(prev => prev.filter(ct => ct.id !== newComboText.id));
      }, 1500);
    }
    
    onOrbClick(orb);
  };

  return (
    <div className="reactor-core" ref={ref}>
      {orbs.map(orb => (
        <div 
          key={orb.id}
          className="color-orb"
          style={{
            backgroundColor: orb.colorValue,
            left: `${orb.x}px`,
            top: `${orb.y}px`,
            animationDelay: `${orb.animationDelay}s`,
            '--orb-color': orb.colorValue
          }}
          onClick={() => handleOrbClick(orb)}
        />
      ))}
      
      {explosions.map(explosion => (
        <div 
          key={explosion.id}
          className="explosion"
          style={{
            backgroundColor: explosion.color,
            left: `${explosion.x}px`,
            top: `${explosion.y}px`
          }}
        />
      ))}
      
      {comboTexts.map(comboText => (
        <div 
          key={comboText.id}
          className="combo-text"
          style={{
            left: `${comboText.x}px`,
            top: `${comboText.y}px`
          }}
        >
          {comboText.text}
        </div>
      ))}
      
      {showMultiplier && (
        <div className="chain-multiplier">
          {combo}x COMBO!
        </div>
      )}
    </div>
  );
});

export default ReactorCore;