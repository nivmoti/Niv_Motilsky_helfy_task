import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import TaskItem from './TaskItem.jsx';
import '../styles/carousel.css';

// React-driven infinite carousel
export default function TaskList({ tasks = [], onUpdate, onDelete, onToggle }) {
  const visibleSlides = 1;
  const autoSlideInterval = 3000;

  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [index, setIndex] = useState(1); // 1..n (0 is cloned last, n+1 cloned first)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideW = useRef(0);
  const paused = useRef(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startTranslate = useRef(0);
  const intervalRef = useRef(null);

  const n = tasks.length;
  const slides = n > 0 ? [tasks[n - 1], ...tasks, tasks[0]] : [];


  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const item = track.querySelector('.carousel_item');
    const w = item ? item.getBoundingClientRect().width : 0;
    const gap = parseFloat(getComputedStyle(track).gap || '0');
    slideW.current = w + gap;
    return slideW.current;
  }, []);

  const apply = useCallback((idx, withTransition = true) => {
    const track = trackRef.current;
    if (!track) return;
    const s = slideW.current || measure();
    const px = Math.round(idx * s);
    track.style.transition = withTransition ? 'transform 360ms cubic-bezier(.2,.9,.2,1)' : 'none';
    track.style.transform = `translate3d(${-px}px,0,0)`;
  }, [measure]);

  // initial measure and set position
  useLayoutEffect(() => {
    if (slides.length === 0) return;
    measure();
    apply(index, false);
  }, [tasks]);

  useEffect(() => {
    apply(index, isTransitioning);
  }, [index, isTransitioning, apply]);

  // reset after reaching clones
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onEnd = (e) => {
      if (e.propertyName !== 'transform') return;
      if (n === 0) {
        setIsTransitioning(false);
        return;
      }
      if (index === 0) {
        const real = n;
        const s = slideW.current || measure();
        const px = Math.round(real * s);
        // disable transition and snap to the real slide position
        track.style.transition = 'none';
        track.style.transform = `translate3d(${-px}px,0,0)`;
        track.getBoundingClientRect();
        setIndex(real);
        setIsTransitioning(false);
        return;
      }

      if (index === n + 1) {
        const real = 1;
        const s = slideW.current || measure();
        const px = Math.round(real * s);
        track.style.transition = 'none';
        track.style.transform = `translate3d(${-px}px,0,0)`;
        track.getBoundingClientRect();
        setIndex(real);
        setIsTransitioning(false);
        return;
      }

      // Otherwise just clear the transitioning flag
      setIsTransitioning(false);
    };
    track.addEventListener('transitionend', onEnd);
    return () => track.removeEventListener('transitionend', onEnd);
  }, [index, n, apply]);

  // autoplay
  useEffect(() => {
    if (autoSlideInterval <= 0 || n === 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (paused.current) return;
      setIsTransitioning(true);
      setIndex((i) => i + 1);
    }, autoSlideInterval);
    return () => { clearInterval(intervalRef.current); intervalRef.current = null; };
  }, [autoSlideInterval, n]);

  // pause on hover
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const enter = () => (paused.current = true);
    const leave = () => (paused.current = false);
    vp.addEventListener('pointerenter', enter);
    vp.addEventListener('pointerleave', leave);
    return () => {
      vp.removeEventListener('pointerenter', enter);
      vp.removeEventListener('pointerleave', leave);
    };
  }, []);

  // pointer drag
  const onPointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    dragging.current = true;
    paused.current = true;
    startX.current = e.clientX;
    startTranslate.current = -index * (slideW.current || 0);
    const track = trackRef.current;
    if (track) track.style.transition = 'none';
    e.target.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - startX.current;
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${startTranslate.current + dx}px,0,0)`;
  };
  const onPointerUp = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    paused.current = false;
    const dx = e.clientX - startX.current;
    const step = slideW.current || 1;
    const threshold = step * 0.25;
    let moved = 0;
    if (Math.abs(dx) > threshold) moved = Math.round(dx / step);
    setIsTransitioning(true);
    setIndex((i) => i - moved);
    const track = trackRef.current;
    track?.releasePointerCapture?.(e.pointerId);
  };

  // remeasure on resize
  useEffect(() => {
    const onResize = () => {
      measure();
      apply(index, false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measure, apply, index]);

  return (
    <div className="carousel">
      {n === 0 ? (
        <div className="carousel_empty">No tasks yet. Add your first task above.</div>
      ) : (
        <div
          className="carousel_viewport"
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="carousel_track" ref={trackRef} style={{ gap: '16px' }}>
            {slides.map((t, i) => (
              <div className="carousel_item" key={`s-${i}-${t.id}`}>
                <TaskItem task={t} onUpdate={onUpdate} onDelete={onDelete} onToggle={onToggle} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
