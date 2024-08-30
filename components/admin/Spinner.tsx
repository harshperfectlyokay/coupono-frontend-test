import React from 'react';

interface SpinnerProps {
  thickness?: number; // Thickness of the spinner border
  size?: number | string; // Size of the spinner
  text?: string; // Optional text (default is an empty string)
}

const Spinner: React.FC<SpinnerProps> = ({ thickness, size, text = "" }) => {
  const sizeMap = {
    small: '30px',
    medium: '50px',
    large: '70px',
  };

  const spinnerSize = typeof size === 'number' ? `${size}px` : size || sizeMap.medium;
  const spinnerThickness = thickness ? `${thickness}px` : '4px';

  const spinnerStyle: React.CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    border: `calc(${spinnerThickness} / 2) solid #f3f3f3`,
    borderTop: `calc(${spinnerThickness} / 2) solid #299FE9`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      {text && <div>{text}</div>}
    </div>
  );
};

export default Spinner;
