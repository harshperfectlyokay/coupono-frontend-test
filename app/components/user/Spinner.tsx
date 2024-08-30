import PropTypes from 'prop-types';

interface SpinnerProps {
  thickness?: number;
  size?: number;
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ thickness, size, text = "" }) => {
  const sizeMap = {
    small: '30px',
    medium: '50px',
    large: '70px',
  };

  const spinnerStyle = {
    width: size ? size + "px" : sizeMap.medium,
    height: size ? size + "px" : sizeMap.medium,
    border: `calc(${thickness ? thickness + "px" : '4px'} / 2) solid #f3f3f3`,
    borderTop: `calc(${thickness ? thickness + "px" : '4px'} / 2) solid #299FE9`,
    borderRadius: '50%',
    // animation: 'spin 1s linear infinite',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={containerStyle}>
      <div className='animate-spin' style={spinnerStyle}></div>
      {text && <p>{text}</p>}
    </div>
  );
};

Spinner.propTypes = {
  thickness: PropTypes.number,
  size: PropTypes.number,
  text: PropTypes.string,
};

export default Spinner;
