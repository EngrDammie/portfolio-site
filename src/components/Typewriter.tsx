'use client';

import { useState, useEffect, useMemo } from 'react';

/**
 * React.CSSProperties has no index signature, so custom properties like
 * `--dx` are rejected in an object literal. Each particle needs them, so this
 * widens the type once here instead of casting at every use site.
 */
type Style = React.CSSProperties & Record<`--${string}`, string | number>;

type Phase =
  | 'typing'
  | 'reading'
  | 'deleting'
  | 'burst'
  | 'stars'
  | 'hold'
  | 'fade';

interface TypewriterProps {
  /** The fixed half of the headline, e.g. "I build high-impact". */
  prefix?: string;
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  /**
   * The extra sequence: explode the last service, then bring in the closing
   * line among stars. When false, this component behaves exactly as it always
   * did — type, pause, delete, repeat, and none of the stages below ever run.
   */
  magic?: boolean;
  burstMs?: number;
  holdMs?: number;
  fadeMs?: number;
}

/** The closing line. 'build' and 'magical' carry the services' gradient. */
const MAGIC_LINE: { text: string; gradient: boolean; space: boolean }[] = [
  { text: 'Let\u2019s', gradient: false, space: true },
  { text: 'build', gradient: true, space: true },
  { text: 'something', gradient: false, space: true },
  { text: 'magical', gradient: true, space: true },
  { text: 'together!', gradient: false, space: false },
];

const GRADIENT = 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400';

/** Fire colours, sampled so the burst reads as flame rather than confetti. */
const FIRE = ['#fde047', '#fbbf24', '#fb923c', '#f97316', '#facc15'];
const STAR_TINTS = ['#34d399', '#22d3ee', '#a7f3d0', '#67e8f9', '#fef08a'];

/**
 * Deterministic particle layout.
 *
 * Math.random() is deliberately not used. These values are baked into inline
 * styles during render, so random ones would differ between the server and the
 * client and break hydration. A seeded generator also means the particles hold
 * still between re-renders instead of jittering on every state change.
 */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function makeSparks(count: number) {
  const rand = seeded(7);
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + rand() * 0.34;
    const distance = 34 + rand() * 82;
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance * 0.62,
      size: 2.5 + rand() * 4.2,
      delay: rand() * 160,
      duration: 820 + rand() * 420,
      color: FIRE[Math.floor(rand() * FIRE.length)],
    };
  });
}

function makeSmoke(count: number) {
  const rand = seeded(21);
  return Array.from({ length: count }, () => ({
    dx: (rand() - 0.5) * 120,
    drift: 24 + rand() * 54,
    size: 20 + rand() * 34,
    delay: 190 + rand() * 280,
    duration: 1080 + rand() * 520,
    opacity: 0.13 + rand() * 0.16,
  }));
}

function makeStars(count: number) {
  const rand = seeded(41);
  return Array.from({ length: count }, () => {
    const angle = rand() * Math.PI * 2;
    const distance = 46 + rand() * 132;
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance * 0.7,
      size: 5 + rand() * 11,
      delay: rand() * 760,
      duration: 1500 + rand() * 900,
      color: STAR_TINTS[Math.floor(rand() * STAR_TINTS.length)],
    };
  });
}

