// src/components/GameContainer/GameContainer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import GameStats from '../GameStats/GameStats';
import TargetIndicator from '../TargetIndicator/TargetIndicator';
import ReactorCore from '../ReactorCore/ReactorCore';
import Controls from '../Controls/Controls';
import GameOverModal from '../GameOverModal/GameOverModal';
import './GameContainer.css';

const GameContainer = () => {
  const colors = [
    { name: 'RED', value: '#ff3838', text: 'CLICK RED!' },
    { name: 'BLUE', value: '#1e90ff', text: 'CLICK BLUE!' },
    { name: 'GREEN', value: '#32cd32', text: 'CLICK GREEN!' },
    { name: 'YELLOW', value: '#ffd700', text: 'CLICK YELLOW!' },
    { name: 'PURPLE', value: '#8a2be2', text: 'CLICK PURPLE!' },
    { name: 'ORANGE', value: '#ff8c00', text: 'CLICK ORANGE!' },
    { name: 'CYAN', value: '#00ffff', text: 'CLICK CYAN!' },
    { name: 'PINK', value: '#ff69b4', text: 'CLICK PINK!' }
  ];

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [orbs, setOrbs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Memoized functions to prevent infinite re-renders
  const setNewTarget = useCallback(() => {
    const target = colors[Math.floor(Math.random() * colors.length)];
    setCurrentTarget(target);
  }, [colors]);

  const spawnOrb = useCallback(() => {
    const colorIndex = Math.floor(Math.random() * colors.length);
    const color = colors[colorIndex];
    
    const angle = Math.random() * 2 * Math.PI;
    const radius = 100 + Math.random() * 40;
    const centerX = 140;
    const centerY = 140;
    const x = Math.cos(angle) * radius + centerX - 17.5;
    const y = Math.sin(angle) * radius + centerY - 17.5;
    
    const newOrb = {
      id: Date.now() + Math.random(),
      colorName: color.name,
      colorValue: color.value,
      x,
      y,
      animationDelay: Math.random() * 2
    };
    
    setOrbs(prev => [...prev, newOrb]);
    
    setTimeout(() => {
      setOrbs(prev => prev.filter(orb => orb.id !== newOrb.id));
    }, 6000);
  }, [colors]);

  useEffect(() => {
    setNewTarget();
    spawnOrb();
    spawnOrb();
    spawnOrb();
  }, [setNewTarget, spawnOrb]);

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setShowModal(false);
    setNewTarget();
  };

  const handleOrbClick = (orb) => {
    if (!isPlaying) return;
    
    if (orb.colorName === currentTarget.name) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));
      setScore(prev => prev + (10 + (newCombo * 5)));
      setOrbs(prev => prev.filter(o => o.id !== orb.id));
      setNewTarget();
    } else {
      setCombo(0);
      setOrbs(prev => prev.filter(o => o.id !== orb.id));
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setShowModal(true);
  };

  const restartGame = () => {
    setOrbs([]);
    setShowModal(false);
    setNewTarget();
    spawnOrb();
    spawnOrb();
    spawnOrb();
  };

  const getPerformanceMessage = () => {
    if (score >= 500) return '🚀 REACTOR MASTER! Absolutely insane skills!';
    if (score >= 300) return '🔥 CHAOS CONTROLLER! Amazing reflexes!';
    if (score >= 150) return '⚡ ENERGY EXPERT! Great job!';
    if (score >= 50) return '💫 GOOD REACTION! Keep practicing!';
    return '💪 REACTOR ROOKIE! Try again for glory!';
  };

  return (
    <div className="game-container">
      <h1 className="title">💥 COLOR CHAOS</h1>
      <p className="subtitle">React fast! Match the glowing target!</p>
      
      <GameStats score={score} combo={combo} timeLeft={timeLeft} />
      
      <div className="reactor-container">
        <TargetIndicator target={currentTarget} />
        <ReactorCore 
          orbs={orbs} 
          onOrbClick={handleOrbClick} 
          combo={combo}
        />
      </div>
      
      <Controls 
        isPlaying={isPlaying} 
        onStart={startGame} 
      />
      
      <GameOverModal 
        show={showModal} 
        score={score} 
        maxCombo={maxCombo} 
        performanceMessage={getPerformanceMessage()} 
        onRestart={restartGame}
      />
    </div>
  );
};

export default GameContainer;