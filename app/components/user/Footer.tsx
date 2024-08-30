import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="bg-footer text-white py-8 px-4 md:px-12 xl:px-24">
      <div className="container mx-auto md:pr-3 lg:pr-5">
        {/* Main content with 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="text-left justify-self-center">
            <h4 className="text-lg font-semibold mb-4">Column 1</h4>
            <ul className="space-y-2">
              <li><p className="text-base hover:underline cursor-pointer">Link 1</p></li>
              <li><p className="text-base hover:underline cursor-pointer">Link 2</p></li>
              <li><p className="text-base hover:underline cursor-pointer">Link 3</p></li>
              <li><p className="text-base hover:underline cursor-pointer">Link 4</p></li>
            </ul>
          </div>
          <div className="text-left justify-self-center">
            <h4 className="text-lg font-semibold mb-4">Column 2</h4>
            <ul className="space-y-2">
              <li><p className="text-base hover:underline cursor-pointer">Link 1</p></li>
              <li><p className="text-base hover:underline cursor-pointer">Link 2</p></li>
              <li><p className="text-base hover:underline cursor-pointer">Link 3</p></li>
              <li><p className="text-base hover:underline cursor-pointer">Link 4</p></li>
            </ul>
          </div>
          <div className="text-left justify-self-center">
            <h4 className="text-lg font-semibold mb-4">Column 3</h4>
            <ul className="space-y-2">
              <li><p className="text-base hover:underline cursor-pointer">Link 1</p></li>
              <li><p className="text-base hover:underline cursor-pointer">Link 2</p></li>
              <li><p className="text-base hover:underline cursor-pointer">Link 3</p></li>
              <li><p className="text-base hover:underline cursor-pointer">Link 4</p></li>
            </ul>
          </div>
          <div className="text-left justify-self-center">
            <h4 className="text-lg font-semibold mb-4">Column 4</h4>
            <ul className="space-y-2">
              <li><p className="text-base hover:underline cursor-pointer">Link 1</p></li>
              <li><p className="text-base hover:underline cursor-pointer">Link 2</p></li>
              <li><p className="text-base hover:underline cursor-pointer">Link 3</p></li>
              <li><p className="text-base hover:underline cursor-pointer">Link 4</p></li>
            </ul>
          </div>
        </div>

        {/* Social media and links */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          {/* Social Media Links */}
          <div className="flex space-x-4 mb-4 sm:mb-0">
            <Link href="https://facebook.com" passHref prefetch={false}>
              <p className="text-xl text-white hover:text-gray-400 cursor-pointer" aria-label="Facebook">
                <FaFacebookF />
              </p>
            </Link>
            <Link href="https://twitter.com" passHref prefetch={false}>
              <p className="text-xl text-white hover:text-gray-400 cursor-pointer" aria-label="Twitter">
                <FaTwitter />
              </p>
            </Link>
            <Link href="https://instagram.com" passHref prefetch={false}>
              <p className="text-xl text-white hover:text-gray-400 cursor-pointer" aria-label="Instagram">
                <FaInstagram />
              </p>
            </Link>
            <Link href="https://whatsapp.com" passHref prefetch={false}>
              <p className="text-xl text-white hover:text-gray-400 cursor-pointer" aria-label="WhatsApp">
                <FaWhatsapp />
              </p>
            </Link>
            <Link href="https://telegram.org" passHref prefetch={false}>
              <p className="text-xl text-white hover:text-gray-400 cursor-pointer" aria-label="Telegram">
                <FaTelegramPlane />
              </p>
            </Link>
          </div>

          {/* Additional Links */}
          <div className="flex space-x-4">
            <p className="text-white hover:underline cursor-pointer">Terms of Use</p>
            <p className="text-white hover:underline cursor-pointer">Privacy Policy</p>
            {/* Add more links as needed */}
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="text-center text-sm">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
