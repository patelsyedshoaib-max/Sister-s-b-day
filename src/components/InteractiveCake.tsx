import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Flame, RotateCcw, Heart, Gift } from 'lucide-react';
import { triggerWishSparkles, triggerFullCelebration } from './CelebrationCanvas';
import { audioEngine } from '../utils/audioPlayer';

interface InteractiveCakeProps {
  personName: string;
  emotionalMessage: string;
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({
  personName,
  emotionalMessage,
}) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [hasWished, setHasWished] = useState(false);
  const [smokeActive, setSmokeActive] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typeIndexRef = useRef(0);
  const typingTimerRef = useRef<number | null>(null);

  const fullText = emotionalMessage;

  // Typing effect when candle is blown
  useEffect(() => {
    if (hasWished && !candlesLit) {
      setIsTyping(true);
      setTypedMessage('');
      typeIndexRef.current = 0;

      if (typingTimerRef.current) clearInterval(typingTimerRef.current);

      typingTimerRef.current = window.setInterval(() => {
        if (typeIndexRef.current < fullText.length) {
          setTypedMessage(fullText.slice(0, typeIndexRef.current + 1));
          typeIndexRef.current += 1;
        } else {
          setIsTyping(false);
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        }
      }, 30);
    }

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [hasWished, candlesLit, fullText]);

  const handleMakeAWish = () => {
    // 1. Play breath sound and sparkle
    audioEngine.playCandleBlowSound();
    setCandlesLit(false);
    setSmokeActive(true);
    setHasWished(true);

    // 2. Confetti & sparkle explosion
    setTimeout(() => {
      audioEngine.playSparkleEffect();
      triggerWishSparkles(0.5, 0.45);
      triggerFullCelebration();
    }, 250);

    // 3. Turn off smoke animation after 2.5s
    setTimeout(() => {
      setSmokeActive(false);
    }, 2500);
  };

  const handleRelight = () => {
    setCandlesLit(true);
    setSmokeActive(false);
    audioEngine.playSparkleEffect();
    triggerWishSparkles(0.5, 0.4);
  };

  return (
    <section id="cake-section" className="py-12 sm:py-20 px-4 sm:px-6 relative scroll-mt-24">
      <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
        {/* Section Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-rose-600 dark:text-rose-300 text-xs sm:text-sm font-semibold tracking-wide border border-rose-200/60 dark:border-rose-800/40">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>The Moment of Magic</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">
            Close Your Eyes &amp; Make a Wish ✨
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-md mx-auto">
            {candlesLit
              ? 'Blow out the candles to unlock your special birthday blessing!'
              : 'Your wish has flown up into the stars! 🌟'}
          </p>
        </div>

        {/* Cake Container with 3D perspective shadow */}
        <div className="relative flex flex-col items-center justify-center pt-8 pb-4">
          {/* Cake SVG Illustration */}
          <div className="relative w-72 sm:w-96 select-none">
            {/* Candle Flames & Smoke */}
            <div className="absolute top-[8px] sm:top-[12px] left-0 right-0 flex justify-center items-center gap-7 sm:gap-11 z-20">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative flex flex-col items-center">
                  {/* Glowing Flame */}
                  {candlesLit && (
                    <div
                      className="w-5 h-7 sm:w-6 sm:h-9 bg-gradient-to-t from-rose-500 via-amber-400 to-yellow-100 rounded-full flame-active transition-all duration-300"
                      style={{
                        animationDelay: `${i * 0.22}s`,
                        boxShadow: '0 -4px 18px #f59e0b, 0 0 25px #f43f5e',
                      }}
                    />
                  )}

                  {/* Smoke puff when blown out */}
                  {smokeActive && !candlesLit && (
                    <div
                      className="absolute -top-6 w-5 h-6 bg-slate-400/40 dark:bg-slate-200/40 rounded-full blur-[2px] animate-smoke"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  )}

                  {/* Candle Wick */}
                  <div className="w-1 h-2.5 bg-neutral-800 rounded-t" />

                  {/* Candle Stick */}
                  <div
                    className={`w-3.5 sm:w-4 h-12 sm:h-16 rounded-t-sm shadow-md ${
                      i === 1
                        ? 'bg-gradient-to-b from-rose-200 via-pink-300 to-rose-400'
                        : i === 0
                        ? 'bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400'
                        : 'bg-gradient-to-b from-purple-200 via-pink-200 to-purple-300'
                    }`}
                  >
                    {/* Spiral stripes */}
                    <div className="w-full h-full opacity-35 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,white_4px,white_8px)]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Cake SVG Layers */}
            <svg
              viewBox="0 0 400 320"
              className="w-full h-auto drop-shadow-2xl overflow-visible"
            >
              <defs>
                <linearGradient id="frostingTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff5f5" />
                  <stop offset="50%" stopColor="#ffd1dc" />
                  <stop offset="100%" stopColor="#ffb3c6" />
                </linearGradient>

                <linearGradient id="cakeTier1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ff758f" />
                  <stop offset="50%" stopColor="#ff4d6d" />
                  <stop offset="100%" stopColor="#c9184a" />
                </linearGradient>

                <linearGradient id="cakeTier2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffb3c6" />
                  <stop offset="50%" stopColor="#ff758f" />
                  <stop offset="100%" stopColor="#d90429" />
                </linearGradient>

                <linearGradient id="cakeTier3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fff0f3" />
                  <stop offset="50%" stopColor="#ffccd5" />
                  <stop offset="100%" stopColor="#ff4d6d" />
                </linearGradient>

                <linearGradient id="plateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>

              {/* Pedestal Stand / Plate */}
              <ellipse cx="200" cy="285" rx="180" ry="25" fill="url(#plateGrad)" stroke="#e2e8f0" strokeWidth="3" />
              <ellipse cx="200" cy="280" rx="170" ry="20" fill="#f8fafc" />

              {/* Bottom Tier (Tier 3) */}
              <g id="bottom-tier">
                <path
                  d="M 60 210 Q 200 240 340 210 L 340 270 Q 200 300 60 270 Z"
                  fill="url(#cakeTier3)"
                />
                {/* Decorative Pearl Dots */}
                {[80, 110, 140, 170, 200, 230, 260, 290, 320].map((cx, idx) => (
                  <circle key={idx} cx={cx} cy="265" r="4.5" fill="#ffffff" opacity="0.9" />
                ))}
              </g>

              {/* Middle Tier (Tier 2) */}
              <g id="middle-tier">
                <path
                  d="M 95 150 Q 200 178 305 150 L 305 210 Q 200 240 95 210 Z"
                  fill="url(#cakeTier2)"
                />
                {/* Wavy Dripping Frosting */}
                <path
                  d="M 95 150 
                     Q 110 175 125 152 
                     Q 140 182 155 154 
                     Q 175 186 195 153 
                     Q 215 185 235 154 
                     Q 255 183 275 152 
                     Q 290 174 305 150 
                     Q 200 172 95 150 Z"
                  fill="#ffffff"
                  opacity="0.85"
                />
              </g>

              {/* Top Tier (Tier 1) */}
              <g id="top-tier">
                <path
                  d="M 130 90 Q 200 115 270 90 L 270 150 Q 200 178 130 150 Z"
                  fill="url(#cakeTier1)"
                />
                {/* Top Frosting Ellipse */}
                <ellipse cx="200" cy="90" rx="70" ry="18" fill="url(#frostingTop)" />

                {/* Top Dripping Cream */}
                <path
                  d="M 130 90 
                     Q 145 115 160 93 
                     Q 175 120 190 94 
                     Q 210 122 225 93 
                     Q 245 118 260 92 
                     L 270 90 
                     Q 200 115 130 90 Z"
                  fill="#ffffff"
                />

                {/* Sweet Cherries & Berries on Top */}
                <circle cx="160" cy="85" r="7" fill="#be123c" />
                <circle cx="158" cy="83" r="2" fill="#fda4af" />
                <circle cx="200" cy="88" r="8" fill="#be123c" />
                <circle cx="198" cy="85" r="2.5" fill="#fda4af" />
                <circle cx="240" cy="85" r="7" fill="#be123c" />
                <circle cx="238" cy="83" r="2" fill="#fda4af" />
              </g>

              {/* Colorful Sprinkles */}
              <g id="sprinkles" opacity="0.85">
                <line x1="160" y1="130" x2="168" y2="135" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
                <line x1="220" y1="132" x2="228" y2="128" stroke="#a7f3d0" strokeWidth="3" strokeLinecap="round" />
                <line x1="185" y1="140" x2="193" y2="142" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <line x1="245" y1="136" x2="252" y2="142" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round" />

                <line x1="130" y1="190" x2="140" y2="195" stroke="#fef08a" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="180" y1="198" x2="190" y2="192" stroke="#bae6fd" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="230" y1="192" x2="238" y2="200" stroke="#fbcfe8" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="270" y1="195" x2="280" y2="190" stroke="#fef08a" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            </svg>
          </div>

          {/* Interactive Wish / Relight Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {candlesLit ? (
              <button
                onClick={handleMakeAWish}
                id="make-a-wish-btn"
                className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base sm:text-lg font-bold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border border-white/20"
              >
                <Flame className="w-5 h-5 text-yellow-200 group-hover:scale-125 transition-transform" />
                <span>Make a Wish ✨</span>
              </button>
            ) : (
              <button
                onClick={handleRelight}
                id="relight-candles-btn"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold glass-card text-rose-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-slate-800/80 shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-rose-200/60 dark:border-rose-800/40"
              >
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <span>Light Candles Again 🕯️</span>
              </button>
            )}
          </div>
        </div>

        {/* Revealed Main Birthday Message & Typewriter Animation */}
        <div
          className={`transition-all duration-700 transform ${
            hasWished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          }`}
        >
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-rose-200/60 dark:border-rose-900/50 shadow-2xl relative overflow-hidden max-w-3xl mx-auto glow-romantic">
            {/* Background glowing gradient accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-rose-400/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4 sm:space-y-6">
              {/* Main Headline */}
              <div className="inline-block">
                <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 dark:from-rose-400 dark:via-pink-300 dark:to-amber-300 bg-clip-text text-transparent">
                  🎂 Happy Birthday, {personName}! ❤️
                </h3>
                <div className="h-1 w-24 bg-gradient-to-r from-rose-500 to-amber-400 rounded-full mx-auto mt-2" />
              </div>

              {/* Typewriter Emotional Message */}
              <div className="min-h-[110px] sm:min-h-[90px] flex items-center justify-center">
                <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {typedMessage}
                  {isTyping && (
                    <span className="inline-block w-1.5 h-5 bg-rose-500 ml-1 animate-pulse align-middle" />
                  )}
                </p>
              </div>

              {/* Heartfelt Blessing Footer */}
              <div className="pt-2 flex items-center justify-center gap-3 text-rose-500 dark:text-rose-400 text-sm font-semibold">
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>Today and every day, you are loved and appreciated</span>
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
