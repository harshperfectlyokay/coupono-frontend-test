"use client";
import React, { useRef, useEffect } from "react";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import Logo from "./Logo";
import SignInSignUpButtons from "./SignInSignUpButtons";

interface NavProps {}

const Nav: React.FC<NavProps> = () => {
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isMobileMenuOpenRef = useRef(false);

  const toggleMobileMenu = (): void => {
    isMobileMenuOpenRef.current = !isMobileMenuOpenRef.current;
    updateMobileMenuVisibility();
  };

  const updateMobileMenuVisibility = () => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpenRef.current) {
        mobileMenuRef.current.style.transform = "translateX(0)";
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        mobileMenuRef.current.style.transform = "translateX(100%)";
        document.removeEventListener("mousedown", handleClickOutside);
      }
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node)
    ) {
      isMobileMenuOpenRef.current = false;
      updateMobileMenuVisibility();
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-navbar sticky inset-0 z-40">
      <header className="h-[66px] border-b bg-navbar px-4 md:px-12 xl:px-24">
        <div className="flex h-full items-center justify-between">
          {/* Logo and Desktop Menu */}
          <div className="flex items-center">
            <Logo />
            {/* <div className="hidden lg:flex items-center gap-x-8 ml-4"> */}
            <div>
              <DesktopMenu />
            </div>
          </div>

          {/* SearchBar and SignIn/SignUp Buttons for Desktop */}
          <div className="hidden min-[769px]:flex items-center gap-x-4">
            <SearchBar />
            <SignInSignUpButtons />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="min-[769px]:hidden flex items-center gap-x-2">
            <SearchBar />
            <button onClick={toggleMobileMenu} className="flex items-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-3/4 sm:w-2/5 bg-white shadow-lg transform transition-transform duration-300 ease-in-out`}
        style={{ transform: "translateX(100%)" }}
      >
        {/* Close button */}
        <button onClick={toggleMobileMenu} className="absolute top-4 right-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <div className="p-4">
          <MobileMenu />
        </div>
      </div>
    </div>
  );
};

export default Nav;
