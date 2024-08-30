import React, { useState } from 'react';

interface TextBoxProps {
  title: string;
  onChange: ( value: string) => void;
}

const TextBox: React.FC<TextBoxProps> = ({ title, onChange }) => {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange( event.target.value);
  };

  return (
    <div className='px-2 py-2 basic-dropdown'>
      <label>{title}:</label>
      <input type="text" value={value} onChange={handleChange} />
    </div>
  );
};

export default TextBox;
