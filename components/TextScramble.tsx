'use client';
import { useEffect, useState } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
}

export function TextScramble({ text, className }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
  useEffect(() => {
    let frame = 0;
    const finalText = text;
    let currentText = '';
    const frames = 1.5; 
    const duration = 100; 
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
          currentText = finalText.substring(0, currentText.length + 1);
        }
        frame++;
        setTimeout(animate, stepDuration);
      }
    };
    
    animate();
    
    return () => {
      currentText = '';
    };
  }, [text, characters]);
  
  return <span className={className}>{displayText}</span>;
} 