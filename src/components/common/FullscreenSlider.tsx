import { useState, useEffect, useCallback, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
}

interface FullscreenSliderProps {
  slides: Slide[];
  onSelect: (id: string) => void;
  loading?: boolean;
  /** Optional custom content to replace the default bottom text and button */
  customBottomContent?: ReactNode;
  /** Called when the current slide changes, passing the slide id */
  onCurrentSlideChange?: (slideId: string) => void;
}

export default function FullscreenSlider({
  slides,
  onSelect,
  loading,
  customBottomContent,
  onCurrentSlideChange,
}: FullscreenSliderProps) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (transitioning || slides.length === 0) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setTransitioning(false);
        if (onCurrentSlideChange) {
          onCurrentSlideChange(slides[index].id);
        }
      }, 400);
    },
    [transitioning, slides.length, onCurrentSlideChange]
  );

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, goTo, slides.length]
  );

  // Notify initial slide when slides load
  useEffect(() => {
    if (slides.length > 0 && onCurrentSlideChange) {
      onCurrentSlideChange(slides[current].id);
    }
  }, [slides, current, onCurrentSlideChange]);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, slides.length]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="w-px h-16 bg-white/20 animate-pulse" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current && !transitioning ? 1 : 0 }}
        >
          <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
        </div>
      ))}

      {customBottomContent ? (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
            {customBottomContent}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-28 px-8 text-center pointer-events-none">
          <p className="text-white/50 text-xs tracking-[0.4em] uppercase mb-4">
            {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </p>
          <h2
            className="text-white font-light tracking-[0.15em] uppercase mb-3 transition-all duration-500"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? 'translateY(12px)' : 'translateY(0)',
            }}
          >
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p
              className="text-white/60 text-sm tracking-widest font-light max-w-md transition-all duration-500 delay-75"
              style={{ opacity: transitioning ? 0 : 1 }}
            >
              {slide.subtitle}
            </p>
          )}
          <button
            onClick={() => onSelect(slide.id)}
            className="pointer-events-auto mt-8 px-10 py-3 border border-white/40 text-white/80 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300"
          >
            Explorar
          </button>
        </div>
      )}

      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors z-10"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors z-10"
      >
        <ChevronRight size={28} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300"
            style={{
              width: i === current ? '2rem' : '0.375rem',
              height: '2px',
              background: i === current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
}