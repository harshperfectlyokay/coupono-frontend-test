// AccessDropdown.tsx
import React from 'react';

interface Option {
  key: string;
  value: string;
  label: string;
}

interface AccessDropdownProps {
  selectedOptions: string[];
  setSelectedOptions: (newOptions: string[]) => void;
}

const AccessDropdown: React.FC<AccessDropdownProps> = ({ selectedOptions, setSelectedOptions }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const options: Option[] = [
    { key: 'home', value: '/home', label: 'Home' },
    { key: 'profile', value: '/profile', label: 'Profile' },
    { key: 'settings', value: '/settings', label: 'Settings' },
    { key: 'dashboard', value: '/dashboard', label: 'Dashboard' },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newSelectedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter((option) => option !== value)
      : [...selectedOptions, value];
    setSelectedOptions(newSelectedOptions);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-gray-100 rounded-md shadow-sm outline-none hover:shadow-lg w-full"
      >
        {selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Select Access'}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
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

export default AccessDropdown;
