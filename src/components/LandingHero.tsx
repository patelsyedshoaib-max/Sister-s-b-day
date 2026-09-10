import React, { useState, useEffect } from 'react';
import { Gift, Heart, Sparkles, Clock, PartyPopper } from 'lucide-react';
import { triggerFullCelebration } from './CelebrationCanvas';
import { audioEngine } from '../utils/audioPlayer';

interface LandingHeroProps {
  personName: string;
  birthdayDate: string;
  onOpenSurprise: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  personName,
  birthdayDate,
  onOpenSurprise,
}) => {
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      let target: Date;

      if (birthdayDate) {
        if (birthdayDate.includes('T')) {
          target = new Date(birthdayDate);
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(birthdayDate)) {
          const [y, m, d] = birthdayDate.split('-').map(Number);
          target = new Date(y, m - 1, d, 20, 0, 0); // 8:00 PM celebration evening
        } else {
          target = new Date(birthdayDate);
        }
      } else {
        // Fallback default: 2 days ahead
        target = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
      }

      let diff = target.getTime() - now.getTime();
      if (isNaN(diff) || diff <= 0) {
        // Active celebration mode! Keep hours/mins ticking
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        diff = Math.max(0, endOfDay.getTime() - now.getTime());
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [birthdayDate]);

  const handleSurpriseClick = () => {
    // Play celebratory music and sound
    audioEngine.playSparkleEffect();
    audioEngine.startCelebrationSong();
    triggerFullCelebration();
    onOpenSurprise();
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 pb-16 overflow-hidden">
      {/* Soft Romantic Ambient Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] h-[340px] sm:h-[580px] bg-gradient-to-tr from-rose-400/25 via-pink-300/20 to-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Landing Card */}
      <div className="max-w-2xl w-full mx-auto relative z-10 space-y-6 sm:space-y-8 animate-fadeIn">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-rose-600 dark:text-rose-300 text-xs sm:text-sm font-semibold tracking-wide shadow-sm border border-rose-200/60 dark:border-rose-800/40 animate-soft-float">
          <PartyPopper className="w-4 h-4 text-rose-500 animate-bounce" />
          <span>🎉 A Special Surprise For You 🎉</span>
        </div>

        {/* Primary Invitation Headline */}
        <div className="space-y-3">
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-800 dark:text-slate-100 leading-tight">
            {timeLeft.days > 0 ? (
              <>
                The Grand Celebration is in{' '}
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                  {timeLeft.days} {timeLeft.days === 1 ? 'Day' : 'Days'}
                </span>
                ! 🎉
              </>
            ) : (
              <>
                Someone special has a birthday today...{' '}
                <span className="inline-block text-rose-500 animate-pulse">❤️</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-lg mx-auto">
            {timeLeft.days > 0
              ? 'Get ready! The countdown is ticking for the most special celebration of the year ✨'
              : 'Today the universe shines a little brighter in honor of someone truly extraordinary.'}
          </p>
        </div>

        {/* Countdown Timer Block */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-rose-200/50 dark:border-rose-900/40 shadow-xl max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-rose-500 dark:text-rose-400 mb-4">
            <Clock className="w-3.5 h-3.5 animate-spin-slow" />
            <span>
              {timeLeft.days > 0
                ? `Celebration Countdown • ${timeLeft.days} ${timeLeft.days === 1 ? 'Day' : 'Days'} To Go! ⏳`
                : 'Celebration Countdown • Today is The Day! 🎉'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Mins', val: timeLeft.minutes },
              { label: 'Secs', val: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/75 dark:bg-slate-900/65 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center shadow-inner border border-rose-100/60 dark:border-slate-800"
              >
                <span className="font-display text-xl sm:text-3xl font-bold bg-gradient-to-br from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
                  {String(item.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grand CTA Button */}
        <div className="pt-2 sm:pt-4">
          <button
            onClick={handleSurpriseClick}
            id="open-surprise-button"
            className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 shadow-xl shadow-rose-500/35 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border border-white/25"
          >
            {/* Shimmer sweep effect */}
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Gift className="w-5 h-5 text-white" />
            </div>

            <span className="tracking-wide">🎁 Open Your Birthday Surprise</span>

            <Sparkles className="w-5 h-5 text-amber-200 animate-spin-slow" />
          </button>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>Turn on sound for a special musical surprise!</span>
          </p>
        </div>
      </div>
    </section>
  );
};
