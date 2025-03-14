'use client';

import { useEffect, useState } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
}

export function TextScramble({ text, className }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('');
  // Only using letters for the scramble effect
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  useEffect(() => {
    let frame = 0;
    let resolveAnimation: () => void;
    const finalText = text;
    let currentText = '';
    const frames = 1.5; // Reduced frames for faster animation
    const duration = 100; // 1 second duration
    const totalSteps = finalText.length;
    const stepDuration = duration / totalSteps;

    const randomChar = () => characters[Math.floor(Math.random() * characters.length)];

    const animate = () => {
      let newText = '';
      let complete = 0;
      
      for (let i = 0; i < finalText.length; i++) {
        if (i < currentText.length) {
          newText += finalText[i];
          complete++;
        } else {
          newText += randomChar();
        }
      }

      setDisplayText(newText);

      if (complete < finalText.length) {
        if (frame % frames === 0) {
          currentText = finalText.slice(0, currentText.length + 1);
        }
        frame++;
        setTimeout(() => requestAnimationFrame(animate), stepDuration);
      } else if (resolveAnimation) {
        resolveAnimation();
      }
    };

    const startAnimation = () => {
      return new Promise<void>((resolve) => {
        resolveAnimation = resolve;
        frame = 0;
        currentText = '';
        animate();
      });
    };

    startAnimation();

    return () => {
      resolveAnimation?.();
    };
  }, [text]);

  return <span className={className}>{displayText}</span>;
} 