export default function Typewriter({
  prefix = '',
  words,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
  magic = true,
  burstMs = 1200,
  holdMs = 3500,
  fadeMs = 600,
}: TypewriterProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0] ?? '');
  const [phase, setPhase] = useState<Phase>('typing');
  const [revealed, setRevealed] = useState(0);

  /**
   * People who ask their device to reduce motion — around one in four — get the
   * sentence without the explosion, the sparks or the stars. An exploding
   * headline is genuinely unpleasant for people with vestibular disorders, so
   * this is a requirement rather than a nicety.
   */
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Built once. Recomputing these on every render would reshuffle the burst.
  const sparks = useMemo(() => makeSparks(30), []);
  const smoke = useMemo(() => makeSmoke(16), []);
  const stars = useMemo(() => makeStars(20), []);

  useEffect(() => {
    if (!words.length) return;
    const currentWord = words[wordIndex % words.length];
    const isLastWord = wordIndex === words.length - 1;
    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'burst') {
      timer = setTimeout(() => {
        setRevealed(reduceMotion ? MAGIC_LINE.length : 0);
        setPhase('stars');
      }, burstMs);
    } else if (phase === 'stars') {
      if (revealed < MAGIC_LINE.length) {
        timer = setTimeout(() => setRevealed((n) => n + 1), 190);
      } else {
        timer = setTimeout(() => setPhase('hold'), 240);
      }
    } else if (phase === 'hold') {
      timer = setTimeout(() => setPhase('fade'), holdMs);
    } else if (phase === 'fade') {
      timer = setTimeout(() => {
        setPhase('typing');
        setRevealed(0);
        setWordIndex(0);
        setDisplayText(words[0]);
      }, fadeMs);
    } else if (phase === 'typing') {
      if (displayText.length < currentWord.length) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else if (magic && isLastWord) {
        // The explosion happens the moment the final service is fully typed,
        // before the normal pause-and-delete, so the words are still on screen
        // to burn away.
        setPhase('burst');
      } else {
        timer = setTimeout(() => setPhase('reading'), pauseDuration);
      }
    } else if (phase === 'reading') {
      timer = setTimeout(() => setPhase('deleting'), 140);
    } else if (phase === 'deleting') {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        setPhase('typing');
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [
    displayText,
    phase,
    revealed,
    wordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    magic,
    burstMs,
    holdMs,
    fadeMs,
    reduceMotion,
  ]);

  const showBurst = magic && phase === 'burst' && !reduceMotion;
  const showStars = magic && phase === 'stars' && !reduceMotion;
  const showMagicLine = magic && (phase === 'stars' || phase === 'hold' || phase === 'fade');

  return (
    <span className="relative inline-block align-middle">
      {/* Both lines sit in normal flow and are swapped by condition, so the
          heading keeps its height. The earlier version absolutely positioned the
          closing sentence, which made it paint straight over the paragraph
          underneath instead of taking its place. */}
      {showMagicLine ? (
        <>
          <span className="sr-only">Let us build something magical together.</span>
          <span aria-hidden="true" className="block">
            {MAGIC_LINE.slice(0, revealed).map((part, i) => (
              <span
                key={`${part.text}-${i}`}
                className={part.gradient ? GRADIENT : 'text-white'}
                style={{
                  display: 'inline-block',
                  animation: reduceMotion
                    ? undefined
                    : `do-emerge 620ms cubic-bezier(0.2,0.8,0.25,1) forwards`,
                }}
              >
                {part.text}
                {part.space && <span className="inline-block w-[0.26em]" />}
              </span>
            ))}
          </span>
        </>
      ) : (
        <span className="block">
          {prefix}
          <span
            className={GRADIENT}
            style={
              showBurst
                ? { animation: `do-burn ${burstMs}ms ease-out forwards` }
                : undefined
            }
          >
            {displayText}
          </span>

          {/* Cursor: hidden while the words are burning away. */}
          <span
            aria-hidden="true"
            className="ml-1 inline-block w-[3px] h-[0.9em] bg-emerald-400 rounded-full animate-[pulse_1s_infinite] align-middle shadow-[0_0_8px_rgba(16,185,129,0.8)]"
            style={{ opacity: showBurst ? 0 : 1 }}
          />
        </span>
      )}

      {/* Particles are decorative and positioned against the line. */}
      {showBurst && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0">
          {smoke.map((p, i) => (
            <span
              key={`smoke-${i}`}
              className="absolute left-1/2 top-1/2 rounded-full bg-slate-200"
              style={{
                width: p.size,
                height: p.size,
                '--dx': p.dx,
                '--drift': p.drift,
                opacity: p.opacity,
                filter: 'blur(13px)',
                animation: `do-smoke ${p.duration}ms ease-out ${p.delay}ms forwards`,
              } as Style}
            />
          ))}
          {sparks.map((p, i) => (
            <span
              key={`spark-${i}`}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: p.size,
                height: p.size,
                '--dx': p.dx,
                '--dy': p.dy,
                background: p.color,
                boxShadow: `0 0 7px ${p.color}`,
                animation: `do-spark ${p.duration}ms cubic-bezier(0.16,0.7,0.35,1) ${p.delay}ms forwards`,
              } as Style}
            />
          ))}
        </span>
      )}

      {showStars && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0">
          {stars.map((p, i) => (
            <span
              key={`star-${i}`}
              className="absolute left-1/2 top-1/2"
              style={{
                width: p.size,
                height: p.size,
                '--dx': p.dx,
                '--dy': p.dy,
                background: p.color,
                boxShadow: `0 0 10px ${p.color}`,
                clipPath:
                  'polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)',
                animation: `do-star ${p.duration}ms ease-out ${p.delay}ms forwards`,
              } as Style}
            />
          ))}
        </span>
      )}
    </span>
  );
}
