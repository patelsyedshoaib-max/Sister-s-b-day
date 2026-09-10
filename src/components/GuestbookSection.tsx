import React, { useState, useEffect } from 'react';
import { MessageSquareHeart, Heart, Send, Sparkles, Smile, User } from 'lucide-react';
import { GuestWish } from '../types';
import { triggerWishSparkles } from './CelebrationCanvas';
import { audioEngine } from '../utils/audioPlayer';

interface GuestbookSectionProps {
  personName: string;
}

const DEFAULT_WISHES: GuestWish[] = [
  {
    id: 'wish-1',
    name: 'Amina & Family',
    relation: 'Cousin & Friend',
    message: 'Happy Birthday Alfiya & Shafiya! May your day be as sweet, radiant, and wonderful as both your hearts! Stay blessed always! 🌸✨',
    emoji: '🌸',
    timestamp: 'Just now',
    likes: 6,
  },
  {
    id: 'wish-2',
    name: 'Farhan & Zoya',
    relation: 'Family',
    message: 'Wishing both of you endless joy, peace of mind, and the happiest moments ahead. Keep brightening our lives with your smiles! ❤️',
    emoji: '💖',
    timestamp: '2 hours ago',
    likes: 9,
  },
  {
    id: 'wish-3',
    name: 'Friends Group',
    relation: 'Squad',
    message: 'Happy Birthday to the most amazing sisters! Cannot wait to celebrate together! Cake is on us! 🎂🥳',
    emoji: '🎂',
    timestamp: 'Yesterday',
    likes: 12,
  },
];

const EMOJI_OPTIONS = ['🎂', '💖', '🌸', '✨', '🎁', '🌟', '🕊️', '💐'];

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({ personName }) => {
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [relationInput, setRelationInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💖');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from LocalStorage or default
  useEffect(() => {
    try {
      const saved = localStorage.getItem('birthday_guest_wishes_v2');
      if (saved) {
        setWishes(JSON.parse(saved));
      } else {
        // Reset old v1 cache if it existed
        localStorage.removeItem('birthday_guest_wishes');
        setWishes(DEFAULT_WISHES);
        localStorage.setItem('birthday_guest_wishes_v2', JSON.stringify(DEFAULT_WISHES));
      }
    } catch {
      setWishes(DEFAULT_WISHES);
    }
  }, []);

  const handleLike = (id: string) => {
    audioEngine.playSparkleEffect();
    const updated = wishes.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w));
    setWishes(updated);
    try {
      localStorage.setItem('birthday_guest_wishes_v2', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !messageInput.trim()) return;

    setIsSubmitting(true);
    const newWish: GuestWish = {
      id: `wish-${Date.now()}`,
      name: nameInput.trim(),
      relation: relationInput.trim() || 'Well-wisher',
      message: messageInput.trim(),
      emoji: selectedEmoji,
      timestamp: 'Just now',
      likes: 1,
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('birthday_guest_wishes_v2', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Sparkle effect & sound
    audioEngine.playSparkleEffect();
    triggerWishSparkles(0.5, 0.6);

    setNameInput('');
    setRelationInput('');
    setMessageInput('');
    setIsSubmitting(false);
  };

  return (
    <section id="guestbook-section" className="py-14 sm:py-20 px-4 sm:px-6 relative scroll-mt-24">
      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-14">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-rose-600 dark:text-rose-300 text-xs sm:text-sm font-semibold tracking-wide border border-rose-200/60 dark:border-rose-800/40">
            <MessageSquareHeart className="w-4 h-4 text-rose-500" />
            <span>Wall of Warm Wishes</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">
            Leave a Birthday Note 💌
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
            Drop your blessings, loving memories, or heartfelt wishes for {personName} to read!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-rose-200/60 dark:border-rose-900/40 shadow-xl space-y-5">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-lg">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Write Your Wish</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Aunt Fatima, Shoaib, Sarah"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Relationship / Nickname
                </label>
                <input
                  type="text"
                  value={relationInput}
                  onChange={(e) => setRelationInput(e.target.value)}
                  placeholder="e.g. Friend, Brother, Cousin"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Pick a Sticker Emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setSelectedEmoji(em)}
                      className={`w-9 h-9 rounded-xl text-base flex items-center justify-center transition-all ${
                        selectedEmoji === em
                          ? 'bg-rose-500 text-white scale-110 shadow-md shadow-rose-500/30'
                          : 'bg-white/60 dark:bg-slate-800/60 hover:bg-rose-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Your Birthday Blessing *
                </label>
                <textarea
                  rows={4}
                  required
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Write your sweetest wish for ${personName}...`}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                id="submit-wish-btn"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold text-sm shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Post Birthday Blessing ✨</span>
              </button>
            </form>
          </div>

          {/* Feed Column */}
          <div className="lg:col-span-7 space-y-4 max-h-[580px] overflow-y-auto pr-1">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="glass-card rounded-2xl p-4 sm:p-5 border border-rose-200/50 dark:border-rose-900/30 shadow-md flex items-start gap-3 sm:gap-4 hover:border-rose-300 transition-colors"
              >
                {/* Emoji Avatar */}
                <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-800/50 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                  {w.emoji}
                </div>

                {/* Body */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                        {w.name}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
                        {w.relation}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {w.timestamp}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {w.message}
                  </p>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => handleLike(w.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 hover:scale-125 transition-transform" />
                      <span>{w.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
