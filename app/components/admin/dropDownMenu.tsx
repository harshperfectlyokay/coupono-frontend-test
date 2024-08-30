import React, { useState, useRef, useEffect, useMemo } from 'react';

interface Option {
  value: string;
  displayName: string;
}

interface DropdownProps {
  title: string;
  options: Option[];
  onChange: (value: string) => void;
}

const DropDown: React.FC<DropdownProps> = ({ title, options, onChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState(options[0]?.value || '');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOptionClick = (value: string) => {
    const option = options.find(option => option.value === value);
    if (option) {
      setSelectedValue(value);
      setSearchQuery(option.displayName);
      onChange(value);
      setIsOpen(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
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

  const filteredOptions = useMemo(() => 
    options.filter(option =>
      option.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    ), [options, searchQuery]);

  return (
    <div className='relative basic-dropdown' ref={dropdownRef}>
      <label>{title}: </label>
      <input
        type="text"
        value={searchQuery || ''}
        onClick={() => setIsOpen(!isOpen)}
        onChange={handleSearchChange}
        placeholder={`Search ${title}`}
        className='dropdown-input'
      />
      {isOpen && (
        <div className='absolute z-10 mt-2 w-full border border-gray-300 bg-white shadow-lg max-h-[calc(20*1rem)] overflow-y-auto'>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className='p-2 cursor-pointer hover:bg-gray-200'
              >
                {option.displayName}
              </div>
            ))
          ) : (
            <div className='p-2 text-gray-500'>No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropDown;
