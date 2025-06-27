import React from 'react';
import { CSS_CLASSES } from '../constants';

const Button = ({ 
  children, 
  className = '', 
  type = 'button',
  disabled = false,
  ...props 
}) => (
  <button
    type={type}
    disabled={disabled}
    className={`${CSS_CLASSES.BUTTON_BASE} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
