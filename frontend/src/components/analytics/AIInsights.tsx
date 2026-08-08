import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AIInsightsProps {
  insights: string[];
}

export default function AIInsights({ insights }: AIInsightsProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (!insights || insights.length === 0) return;
    
    const text = insights[currentIndex];
    let i = 0;
    setDisplayedText('');
    
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % insights.length);
        }, 5000);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [insights, currentIndex]);

  if (!insights || insights.length === 0) return null;

  return (
    <div className="card p-5 relative overflow-hidden" style={{ background: 'var(--gradient-surface)', borderColor: 'var(--border-secondary)' }}>
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-24 h-24" style={{ color: 'var(--color-primary)' }} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--gradient-primary)' }}>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            AI Executive Summary
          </h3>
        </div>
        
        <div className="min-h-[70px]">
          <p className="text-[15px] leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
            "{displayedText}"
            <span className="animate-pulse ml-0.5 opacity-60">|</span>
          </p>
        </div>
      </div>
    </div>
  );
}
