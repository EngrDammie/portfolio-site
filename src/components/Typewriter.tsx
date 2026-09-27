'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;    // Milliseconds per character while typing
  deletingSpeed?: number;  // Milliseconds per character while erasing
  pauseDuration?: number;  // Milliseconds to pause when a word is fully typed
}

export default function Typewriter({
  words,
  // ==========================================
  // ADJUST SPEEDS HERE (in milliseconds):
  // Lower number = FASTER | Higher number = SLOWER
  // ==========================================
  typingSpeed = 80,       // Natural human typing rhythm (default: 80ms)
  deletingSpeed = 40,     // Backspacing is typically 2x faster (default: 40ms)
  pauseDuration = 2000,   // Wait 2 seconds so the client can read the word (default: 2000ms)
}: TypewriterProps) {
  const [wordIndex, setWordIndex] = useState(0);
  // Start with the first word already rendered so a new visitor never stares at
  // a blank after "I build high-impact". Because useState's initial value is
  // used on the server too, the first paint already contains the word and the
  // hydration matches.
  const [displayText, setDisplayText] = useState(words[0] ?? '');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Current word in the rotation
    const currentWord = words[wordIndex % words.length];

    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // 1. TYPING PHASE: Add one character at a time
      if (displayText.length < currentWord.length) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Word is fully typed -> Pause before backspacing
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // 2. BACKSPACING PHASE: Remove one character at a time
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        // Word is completely erased -> Move to next word and start typing
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="inline-flex items-center">
      {/* Dynamic Gradient Text */}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
        {displayText}
      </span>

      {/* Blinking Cursor Bar */}
      <span
        aria-hidden="true"
        className="ml-1 inline-block w-[3px] h-[0.9em] bg-emerald-400 rounded-full animate-[pulse_1s_infinite] align-middle shadow-[0_0_8px_rgba(16,185,129,0.8)]"
      />
    </span>
  );
}