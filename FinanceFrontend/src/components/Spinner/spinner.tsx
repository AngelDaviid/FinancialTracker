import React from 'react';

interface SpinnerProps {
  size?: number;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 40, className = '' }) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-4 ${className}`}
      style={{
        width: size,
        height: size,
        borderTopColor: '#004f39',
        borderRightColor: '#fffaca',
        borderBottomColor: '#151613',
        borderLeftColor: 'transparent',
      }}
    />
  );
};

export { Spinner };
