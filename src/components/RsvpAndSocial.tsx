import React, { useState } from 'react';
import { Share2, Calendar, MapPin, CheckCircle, Copy, Check, Users, HeartHandshake } from 'lucide-react';
import { triggerWishSparkles } from './CelebrationCanvas';
import { audioEngine } from '../utils/audioPlayer';

interface RsvpAndSocialProps {
  personName: string;
  eventDetails: {
    enabled: boolean;
    date: string;
    time: string;
    venue: string;
    locationName: string;
    dressCode: string;
  };
}

export const RsvpAndSocial: React.FC<RsvpAndSocialProps> = ({ personName, eventDetails }) => {
  const [guestName, setGuestName] = useState('');
  const [attendingStatus, setAttendingStatus] = useState<'yes' | 'maybe' | 'remote'>('yes');
  const [guestCount, setGuestCount] = useState(1);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    audioEngine.playSparkleEffect();
    triggerWishSparkles(0.5, 0.7);
    setSubmitted(true);

    try {
      const existingRsvps = JSON.parse(localStorage.getItem('birthday_rsvps') || '[]');
      existingRsvps.push({
        guestName,
        attendingStatus,
        guestCount,
        note,
        date: new Date().toISOString(),
      });
      localStorage.setItem('birthday_rsvps', JSON.stringify(existingRsvps));
    } catch {
      // ignore
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const shareText = encodeURIComponent(`🎉 Come celebrate ${personName}'s Special Birthday with us! Click to open the surprise! ✨🎂`);
  const currentUrl = encodeURIComponent(window.location.href);

  const shareWhatsapp = `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`;
  const shareTwitter = `https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;

  return (
    <section id="rsvp-section" className="py-14 sm:py-20 px-4 sm:px-6 relative scroll-mt-24">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* RSVP Card & Event Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Event Details Card */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-rose-200/60 dark:border-rose-900/40 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>The Gathering</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
                Celebrate in Person
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                We are coming together to shower {personName} with laughter, treats, and love!
              </p>

              <div className="space-y-3.5 pt-2 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Date &amp; Time</strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      {eventDetails.date} • {eventDetails.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Celebration Venue</strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      {eventDetails.venue} ({eventDetails.locationName})
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <HeartHandshake className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Dress Code</strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      {eventDetails.dressCode}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-rose-200/50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Kindly confirm your attendance so we can save a slice of cake for you! 🍰
            </div>
          </div>

          {/* RSVP Interactive Form */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-rose-200/60 dark:border-rose-900/40 shadow-xl flex flex-col justify-center">
            {!submitted ? (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-xl font-bold text-slate-800 dark:text-slate-100">
                    RSVP to the Celebration 🥂
                  </h4>
                  <span className="text-xs text-rose-500 font-semibold uppercase tracking-wider">
                    Quick Confirmation
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                {/* Attendance Options */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Will you be joining us? *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'yes', label: '🎉 Yes, absolutely!' },
                      { val: 'maybe', label: '🤔 Maybe' },
                      { val: 'remote', label: '💌 In spirit & online' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setAttendingStatus(opt.val as 'yes' | 'maybe' | 'remote')}
                        className={`p-2.5 text-xs font-semibold rounded-xl border transition-all text-center ${
                          attendingStatus === opt.val
                            ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                            : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-rose-200/60 dark:border-slate-700 hover:bg-rose-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                      Total Guests Attending
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                      >
                        <option value={1}>Just Me (1)</option>
                        <option value={2}>Me + 1 Guest (2)</option>
                        <option value={3}>Family / Group (3)</option>
                        <option value={4}>Family / Group (4+)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                      Dietary / Sweet Note
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Vegetarian, bringing gifts"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="confirm-rsvp-btn"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  Confirm My RSVP ✨
                </button>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h4 className="font-display text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Thank You, {guestName}!
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm max-w-sm mx-auto">
                  Your response has been noted. We cannot wait to celebrate this magnificent day with you!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-rose-600 dark:text-rose-400 underline font-medium cursor-pointer"
                >
                  Edit your response
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Social Media Sharing Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-200/60 dark:border-rose-900/40 shadow-xl text-center space-y-5">
          <div className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm font-semibold">
            <Share2 className="w-4 h-4" />
            <span>Share the Birthday Love</span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            Spread the Joy to Friends &amp; Family
          </h3>

          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto">
            Send this magical birthday page to other friends, family, and loved ones so they can leave their blessings too!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* WhatsApp */}
            <a
              href={shareWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1ebd5a] shadow-md transition-all hover:scale-105"
            >
              <span>WhatsApp</span>
            </a>

            {/* Twitter / X */}
            <a
              href={shareTwitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#0f1419] hover:bg-[#272c30] shadow-md transition-all hover:scale-105"
            >
              <span>Twitter / X</span>
            </a>

            {/* Facebook */}
            <a
              href={shareFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#1877F2] hover:bg-[#0d65d9] shadow-md transition-all hover:scale-105"
            >
              <span>Facebook</span>
            </a>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              id="copy-share-link-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold glass-panel text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-800 shadow-md transition-all hover:scale-105 cursor-pointer border border-rose-200/70 dark:border-rose-900/60"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Link Copied! 🎉</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-rose-500" />
                  <span>Copy Page Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
