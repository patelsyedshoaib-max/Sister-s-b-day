import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Heart, ChevronUp, ChevronDown, Music2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { audioEngine, AudioEngineState, SISTER_BIRTHDAY_SONG_LYRICS } from '../utils/audioPlayer';

export const BehanSongLyricsBar: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioEngineState>(audioEngine.getState());
  const [showFullLyrics, setShowFullLyrics] = useState(false);

  useEffect(() => {
    const unsub = audioEngine.subscribeState((st) => {
      setAudioState(st);
    });
    return unsub;
  }, []);

  if (!audioState.isPlaying && !showFullLyrics) {
    return null;
  }

  const currentLine =
    audioState.currentLineIndex >= 0 && audioState.currentLineIndex < SISTER_BIRTHDAY_SONG_LYRICS.length
      ? SISTER_BIRTHDAY_SONG_LYRICS[audioState.currentLineIndex]
      : null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-xl transition-all duration-300">
      <div className="glass-panel rounded-2xl sm:rounded-3xl border border-rose-300/70 dark:border-rose-800/60 shadow-2xl p-3 sm:p-4 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 space-y-3">
        {/* Top Header & Quick Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-rose-500/20">
              <Music2 className="w-4 h-4 animate-bounce" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100">
                <span>Special Birthday Song For Behan</span>
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              </div>
              <p className="text-[11px] text-rose-500 dark:text-rose-400 font-medium truncate">
                {audioState.isPlaying ? 'Now Playing: Heartfelt Sister Wishes' : 'Paused'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Play/Pause */}
            <button
              onClick={() => audioEngine.toggleCelebrationSong()}
              className="p-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-md transition-transform active:scale-95 cursor-pointer"
              title={audioState.isPlaying ? 'Pause' : 'Play'}
            >
              {audioState.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Restart Song */}
            <button
              onClick={() => audioEngine.jumpToLine(0)}
              className="p-2 rounded-full hover:bg-rose-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Mute toggle */}
            <button
              onClick={() => audioEngine.toggleMute()}
              className="p-2 rounded-full hover:bg-rose-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title={audioState.isMuted ? 'Unmute' : 'Mute'}
            >
              {audioState.isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Expand Lyrics */}
            <button
              onClick={() => setShowFullLyrics(!showFullLyrics)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
            >
              <span>Lyrics</span>
              {showFullLyrics ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Current Active Spoken Line Display */}
        {currentLine && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 border border-rose-200/50 dark:border-rose-900/40 text-center animate-fadeIn">
            <p className="font-display font-semibold text-sm sm:text-base text-rose-600 dark:text-rose-300 leading-snug">
              &ldquo;{currentLine.text}&rdquo;
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-hindi">
              {currentLine.hindi}
            </p>
          </div>
        )}

        {/* Expanded Full Lyrics List */}
        {showFullLyrics && (
          <div className="max-h-60 overflow-y-auto space-y-1.5 pt-2 border-t border-rose-200/50 dark:border-slate-800 pr-1 text-left text-xs">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 px-1 mb-1">
              <span>All Poem Lines (Click to jump)</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </div>

            {SISTER_BIRTHDAY_SONG_LYRICS.map((line, idx) => {
              const isActive = audioState.currentLineIndex === idx;
              return (
                <button
                  key={line.id}
                  onClick={() => audioEngine.jumpToLine(idx)}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-start gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-rose-500 text-white font-medium shadow-sm'
                      : 'hover:bg-rose-500/10 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span
                    className={`shrink-0 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isActive ? 'bg-white text-rose-600' : 'bg-rose-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="leading-snug">{line.text}</p>
                    <p className={`text-[11px] font-hindi mt-0.5 ${isActive ? 'text-rose-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {line.hindi}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
