/**
 * Animated Counter
 * ================
 * Animates a number from 0 to value on mount.
 */

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // If value is a string with commas/percentages, parse it safely
    let target = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.-]+/g, ""));
    if (isNaN(target)) {
      setCount(0);
      return;
    }

    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  // If the original value had a decimal, format with decimal
  const isDecimal = typeof value === 'string' && value.includes('.');
  const displayValue = isDecimal ? count.toFixed(1) : new Intl.NumberFormat().format(count);

  return (
    <span>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
