//https://github.com/JohanAlves/yt-react-carousel
import React, { useEffect, useRef, useState } from 'react';
import TaskItem from './TaskItem.jsx';
import '../styles/carousel.css';

/*
  Endless Carousel approach (vanilla):
  - Duplicate the list once so scrolling wraps seamlessly
  - Auto-scroll using requestAnimationFrame and reset when passing one list width
  - Pause on hover and when list is empty
*/

export default function TaskList({ tasks, onUpdate, onDelete, onToggle }) {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!autoPlay || tasks.length === 0) return;
    timeoutRef.current = setTimeout(() => {
      slideRight();
    }, 2500);
    return () => clearTimeout(timeoutRef.current);
  }, [current, autoPlay, tasks.length]);

  const slideRight = () => {
    setCurrent((prev) => (prev === tasks.length - 1 ? 0 : prev + 1));
  };

  const slideLeft = () => {
    setCurrent((prev) => (prev === 0 ? tasks.length - 1 : prev - 1));
  };

  if (tasks.length === 0) {
    return <div className="carousel empty">No tasks yet. Add your first task above.</div>;
  }

  return (
    <div
      className="carousel"
      onMouseEnter={() => {
        setAutoPlay(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }}
      onMouseLeave={() => {
        setAutoPlay(true);
      }}
    >
      <div className="carousel_wrapper">
        {tasks.map((t, index) => (
          <div
            key={t.id}
            className={index === current ? 'carousel_card carousel_card-active' : 'carousel_card'}
          >
            <TaskItem task={t} onUpdate={onUpdate} onDelete={onDelete} onToggle={onToggle} />
          </div>
        ))}
        <div className="carousel_arrow_left" onClick={slideLeft}>&lsaquo;</div>
        <div className="carousel_arrow_right" onClick={slideRight}>&rsaquo;</div>
        <div className="carousel_pagination">
          {tasks.map((_, index) => (
            <div
              key={`dot-${index}`}
              className={index === current ? 'pagination_dot pagination_dot-active' : 'pagination_dot'}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
