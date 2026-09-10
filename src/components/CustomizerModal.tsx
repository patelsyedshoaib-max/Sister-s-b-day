import React, { useState } from 'react';
import { X, Save, RotateCcw, Check, User, Heart, Image as ImageIcon } from 'lucide-react';
import { BirthdayConfig } from '../types';
import { INITIAL_BIRTHDAY_CONFIG } from '../birthdayConfig';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BirthdayConfig;
  onSaveConfig: (newConfig: BirthdayConfig) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [personName, setPersonName] = useState(config.personName);
  const [emotionalMessage, setEmotionalMessage] = useState(config.mainEmotionalMessage);
  const [finalMessage, setFinalMessage] = useState(config.finalSurpriseMessage);
  const [birthdayDate, setBirthdayDate] = useState(config.birthdayDate || '2026-09-12T20:00:00');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BirthdayConfig = {
      ...config,
      personName: personName.trim() || 'Alfiya Tahereem & Shafiya Tahereem Behan',
      nickName: personName.includes('&') ? personName.split('&')[0].trim() : personName.trim(),
      birthdayDate: birthdayDate.trim() || '2026-09-12T20:00:00',
      mainHeadline: `Happy Birthday, ${personName.trim() || 'Alfiya Tahereem & Shafiya Tahereem Behan'}! ❤️`,
      mainEmotionalMessage: emotionalMessage.trim(),
      finalSurpriseMessage: finalMessage.trim(),
    };

    onSaveConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleSetTwoDays = () => {
    // Exactly 2 days from now (48 hours + evening)
    const target = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    target.setHours(20, 0, 0, 0);
    const iso = target.toISOString().slice(0, 16);
    setBirthdayDate(iso);
  };

  const handleResetDefaults = () => {
    setPersonName(INITIAL_BIRTHDAY_CONFIG.personName);
    setEmotionalMessage(INITIAL_BIRTHDAY_CONFIG.mainEmotionalMessage);
    setFinalMessage(INITIAL_BIRTHDAY_CONFIG.finalSurpriseMessage);
    setBirthdayDate(INITIAL_BIRTHDAY_CONFIG.birthdayDate);
    onSaveConfig(INITIAL_BIRTHDAY_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="max-w-xl w-full glass-panel rounded-3xl p-6 sm:p-8 border border-rose-200/60 dark:border-slate-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-200/50 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-500">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
                Personalize Birthday Wish
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly adjust names and heartfelt messages
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-rose-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-left">
          {/* Person's Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Birthday Person&apos;s Full Name
            </label>
            <input
              type="text"
              required
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-rose-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Main Emotional Message */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Main Birthday Message (Revealed on Candle Wish)
            </label>
            <textarea
              rows={4}
              required
              value={emotionalMessage}
              onChange={(e) => setEmotionalMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-rose-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
            />
          </div>

          {/* Celebration Date & Countdown */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Celebration Date & Countdown
              </label>
              <button
                type="button"
                onClick={handleSetTwoDays}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
              >
                <span>⏳ Set to 2 Days Countdown</span>
              </button>
            </div>
            <input
              type="datetime-local"
              value={birthdayDate.length === 10 ? `${birthdayDate}T20:00` : birthdayDate.slice(0, 16)}
              onChange={(e) => setBirthdayDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-rose-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Final Surprise Message */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Final Surprise Banner Slogan
            </label>
            <input
              type="text"
              required
              value={finalMessage}
              onChange={(e) => setFinalMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-rose-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Note on code file */}
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
            <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>
              <strong>Developer Tip:</strong> You can also modify names, photos, background audio, and captions directly in <code>src/birthdayConfig.ts</code> anytime.
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Apply Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
