import { useRef, useState } from 'react';

export function FavoritesCarousel({ children }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [moved, setMoved] = useState(false);

  const handlePointerDown = (e) => {
    const container = containerRef.current;
    if (!container) return;
    const target = e.target;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    setIsDragging(true);
    setMoved(false);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    try {
      container.setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
    container.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (!container) return;
    const target = e.target;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = x - startX;
    if (Math.abs(walk) > 3) {
      setMoved(true);
    }
    container.scrollLeft = scrollLeft - walk;
  };

  const handlePointerUp = (e) => {
    const container = containerRef.current;
    if (!container) return;
    setIsDragging(false);
    if (container) container.style.cursor = 'grab';
    try {
      container.releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="favorites-carousel flex gap-3 overflow-x-auto overflow-y-hidden pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 select-none touch-pan-x"
      style={{ cursor: isDragging ? 'grabbing' : 'grab', WebkitOverflowScrolling: 'touch' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerUp}
    >
      {children}
    </div>
  );
}
