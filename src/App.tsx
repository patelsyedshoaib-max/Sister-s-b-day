import React, { useState, useEffect } from 'react';
import { INITIAL_BIRTHDAY_CONFIG } from './birthdayConfig';
import { BirthdayConfig } from './types';
import { Navbar } from './components/Navbar';
import { CelebrationCanvas } from './components/CelebrationCanvas';
import { LandingHero } from './components/LandingHero';
import { InteractiveCake } from './components/InteractiveCake';
import { MemoriesSection } from './components/MemoriesSection';
import { SpecialLetter } from './components/SpecialLetter';
import { GuestbookSection } from './components/GuestbookSection';
import { RsvpAndSocial } from './components/RsvpAndSocial';
import { FinalSurprise } from './components/FinalSurprise';
import { CustomizerModal } from './components/CustomizerModal';
import { BehanSongLyricsBar } from './components/BehanSongLyricsBar';

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(() => {
    try {
      const savedV2 = localStorage.getItem('birthday_custom_config_v2');
      if (savedV2) {
        const parsed = JSON.parse(savedV2);
        return {
          ...INITIAL_BIRTHDAY_CONFIG,
          ...parsed,
          birthdayDate: parsed.birthdayDate || INITIAL_BIRTHDAY_CONFIG.birthdayDate,
        };
      }

      const oldSaved = localStorage.getItem('birthday_custom_config');
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved);
        if (parsed.personName && !parsed.personName.includes('Alfiya')) {
          localStorage.removeItem('birthday_custom_config');
          return INITIAL_BIRTHDAY_CONFIG;
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_BIRTHDAY_CONFIG;
  });

  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'rose'>('light');
  const [isCelebrationActive, setIsCelebrationActive] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  const handleThemeToggle = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleOpenSurprise = () => {
    setIsCelebrationActive(true);
    // Smooth scroll down to celebration cake
    setTimeout(() => {
      const cakeEl = document.getElementById('cake-section');
      if (cakeEl) {
        cakeEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 450);
  };

  const handleRestartCelebration = () => {
    setIsCelebrationActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveConfig = (newConfig: BirthdayConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('birthday_custom_config_v2', JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`min-h-screen relative selection:bg-rose-400 selection:text-white transition-colors duration-500 ${
        themeMode === 'dark'
          ? 'bg-[#120a17] text-slate-100'
          : 'bg-gradient-to-b from-rose-50 via-pink-50/50 to-amber-50/40 text-slate-800'
      }`}
    >
      {/* Background Animated Floating Canvas (Hearts, Stars, Rising Balloons) */}
      <CelebrationCanvas isCelebrationActive={isCelebrationActive} />

      {/* Persistent Navigation Bar */}
      <Navbar
        personName={config.nickName || config.personName}
        themeMode={themeMode}
        onThemeToggle={handleThemeToggle}
        onOpenCustomizer={() => setCustomizerOpen(true)}
        isCelebrationActive={isCelebrationActive}
      />

      {/* Main Content Area */}
      <main className="relative z-10">
        {/* 1. Landing Hero (A Special Surprise For You) */}
        <LandingHero
          personName={config.personName}
          birthdayDate={config.birthdayDate}
          onOpenSurprise={handleOpenSurprise}
        />

        {/* 2. Interactive Cake & Wish Reveal */}
        <InteractiveCake
          personName={config.personName}
          emotionalMessage={config.mainEmotionalMessage}
        />

        {/* 3. Memories Photo Gallery */}
        <MemoriesSection memories={config.memories} />

        {/* 4. Secret Heartfelt Birthday Letter */}
        <SpecialLetter
          personName={config.personName}
          letterTitle={config.secretLetterTitle}
          letterBody={config.secretLetterBody}
          letterSignOff={config.secretLetterSignOff}
        />

        {/* 5. Dynamic Guestbook / Wish Wall */}
        <GuestbookSection personName={config.personName} />

        {/* 6. RSVP & Social Share */}
        <RsvpAndSocial
          personName={config.personName}
          eventDetails={config.eventDetails}
        />

        {/* 7. Final Surprise Grand Finale */}
        <FinalSurprise
          personName={config.personName}
          finalMessage={config.finalSurpriseMessage}
          onRestartCelebration={handleRestartCelebration}
        />
      </main>

      {/* Synchronized Sister Song Lyrics & Floating Player */}
      <BehanSongLyricsBar />

      {/* Quick Customization Drawer / Modal */}
      <CustomizerModal
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}
