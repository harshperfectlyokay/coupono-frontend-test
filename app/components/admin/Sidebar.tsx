'use client'
import Link from "next/link";
import React, { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { FaArrowLeft, FaXmark } from "react-icons/fa6";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  let links = [
    {
      title: 'Dashboard',
      href: '/admin'
    },{
      title: 'Cron',
      href: '/admin/cron'
    },{
      title: 'Settings',
      href: '/admin/settings'
    },{
      title: 'Users',
      href: '/admin/users'
    },{
      title: 'Categories',
      href: '/admin/categories'
    },{
      title: 'Stores',
      href: '/admin/stores'
    },{
      title: 'Offers',
      href: '/admin/offers'
    },{
      title: 'Access Control',
      href: '/admin/user-access'
    },
  ]

  return (
    <>
      {/* For Desktop */}
      <aside className={`sidebar sidebar-slide-in ${isOpen ? "hidden md:block" : "hidden"} min-h-screen px-2 bg-stone-800 text-white`}>
        <nav>
          <ul className="flex flex-col min-w-[200px] p-2 gap-1 border-b-2 text-base font-normal text-white-700">
            {links.map((link,index)=>(
              <Link
              key={index}
              href={link.href}
              className="flex items-center p-2 text-start rounded-lg outline-none hover:bg-stone-600"
            >
              {link.title}
            </Link>
            ))}
          </ul>
        </nav>
      </aside>
      <button
        className="absolute -top-12 left-0 p-2 bg-stone-500 rounded-r-lg outline-none md:block"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaArrowLeft color="white" size={20} /> : <CiMenuBurger color="white" size={20} />}
      </button>

      {/* For Mobile */}
      <aside className={`sidebar sidebar-slide-down ${isOpen ? "absolute top-0 w-full z-10" : "hidden"} p-2 bg-stone-600 text-white md:hidden`}>
        <nav className="relative">
          <button onClick={toggleSidebar} className="absolute right-0 p-2">
            <FaXmark />
          </button>
          <ul className="flex flex-col items-center py-8 space-y-4 font-sans text-base font-normal text-white-700">
          {links.map((link,index)=>(
              <Link
              key={index}
              href={link.href}
              className="px-2 py-1 border-b outline-none"
            >
              {link.title}
            </Link>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
