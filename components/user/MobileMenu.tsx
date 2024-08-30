import React, { FC, memo } from 'react';
import Link from 'next/link';

const MobileMenu: FC = memo(() => (
  <nav className="mt-20 px-4">
    <ul className="space-y-4">
      <li><Link href="/signin"><p className="block px-4 py-2 text-center hover:bg-gray-200">Sign In</p></Link></li>
      <li><Link href="/signup"><p className="block px-4 py-2 text-center hover:bg-gray-200">Sign Up</p></Link></li>
      <li><Link href="/categories"><p className="block px-4 py-2 text-center hover:bg-gray-200">Categories</p></Link></li>
      <li><Link href="/stores"><p className="block px-4 py-2 text-center hover:bg-gray-200">Stores</p></Link></li>
      <li><Link href="/cashback"><p className="block px-4 py-2 text-center hover:bg-gray-200">Cashback</p></Link></li>
      <li><Link href="/blog"><p className="block px-4 py-2 text-center hover:bg-gray-200">Blog</p></Link></li>
      <li><Link href="/submit-code"><p className="block px-4 py-2 text-center hover:bg-gray-200">Submit Code</p></Link></li>
      <li><Link href="/install-extension"><p className="block px-4 py-2 text-center hover:bg-gray-200">Install Extension</p></Link></li>
    </ul>
  </nav>
));

MobileMenu.displayName = 'MobileMenu';


export default MobileMenu;
