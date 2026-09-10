import React from 'react';
import { Heart, Sparkles, Gift, RotateCcw } from 'lucide-react';
import { triggerFullCelebration, triggerHeartShower } from './CelebrationCanvas';
import { audioEngine } from '../utils/audioPlayer';

interface FinalSurpriseProps {
  personName: string;
  finalMessage: string;
  onRestartCelebration: () => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({
  personName,
  finalMessage,
  onRestartCelebration,
}) => {
  const handleCelebrateAgain = () => {
    audioEngine.playSparkleEffect();
    audioEngine.startCelebrationSong();
    triggerFullCelebration();
    triggerHeartShower();
    onRestartCelebration();
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 overflow-hidden">
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-gradient-to-tr from-rose-500/20 via-pink-400/20 to-amber-300/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      <div className="max-w-3xl w-full mx-auto relative z-10 space-y-6 sm:space-y-8 glass-card rounded-3xl p-8 sm:p-14 border border-rose-200/60 dark:border-rose-900/40 shadow-2xl glow-romantic">
        {/* Sub-header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs sm:text-sm font-semibold tracking-wide border border-rose-200/60 dark:border-rose-800/40">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Once Again... 🎂</span>
        </div>

        {/* Grand Headline */}
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
          Happy Birthday,{' '}
          <span className="bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 dark:from-rose-400 dark:via-pink-300 dark:to-amber-300 bg-clip-text text-transparent">
            {personName}
          </span>{' '}
          ❤️
        </h2>

        {/* Heartfelt Note */}
        <p className="font-display text-xl sm:text-2xl text-slate-700 dark:text-slate-200 font-medium max-w-xl mx-auto leading-relaxed">
          &ldquo;{finalMessage}&rdquo;
        </p>

        {/* Floating Icons Decor */}
        <div className="flex items-center justify-center gap-4 text-rose-500 py-2">
          <Heart className="w-5 h-5 fill-rose-500 animate-bounce" />
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin-slow" />
          <Gift className="w-5 h-5 text-pink-500" />
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin-slow" />
          <Heart className="w-5 h-5 fill-rose-500 animate-bounce delay-150" />
        </div>

        {/* Grand Celebrate Again Button */}
        <div className="pt-4">
          <button
            onClick={handleCelebrateAgain}
            id="celebrate-again-btn"
            className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-full text-base sm:text-xl font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 shadow-xl shadow-rose-500/35 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border border-white/25"
          >
            <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
            <span>🎁 Celebrate Again</span>
            <Sparkles className="w-5 h-5 text-amber-200" />
          </button>
        </div>

        {/* Soft Footer Credit */}
        <div className="pt-6 border-t border-rose-200/40 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <span>Crafted with endless love &amp; admiration for your special day</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>
      </div>
    </section>
  );
};
