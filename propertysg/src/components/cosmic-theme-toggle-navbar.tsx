"use client"

import React from 'react';
import styled from 'styled-components';
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const CosmicThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Show a simple placeholder while loading
    return (
      <div className="w-20 h-10 bg-white/10 border border-white/20 rounded-full animate-pulse" />
    )
  }

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <StyledWrapper>
      <label className="cosmic-toggle">
        <input 
          className="toggle" 
          type="checkbox" 
          checked={theme === 'dark'}
          onChange={handleToggle}
        />
        <div className="slider">
          <div className="cosmos" />
          <div className="energy-line" />
          <div className="energy-line" />
          <div className="energy-line" />
          <div className="toggle-orb">
            <div className="inner-orb" />
            <div className="ring" />
          </div>
          <div className="particles">
            <div style={{'--angle': '30deg'} as React.CSSProperties} className="particle" />
            <div style={{'--angle': '60deg'} as React.CSSProperties} className="particle" />
            <div style={{'--angle': '90deg'} as React.CSSProperties} className="particle" />
            <div style={{'--angle': '120deg'} as React.CSSProperties} className="particle" />
            <div style={{'--angle': '150deg'} as React.CSSProperties} className="particle" />
            <div style={{'--angle': '180deg'} as React.CSSProperties} className="particle" />
          </div>
        </div>
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Ensure the component is visible */
  display: block;
  position: relative;
  z-index: 10;

  .cosmic-toggle {
    position: relative;
    display: block;
    width: 80px;
    height: 40px;
    transform-style: preserve-3d;
    perspective: 500px;
  }

  .toggle {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #1a1a2e, #16213e);
    border-radius: 20px;
    transition: all 0.5s ease;
    transform-style: preserve-3d;
    box-shadow:
      0 0 20px rgba(0, 0, 0, 0.5),
      inset 0 0 15px rgba(255, 255, 255, 0.05);
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .cosmos {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(1px 1px at 10% 10%, #fff 100%, transparent),
      radial-gradient(1px 1px at 20% 20%, #fff 100%, transparent),
      radial-gradient(2px 2px at 30% 30%, #fff 100%, transparent),
      radial-gradient(1px 1px at 40% 40%, #fff 100%, transparent),
      radial-gradient(2px 2px at 50% 50%, #fff 100%, transparent),
      radial-gradient(1px 1px at 60% 60%, #fff 100%, transparent),
      radial-gradient(2px 2px at 70% 70%, #fff 100%, transparent),
      radial-gradient(1px 1px at 80% 80%, #fff 100%, transparent),
      radial-gradient(1px 1px at 90% 90%, #fff 100%, transparent);
    background-size: 200% 200%;
    opacity: 0.1;
    transition: 0.5s;
  }

  .toggle-orb {
    position: absolute;
    height: 36px;
    width: 36px;
    left: 2px;
    bottom: 2px;
    background: linear-gradient(145deg, #ff6b6b, #4ecdc4);
    border-radius: 50%;
    transition: 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    transform-style: preserve-3d;
    z-index: 2;
  }

  .inner-orb {
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: linear-gradient(145deg, #fff, #e6e6e6);
    transition: 0.5s;
    overflow: hidden;
  }

  .inner-orb::before {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(0, 0, 0, 0.1) 10deg,
      transparent 20deg
    );
    animation: patternRotate 10s linear infinite;
  }

  .ring {
    position: absolute;
    inset: -2px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transition: 0.5s;
  }

  .toggle:checked + .slider {
    background: linear-gradient(45deg, #16213e, #1a1a2e);
  }

  .toggle:checked + .slider .toggle-orb {
    transform: translateX(40px) rotate(360deg);
    background: linear-gradient(145deg, #4ecdc4, #45b7af);
  }

  .toggle:checked + .slider .inner-orb {
    background: linear-gradient(145deg, #45b7af, #3da89f);
    transform: scale(0.9);
  }

  .toggle:checked + .slider .ring {
    border-color: rgba(78, 205, 196, 0.3);
    animation: ringPulse 2s infinite;
  }

  .energy-line {
    position: absolute;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(78, 205, 196, 0.5),
      transparent
    );
    transform-origin: left;
    opacity: 0;
    transition: 0.5s;
  }

  .energy-line:nth-child(2) {
    top: 20%;
    transform: rotate(15deg);
  }
  .energy-line:nth-child(3) {
    top: 50%;
    transform: rotate(0deg);
  }
  .energy-line:nth-child(4) {
    top: 80%;
    transform: rotate(-15deg);
  }

  .toggle:checked + .slider .energy-line {
    opacity: 1;
    animation: energyFlow 2s linear infinite;
  }

  .particles {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: #4ecdc4;
    border-radius: 50%;
    opacity: 0;
  }

  .toggle:checked + .slider .particle {
    animation: particleBurst 1s ease-out infinite;
  }

  .particle:nth-child(1) {
    left: 20%;
    animation-delay: 0s;
  }
  .particle:nth-child(2) {
    left: 40%;
    animation-delay: 0.2s;
  }
  .particle:nth-child(3) {
    left: 60%;
    animation-delay: 0.4s;
  }
  .particle:nth-child(4) {
    left: 80%;
    animation-delay: 0.6s;
  }
  .particle:nth-child(5) {
    left: 30%;
    animation-delay: 0.8s;
  }
  .particle:nth-child(6) {
    left: 70%;
    animation-delay: 1s;
  }

  @keyframes ringPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.6;
    }
  }

  @keyframes patternRotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes energyFlow {
    0% {
      transform: scaleX(0) translateX(0);
      opacity: 0;
    }
    50% {
      transform: scaleX(1) translateX(50%);
      opacity: 1;
    }
    100% {
      transform: scaleX(0) translateX(100%);
      opacity: 0;
    }
  }

  @keyframes particleBurst {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(
          calc(cos(var(--angle)) * 30px),
          calc(sin(var(--angle)) * 30px)
        )
        scale(0);
      opacity: 0;
    }
  }

  .slider:hover .toggle-orb {
    filter: brightness(1.2);
    box-shadow:
      0 0 20px rgba(78, 205, 196, 0.5),
      0 0 40px rgba(78, 205, 196, 0.3);
  }

  .slider:hover .cosmos {
    opacity: 0.2;
    animation: cosmosPan 20s linear infinite;
  }

  @keyframes cosmosPan {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: 200% 200%;
    }
  }

  .toggle:active + .slider .toggle-orb {
    transform: scale(0.95);
  }

  .cosmic-toggle:hover .slider {
    transform: rotateX(10deg) rotateY(10deg);
  }

  .cosmic-toggle:hover .toggle-orb {
    transform: translateZ(10px);
  }

  .toggle:checked + .slider::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(78, 205, 196, 0.2),
      transparent 50%
    );
    opacity: 0;
    animation: glowFollow 2s linear infinite;
  }

  @keyframes glowFollow {
    0%, 100% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export default CosmicThemeToggle;