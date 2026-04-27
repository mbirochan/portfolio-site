'use client';
import { useEffect, useState } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function TextScramble({ text, className }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let frame = 0;
    let revealed = 0;
    const frames = 1.5;
    const stepDuration = 100 / text.length;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const randomChar = () => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

    const animate = () => {
      if (cancelled) return;
      let next = '';
      for (let i = 0; i < text.length; i++) {
        next += i < revealed ? text[i] : randomChar();
      }
      setDisplayText(next);

      if (revealed < text.length) {
        if (frame % frames === 0) revealed++;
        frame++;
        timeoutId = setTimeout(animate, stepDuration);
      }
    };

    animate();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text]);

  return <span className={className}>{displayText}</span>;
}
