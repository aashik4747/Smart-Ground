import React, { useState, useEffect } from 'react';

export const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  required = false, 
  disabled = false,
  helperText,
  icon,
  className = "",
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const fieldId = `field-${name}`;
  const hasError = error && touched;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={fieldId}
          className={`block text-sm font-medium transition-colors ${
            hasError ? 'text-red-600' : isFocused ? 'text-indigo-600' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          id={fieldId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-400
            transition-all duration-200 focus:outline-none focus:ring-2
            ${icon ? 'pl-10' : ''}
            ${hasError 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
              : isFocused 
                ? 'border-indigo-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500'
                : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          `}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => {
              const input = document.getElementById(fieldId);
              input.type = input.type === 'password' ? 'text' : 'password';
            }}
          >
            <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}
      </div>
      
      {(hasError || helperText) && (
        <p className={`text-xs transition-colors ${hasError ? 'text-red-600' : 'text-gray-500'}`}>
          {hasError ? error : helperText}
        </p>
      )}
    </div>
  );
};

export const SelectField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  required = false, 
  disabled = false,
  options = [],
  placeholder = "Select an option",
  className = "",
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = error && touched;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={`select-${name}`}
          className={`block text-sm font-medium transition-colors ${
            hasError ? 'text-red-600' : isFocused ? 'text-indigo-600' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={`select-${name}`}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onFocus={() => setIsFocused(true)}
        disabled={disabled}
        required={required}
        className={`
          block w-full rounded-lg border px-3 py-2 text-sm
          transition-all duration-200 focus:outline-none focus:ring-2
          ${hasError 
            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
            : isFocused 
              ? 'border-indigo-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500'
              : 'border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500'
          }
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {hasError && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export const CheckboxField = ({ 
  label, 
  name, 
  checked, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  required = false, 
  disabled = false,
  helperText,
  className = "",
  ...props 
}) => {
  const hasError = error && touched;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={`checkbox-${name}`}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            className={`
              h-4 w-4 rounded border-gray-300 text-indigo-600 
              focus:ring-indigo-500 transition-colors
              ${hasError ? 'border-red-500' : ''}
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          <label 
            htmlFor={`checkbox-${name}`}
            className={`font-medium ${hasError ? 'text-red-600' : 'text-gray-700'} ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {helperText && (
            <p className="text-gray-500">{helperText}</p>
          )}
        </div>
      </div>
      
      {hasError && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export const FormProgress = ({ steps, currentStep }) => (
  <div className="w-full">
    <div className="flex items-center justify-between mb-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              transition-colors duration-200
              ${index < currentStep 
                ? 'bg-green-500 text-white' 
                : index === currentStep 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }
            `}
          >
            {index < currentStep ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`
                w-full h-1 mx-2 transition-colors duration-200
                ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}
              `}
            />
          )}
        </div>
      ))}
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-gray-900">{steps[currentStep]?.title}</p>
      <p className="text-xs text-gray-500">{steps[currentStep]?.description}</p>
    </div>
  </div>
);
