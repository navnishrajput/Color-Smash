import React, { useState, useEffect, useRef } from 'react';
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
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const gameTimerRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const reactorRef = useRef(null);

  useEffect(() => {
    // Initial setup
    setNewTarget();
    spawnOrb();
    spawnOrb();
    spawnOrb();

    return () => {
      clearTimers();
    };
  }, []);

  const clearTimers = () => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
  };

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameOver(false);
    setShowModal(false);
    
    clearTimers();
    startTimer();
    startSpawning();
  };

  const startTimer = () => {
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startSpawning = () => {
    spawnTimerRef.current = setInterval(() => {
      if (orbs.length < 6) {
        spawnOrb();
      }
    }, 1800);
  };

  const spawnOrb = () => {
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
    
    // Remove orb after some time if not clicked
    setTimeout(() => {
      setOrbs(prev => prev.filter(orb => orb.id !== newOrb.id));
    }, 6000);
  };

  const handleOrbClick = (orb) => {
    if (!isPlaying) return;
    
    if (orb.colorName === currentTarget.name) {
      correctHit(orb);
    } else {
      incorrectHit(orb);
    }
  };

  const correctHit = (orb) => {
    const newCombo = combo + 1;
    setCombo(newCombo);
    setMaxCombo(prev => Math.max(prev, newCombo));
    
    const points = 10 + (newCombo * 5);
    setScore(prev => prev + points);
    
    // Remove the clicked orb
    setOrbs(prev => prev.filter(o => o.id !== orb.id));
    
    setNewTarget();
  };

  const incorrectHit = (orb) => {
    setCombo(0);
    setOrbs(prev => prev.filter(o => o.id !== orb.id));
  };

  const setNewTarget = () => {
    const target = colors[Math.floor(Math.random() * colors.length)];
    setCurrentTarget(target);
  };

  const pauseGame = () => {
    setIsPlaying(prev => {
      if (prev) {
        clearTimers();
      } else {
        startTimer();
        startSpawning();
      }
      return !prev;
    });
  };

  const endGame = () => {
    setIsPlaying(false);
    clearTimers();
    setGameOver(true);
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

  const shareScore = () => {
    const text = `💥 I just scored ${score} points in Color Chaos Reactor with a ${maxCombo}x max combo! ⚡ Can you handle the chaos? 🎯 #ColorChaos #ReactorGame #ViralChallenge`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Color Chaos Reactor Challenge',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href);
      alert('🎯 Score copied! Share the chaos on social media! 💥');
    }
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
          ref={reactorRef}
        />
      </div>
      
      <Controls 
        isPlaying={isPlaying} 
        onStart={startGame} 
        onPause={pauseGame} 
      />
      
      <GameOverModal 
        show={showModal} 
        score={score} 
        maxCombo={maxCombo} 
        performanceMessage={getPerformanceMessage()} 
        onRestart={restartGame} 
        onShare={shareScore} 
      />
    </div>
  );
};

export default GameContainer;