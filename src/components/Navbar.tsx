import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Moon, Sun, Sparkles, Sliders, Menu, X } from 'lucide-react';
import { audioEngine } from '../utils/audioPlayer';

interface NavbarProps {
  personName: string;
  themeMode: 'light' | 'dark' | 'rose';
  onThemeToggle: () => void;
  onOpenCustomizer: () => void;
  isCelebrationActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  personName,
  themeMode,
  onThemeToggle,
  onOpenCustomizer,
  isCelebrationActive,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = audioEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });
    setIsPlaying(audioEngine.getIsPlaying());
    setIsMuted(audioEngine.getIsMuted());

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      unsub();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMusicToggle = () => {
    audioEngine.toggleCelebrationSong();
    setIsPlaying(audioEngine.getIsPlaying());
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'glass-panel shadow-md py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Name */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 group text-left cursor-pointer"
          id="nav-brand-button"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-300 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="font-display font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 dark:from-rose-400 dark:via-pink-300 dark:to-amber-300 bg-clip-text text-transparent">
              {personName}&apos;s Day
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs uppercase tracking-widest text-rose-500/80 dark:text-rose-400/80 font-medium">
              Birthday Edition
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        {isCelebrationActive && (
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => scrollToSection('cake-section')}
              className="px-3 py-1.5 rounded-full hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              🎂 Wish & Cake
            </button>
            <button
              onClick={() => scrollToSection('memories-section')}
              className="px-3 py-1.5 rounded-full hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              📷 Memories
            </button>
            <button
              onClick={() => scrollToSection('letter-section')}
              className="px-3 py-1.5 rounded-full hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              💌 Secret Note
            </button>
            <button
              onClick={() => scrollToSection('guestbook-section')}
              className="px-3 py-1.5 rounded-full hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              💬 Wishes Wall
            </button>
            <button
              onClick={() => scrollToSection('rsvp-section')}
              className="px-3 py-1.5 rounded-full hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              🎉 RSVP
            </button>
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Music Equalizer / Play Button */}
          <div className="flex items-center glass-card rounded-full p-1 pl-2.5 sm:pl-3 pr-1 gap-1.5 shadow-sm border border-rose-200/50 dark:border-rose-900/40">
            <button
              onClick={handleMusicToggle}
              id="music-play-toggle"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause Sister Special Birthday Song' : 'Play Sister Special Birthday Song'}
            >
              <Music className={`w-3.5 h-3.5 text-rose-500 ${isPlaying ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline text-xs font-semibold text-rose-600 dark:text-rose-400">
                {isPlaying ? 'Playing Behan Song 🎵' : 'Play Behan Song 🎵'}
              </span>

              {/* Animated Sound Wave Bars */}
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3.5 px-0.5">
                  <span className="w-0.5 bg-rose-500 animate-pulse rounded-full h-2" />
                  <span className="w-0.5 bg-rose-500 animate-pulse rounded-full h-3.5 delay-75" />
                  <span className="w-0.5 bg-rose-500 animate-pulse rounded-full h-1.5 delay-150" />
                  <span className="w-0.5 bg-rose-500 animate-pulse rounded-full h-3 delay-100" />
                </div>
              )}
            </button>

            {/* Mute toggle button */}
            <button
              onClick={handleMuteToggle}
              id="music-mute-button"
              className="p-1 rounded-full text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Theme mode toggle */}
          <button
            onClick={onThemeToggle}
            id="theme-toggle-button"
            className="p-2 rounded-full glass-card hover:bg-rose-100/50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border border-rose-200/50 dark:border-rose-900/40"
            title={`Current theme: ${themeMode}. Click to switch theme.`}
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-rose-600" />
            )}
          </button>

          {/* Customizer button */}
          <button
            onClick={onOpenCustomizer}
            id="open-customizer-btn"
            className="p-2 rounded-full glass-card hover:bg-rose-100/50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer border border-rose-200/50 dark:border-rose-900/40"
            title="Customize Name, Message, or Memories"
          >
            <Sliders className="w-4 h-4 text-pink-500" />
          </button>

          {/* Mobile menu hamburger */}
          {isCelebrationActive && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full glass-card text-slate-700 dark:text-slate-200 border border-rose-200/50 dark:border-rose-900/40"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-rose-200/40 dark:border-rose-900/40 mt-2 px-4 py-3 space-y-2 shadow-xl animate-fadeIn">
          <button
            onClick={() => scrollToSection('cake-section')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-rose-500/10 flex items-center gap-2"
          >
            🎂 Birthday Cake & Wish
          </button>
          <button
            onClick={() => scrollToSection('memories-section')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-rose-500/10 flex items-center gap-2"
          >
            📷 Our Memories
          </button>
          <button
            onClick={() => scrollToSection('letter-section')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-rose-500/10 flex items-center gap-2"
          >
            💌 Secret Birthday Letter
          </button>
          <button
            onClick={() => scrollToSection('guestbook-section')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-rose-500/10 flex items-center gap-2"
          >
            💬 Leave a Wish
          </button>
          <button
            onClick={() => scrollToSection('rsvp-section')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-rose-500/10 flex items-center gap-2"
          >
            🎉 RSVP & Social Share
          </button>
        </div>
      )}
    </header>
  );
};
