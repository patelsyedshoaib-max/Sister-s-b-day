import React, { useState } from 'react';
import { Mail, Heart, Sparkles, Send, Check } from 'lucide-react';
import { audioEngine } from '../utils/audioPlayer';
import { triggerHeartShower } from './CelebrationCanvas';

interface SpecialLetterProps {
  personName: string;
  letterTitle: string;
  letterBody: string[];
  letterSignOff: string;
}

export const SpecialLetter: React.FC<SpecialLetterProps> = ({
  personName,
  letterTitle,
  letterBody,
  letterSignOff,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  const handleOpenLetter = () => {
    audioEngine.playSparkleEffect();
    triggerHeartShower();
    setIsOpen(true);
  };

  const handleCopy = () => {
    const fullText = `${letterTitle}\n\n${letterBody.join('\n\n')}\n\n${letterSignOff}`;
    navigator.clipboard.writeText(fullText);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2500);
  };

  return (
    <section id="letter-section" className="py-14 sm:py-20 px-4 sm:px-6 relative scroll-mt-24">
      <div className="max-w-3xl mx-auto space-y-8 sm:space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-rose-600 dark:text-rose-300 text-xs sm:text-sm font-semibold tracking-wide border border-rose-200/60 dark:border-rose-800/40">
            <Mail className="w-4 h-4 text-rose-500" />
            <span>Words from the Heart</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">
            💌 A Little Message For You
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-md mx-auto">
            Some feelings are best expressed in a letter kept close to the heart.
          </p>
        </div>

        {/* Envelope / Letter Card */}
        <div className="relative">
          {!isOpen ? (
            /* Sealed Envelope State */
            <div className="glass-card rounded-3xl p-8 sm:p-14 border border-rose-200/60 dark:border-rose-900/40 shadow-2xl text-center space-y-6 relative overflow-hidden group hover:border-rose-300 transition-all duration-300">
              {/* Background ambient glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-400/10 rounded-full blur-2xl pointer-events-none" />

              {/* Wax Seal Icon */}
              <div className="relative inline-flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 flex items-center justify-center shadow-xl shadow-rose-500/30 group-hover:scale-105 transition-transform duration-300">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white shadow-md">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Private Birthday Letter for {personName}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Carefully sealed with love, warmth, and heartfelt prayers.
                </p>
              </div>

              {/* Reveal Button */}
              <div>
                <button
                  onClick={handleOpenLetter}
                  id="read-my-message-btn"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-base sm:text-lg font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
                >
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>Read My Message 💖</span>
                </button>
              </div>
            </div>
          ) : (
            /* Unfolded Handwritten Letter State */
            <div className="glass-panel rounded-3xl p-6 sm:p-12 border-2 border-rose-300/60 dark:border-rose-800/60 shadow-2xl relative overflow-hidden animate-fadeIn bg-amber-50/50 dark:bg-slate-900/80">
              {/* Paper stamp or watermark */}
              <div className="absolute top-6 right-6 opacity-15 pointer-events-none">
                <Heart className="w-32 h-32 text-rose-500 fill-rose-500" />
              </div>

              <div className="relative z-10 space-y-6">
                {/* Letter Header */}
                <div className="border-b border-rose-200/50 dark:border-slate-800 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <Heart className="w-5 h-5 fill-rose-500" />
                    <span className="font-display font-semibold text-base sm:text-lg">
                      {letterTitle}
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-rose-100 dark:bg-slate-800 text-rose-700 dark:text-rose-300 hover:bg-rose-200 transition-colors flex items-center gap-1.5"
                    title="Copy letter text"
                  >
                    {copiedNote ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Copy Letter
                      </>
                    )}
                  </button>
                </div>

                {/* Letter Body in Elegant Handwritten Script Style */}
                <div className="space-y-4 text-slate-800 dark:text-slate-100">
                  {letterBody.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="font-script text-2xl sm:text-3xl leading-relaxed text-slate-800 dark:text-rose-100"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Sign-off */}
                <div className="pt-6 border-t border-rose-200/50 dark:border-slate-800">
                  <p className="font-script text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-300">
                    {letterSignOff}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
