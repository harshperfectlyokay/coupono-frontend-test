"use client"
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const DesktopMenu: React.FC = () => {
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState<boolean>(false);
  const [isStoresDropdownOpen, setIsStoresDropdownOpen] = useState<boolean>(false);

  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const storesDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMoreDropdown = (): void => setIsMoreDropdownOpen(prev => !prev);
  const toggleStoresDropdown = (): void => setIsStoresDropdownOpen(prev => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
      setIsMoreDropdownOpen(false);
    }
    if (storesDropdownRef.current && !storesDropdownRef.current.contains(event.target as Node)) {
      setIsStoresDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="hidden min-[769px]:flex items-center gap-x-4 xl:gap-x-8 ml-4">
      <div className="relative">
        <button onClick={toggleStoresDropdown} className="px-5 py-2 rounded-full hover:bg-gray-200 focus:bg-gray-200">
          Stores
        </button>
        {isStoresDropdownOpen && (
          <div ref={storesDropdownRef} className="absolute top-full right-[-300px] w-96 bg-white shadow-lg mt-2 rounded">
            <div className="flex">
              <div className="w-1/2 p-4 border-r border-gray-300">
                {/* Categories Section */}
                <div className="text-sm font-bold mb-2">Categories</div>
                <Link href="/category1"><p className="block px-4 py-2 hover:bg-gray-200">C1</p></Link>
                <Link href="/category2"><p className="block px-4 py-2 hover:bg-gray-200">C2</p></Link>
                <Link href="/category3"><p className="block px-4 py-2 hover:bg-gray-200">C3</p></Link>
                <Link href="/all-categories"><p className="block px-4 py-2 hover:bg-gray-200">All Categories</p></Link>
              </div>
              <div className="w-1/2 p-4">
                {/* Stores Section */}
                <div className="text-sm font-bold mb-2">Stores</div>
                <Link href="/store1"><p className="block px-4 py-2 hover:bg-gray-200">S1</p></Link>
                <Link href="/store2"><p className="block px-4 py-2 hover:bg-gray-200">S2</p></Link>
                <Link href="/store3"><p className="block px-4 py-2 hover:bg-gray-200">S3</p></Link>
                <Link href="/all-stores"><p className="block px-4 py-2 hover:bg-gray-200">All Stores</p></Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Link href="/cashback">
        <button className="px-5 py-2 rounded-full hover:bg-gray-200 focus:bg-gray-200">Cashback</button>
      </Link>
      <Link href="/blog">
        <button className="px-5 py-2 rounded-full hover:bg-gray-200 focus:bg-gray-200">Blog</button>
      </Link>
      <div className="relative">
        <button onClick={toggleMoreDropdown} className="px-5 py-2 rounded-full hover:bg-gray-200 focus:bg-gray-200">
          More
        </button>
        {isMoreDropdownOpen && (
          <div ref={moreDropdownRef} className="absolute top-full right-[-110px] w-48 bg-white shadow-lg mt-2 rounded">
            <Link href="/submit-code">
              <p className="block px-4 py-2 text-left hover:bg-gray-200">Submit Code</p>
            </Link>
            <Link href="/install-extension">
              <p className="block px-4 py-2 text-left hover:bg-gray-200">Install Extension</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopMenu;
