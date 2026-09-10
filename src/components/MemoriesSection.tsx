import React, { useState } from 'react';
import { Heart, ZoomIn, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { MemoryItem } from '../types';

interface MemoriesSectionProps {
  memories: MemoryItem[];
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({ memories }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % memories.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + memories.length) % memories.length);
    }
  };

  return (
    <section id="memories-section" className="py-14 sm:py-20 px-4 sm:px-6 relative scroll-mt-24">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-rose-600 dark:text-rose-300 text-xs sm:text-sm font-semibold tracking-wide border border-rose-200/60 dark:border-rose-800/40">
            <Camera className="w-4 h-4 text-rose-500" />
            <span>Time Capsule of Joy</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">
            Our Memories ❤️
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
            A celebration of beautiful moments, genuine laughs, and precious chapters written together.
          </p>
        </div>

        {/* Responsive Grid of Memory Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {memories.map((mem, idx) => (
            <div
              key={mem.id || idx}
              onClick={() => openLightbox(idx)}
              className="group glass-card rounded-2xl sm:rounded-3xl overflow-hidden border border-rose-200/60 dark:border-rose-900/40 shadow-lg hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-500 cursor-pointer flex flex-col transform hover:-translate-y-2"
            >
              {/* Image Container with Zoom effect */}
              <div className="relative aspect-[4/3] overflow-hidden bg-rose-100 dark:bg-slate-800">
                <img
                  src={mem.imageUrl}
                  alt={mem.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Soft Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Category & Date Tag Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/85 dark:bg-slate-900/85 backdrop-blur-md text-rose-600 dark:text-rose-400 shadow-sm">
                    {mem.dateTag}
                  </span>
                </div>

                {/* Zoom Icon indicator */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              {/* Caption Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-2.5">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {mem.title}
                    </h3>
                    <Heart className="w-4 h-4 text-rose-400 fill-transparent group-hover:fill-rose-500 group-hover:text-rose-500 transition-colors" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {mem.caption}
                  </p>
                </div>

                <div className="pt-2 text-xs font-medium text-rose-500/80 dark:text-rose-400/80 uppercase tracking-wider flex items-center gap-1.5">
                  <span>✨ {mem.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous / Next Controls */}
          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div
            className="max-w-4xl w-full max-h-[90vh] bg-slate-900/90 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Modal Image */}
            <div className="md:w-3/5 bg-black flex items-center justify-center p-2">
              <img
                src={memories[selectedImageIndex].imageUrl}
                alt={memories[selectedImageIndex].title}
                className="max-h-[55vh] md:max-h-[75vh] w-full object-contain rounded-2xl"
              />
            </div>

            {/* Modal Info Column */}
            <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between text-white space-y-4">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/30 text-rose-300 border border-rose-500/30">
                  {memories[selectedImageIndex].dateTag}
                </span>

                <h3 className="font-display text-2xl font-bold text-white">
                  {memories[selectedImageIndex].title}
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {memories[selectedImageIndex].caption}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Photo {selectedImageIndex + 1} of {memories.length}
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <Heart className="w-3.5 h-3.5 fill-rose-400" /> Cherished Memory
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
