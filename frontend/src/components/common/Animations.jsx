import React, { useState, useEffect, useRef } from 'react';

export const FadeIn = ({ children, delay = 0, duration = 500, className = "", ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`transition-opacity duration-${duration} ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const SlideUp = ({ children, delay = 0, distance = 20, className = "", ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : `opacity-0 translate-y-${distance}`}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const ScaleIn = ({ children, delay = 0, className = "", ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const StaggeredChildren = ({ children, staggerDelay = 100, animation = FadeIn, className = "", ...props }) => {
  const AnimationComponent = animation;
  
  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child, index) => (
        <AnimationComponent key={child.key} delay={index * staggerDelay}>
          {child}
        </AnimationComponent>
      ))}
    </div>
  );
};

export const HoverCard = ({ children, className = "", ...props }) => (
  <div
    className={`
      transform transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-lg hover:-translate-y-1
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

export const PulseButton = ({ children, className = "", ...props }) => (
  <button
    className={`
      relative overflow-hidden transform transition-all duration-200
      hover:scale-105 active:scale-95
      ${className}
    `}
    {...props}
  >
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-200"></span>
  </button>
);

export const Shimmer = ({ className = "", ...props }) => (
  <div className={`relative overflow-hidden ${className}`} {...props}>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
  </div>
);

export const Bounce = ({ children, trigger = false, className = "", ...props }) => {
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div
      className={`
        ${isBouncing ? 'animate-bounce' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const Typewriter = ({ text, speed = 50, className = "", ...props }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className} {...props}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export const Confetti = ({ trigger = false, className = "", ...props }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][Math.floor(Math.random() * 5)],
        size: Math.random() * 8 + 4,
        duration: Math.random() * 2 + 1
      }));
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`} {...props}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute ${particle.color} rounded-full animate-fall`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  );
};

export const MagneticButton = ({ children, className = "", ...props }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef();

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      className={`
        relative transform transition-transform duration-200 ease-out
        ${className}
      `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

export const Parallax = ({ children, speed = 0.5, className = "", ...props }) => {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      
      setOffset(rate);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform: `translateY(${offset}px)`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Add custom animations to CSS
export const GlobalAnimations = () => (
  <style jsx>{`
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    
    @keyframes fall {
      0% { 
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
      }
      100% { 
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    
    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
    
    .animate-fall {
      animation: fall linear;
    }
  `}</style>
);
