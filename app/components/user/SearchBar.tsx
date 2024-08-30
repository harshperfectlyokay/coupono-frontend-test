"use client"
import { useState, ChangeEvent, useRef, useEffect } from 'react';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchBarRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => setSearchQuery(e.target.value);
  const clearSearch = (): void => setSearchQuery('');

  const handleClickOutside = (event: MouseEvent) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
      setSearchQuery('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchBarRef} className="relative ml-3">
      <input
        placeholder="Search coupons by store"
        value={searchQuery}
        onChange={handleSearchChange}
        className="border-2 px-3 py-2 pr-16 outline-none rounded-full"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-x-2">
        {searchQuery && (
          <button className="focus:outline-none" onClick={clearSearch}>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}
        <button>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
