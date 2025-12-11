'use client';

import { useEffect, useState, useRef } from 'react';

interface StatItemProps {
  number: string;
  label: string;
  size?: 'small' | 'medium' | 'large';
}

function StatItem({ number, label, size = 'medium' }: StatItemProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Extract numeric value from string (e.g., "1500+" -> 1500)
  const targetNumber = parseInt(number.replace(/\D/g, '')) || 0;
  const hasSuffix = number.match(/[+]/);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = targetNumber / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.floor(increment * step), targetNumber);
      setCount(current);

      if (step >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, targetNumber]);

  const sizeClasses = {
    small: 'text-5xl md:text-6xl lg:text-7xl',
    medium: 'text-6xl md:text-7xl lg:text-8xl xl:text-9xl',
    large: 'text-6xl md:text-7xl lg:text-8xl xl:text-9xl'
  };

  const labelSizeClasses = {
    small: 'text-xs md:text-sm lg:text-base',
    medium: 'text-sm md:text-base lg:text-lg',
    large: 'text-sm md:text-base lg:text-lg'
  };

  return (
    <div ref={elementRef} className="flex flex-col items-center justify-center text-center">
      <div className={`font-bold text-white ${sizeClasses[size]} tracking-tight`}>
        {count}
        {hasSuffix && '+'}
      </div>
      <p className={`text-gray-300 mt-3 md:mt-4 max-w-[200px] md:max-w-[250px] leading-relaxed ${labelSizeClasses[size]}`}>
        {label}
      </p>
    </div>
  );
}

interface StatsCounterProps {
  stats: {
    number: string;
    label: string;
    size?: 'small' | 'medium' | 'large';
  }[];
  title: string;
  subtitle: string;
}

export default function StatsCounter({ stats, title, subtitle }: StatsCounterProps) {
  return (
    <section className="h-screen w-full relative overflow-hidden snap-start flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/contador.jpg"
          alt="Space Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Orbits Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          {/* Large orbit */}
          <ellipse
            cx="960"
            cy="540"
            rx="700"
            ry="400"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="10,10"
            opacity="0.3"
          />
          {/* Medium orbit */}
          <ellipse
            cx="960"
            cy="540"
            rx="500"
            ry="280"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="10,10"
            opacity="0.4"
          />
          {/* Small orbit */}
          <ellipse
            cx="960"
            cy="540"
            rx="300"
            ry="170"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="10,10"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide">
            {title}
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-gray-300 mt-2 md:mt-4 uppercase tracking-wide">
            {subtitle}
          </h3>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 items-center">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              number={stat.number}
              label={stat.label}
              size={stat.size || (index === 1 ? 'large' : 'medium')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
