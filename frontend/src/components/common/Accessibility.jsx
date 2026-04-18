import React, { useState, useEffect, useRef } from 'react';

export const SkipLink = ({ href, children, className = "" }) => (
  <a
    href={href}
    className={`
      sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
      bg-indigo-600 text-white px-4 py-2 rounded-md font-medium
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
      z-50
      ${className}
    `}
  >
    {children}
  </a>
);

export const AccessibleButton = ({ 
  children, 
  ariaLabel, 
  ariaPressed, 
  onClick, 
  disabled = false,
  className = "",
  ...props 
}) => (
  <button
    aria-label={ariaLabel}
    aria-pressed={ariaPressed}
    onClick={onClick}
    disabled={disabled}
    className={`
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

export const AccessibleInput = ({ 
  label, 
  error, 
  helperText, 
  required = false,
  className = "",
  ...props 
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[errorId, helperId].filter(Boolean).join(' ')}
        className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          ${error ? 'border-red-500' : ''}
        `}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && (
        <p id={helperId} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export const AccessibleCard = ({ 
  children, 
  onClick, 
  selected = false,
  ariaLabel,
  className = "",
  ...props 
}) => (
  <div
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    aria-label={ariaLabel}
    aria-pressed={selected}
    onClick={onClick}
    onKeyDown={(e) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick(e);
      }
    }}
    className={`
      ${onClick ? 'cursor-pointer' : ''}
      ${selected ? 'ring-2 ring-indigo-500' : ''}
      focus:outline-none focus:ring-2 focus:ring-indigo-500
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);

export const AccessibleModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = "",
  ...props 
}) => {
  const modalRef = useRef();
  const previousFocusRef = useRef();

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      modalRef.current?.focus();
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        
        <div
          ref={modalRef}
          className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 focus:outline-none"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
          {...props}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export const AccessibleTooltip = ({ 
  children, 
  content, 
  position = "top",
  className = "",
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`
            absolute z-10 px-2 py-1 text-sm text-white bg-gray-900 rounded
            whitespace-nowrap pointer-events-none
            ${positionClasses[position]}
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export const useKeyboardNavigation = (items, onSelect) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          onSelect(items[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setActiveIndex(-1);
        break;
    }
  };

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown
  };
};

export const AccessibleList = ({ 
  items, 
  renderItem, 
  onSelect, 
  ariaLabel,
  className = "",
  ...props 
}) => {
  const { activeIndex, setActiveIndex, handleKeyDown } = useKeyboardNavigation(items, onSelect);

  return (
    <div
      role="list"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={className}
      {...props}
    >
      {items.map((item, index) => (
        <div
          key={item.id || index}
          role="listitem"
          aria-selected={activeIndex === index}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={() => onSelect(item)}
          className={`
            cursor-pointer
            ${activeIndex === index ? 'bg-indigo-100' : ''}
          `}
        >
          {renderItem(item, activeIndex === index)}
        </div>
      ))}
    </div>
  );
};

export const ColorContrastChecker = ({ backgroundColor, textColor, children }) => {
  const getContrastRatio = (bg, text) => {
    const getLuminance = (color) => {
      const rgb = color.match(/\d+/g);
      if (!rgb) return 0;
      
      const [r, g, b] = rgb.map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const bgLuminance = getLuminance(backgroundColor);
    const textLuminance = getLuminance(textColor);
    
    const lighter = Math.max(bgLuminance, textLuminance);
    const darker = Math.min(bgLuminance, textLuminance);
    
    return (lighter + 0.05) / (darker + 0.05);
  };

  const ratio = getContrastRatio(backgroundColor, textColor);
  const wcagAA = ratio >= 4.5;
  const wcagAAA = ratio >= 7;

  return (
    <div 
      style={{ backgroundColor, color: textColor }}
      className={`p-4 rounded ${wcagAA ? 'border-2 border-green-500' : 'border-2 border-red-500'}`}
      title={`Contrast ratio: ${ratio.toFixed(2)}:1 ${wcagAA ? '(WCAG AA)' : '(Failed WCAG AA)'}`}
    >
      {children}
      <div className="text-xs mt-2">
        Contrast: {ratio.toFixed(2)}:1
        {wcagAA && <span className="text-green-600 ml-2">WCAG AA</span>}
        {wcagAAA && <span className="text-green-600 ml-2">WCAG AAA</span>}
        {!wcagAA && <span className="text-red-600 ml-2">Failed WCAG</span>}
      </div>
    </div>
  );
};

export const ScreenReaderOnly = ({ children, as = "span" }) => {
  const Component = as;
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
};

export const FocusTrap = ({ children, isActive = true }) => {
  const containerRef = useRef();

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return <div ref={containerRef}>{children}</div>;
};
