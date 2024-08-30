'use client'
import React, { useState, useRef, useEffect } from 'react';

interface Option {
  key: string;
  value: string;
  label: string;
}

const CustomDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: Option[] = [
    { key: 'john', value: 'john', label: 'John Doe' },
    { key: 'jane', value: 'jane', label: 'Jane Doe' },
    { key: 'lorem', value: 'ipsum', label: 'Lorem Ipsum' },
  ];

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((option) => option !== value)
        : [...prevSelected, value]
    );
  };

  const handleClickOutside = (event: MouseEvent): void => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-gray-100 rounded-md shadow-sm outline-none hover:shadow-lg"
      >
        {selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Select Option'}
      </button>
      {isOpen && (
        <div className="absolute z-99 mt-2 w-max bg-white shadow-lg rounded-md">
          {options.map((option) => (
            <label key={option.key} className="block bg-gray-200 px-4 py-2 outline-none">
              <input
                type="checkbox"
                value={option.value}
                checked={selectedOptions.includes(option.value)}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
