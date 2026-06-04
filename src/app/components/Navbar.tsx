"use client";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = () => {
    window.location.href = "/";
  };

  return (
    <nav className="border-b border-[#43A3A3]">
      <nav className="text-black py-3  max-w-screen-2xl mx-auto px-4 lg:px-16 w-full">
      <div className="w-full flex justify-between items-center">
        <div className="text-[35px] font-medium" onClick={handleNavigate}>ALCHEMY</div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-12">
          <Link
            href="/"
            className="text-[16px] font-medium"
          >
            HOME
          </Link>
          <Link
            href="/about"
            className="text-[16px] font-medium"
          >
            ABOUT US
          </Link>
          <Link
            href="/service"
            className="text-[16px] font-medium"
          >
            SERVICES
          </Link>
          <Link
            href="/contact_us"
            className="text-[16px] font-medium"
          >
            CONTACT US
          </Link>
          {/* <Link
            href="/book_appointment"
            className="text-[18px] lg:text-[22px] lg:text-[24px] font-medium"
          >
            BOOK AN APPOINTMENT
          </Link> */}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden">
          <button
            className="text-[24px] font-medium"
            onClick={() => setMenuOpen(!menuOpen)} // toggle menu visibility
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden ${
          menuOpen ? "flex flex-col" : "hidden"
        } space-y-4`}
      >
        <Link
          href="/"
          className="text-[18px] lg:text-[22px] lg:text-[24px] font-medium"
          onClick={() => setMenuOpen(false)}
        >
          HOME
        </Link>
        <Link
          href="/about"
          className="text-[18px] lg:text-[22px] lg:text-[24px] font-medium"
          onClick={() => setMenuOpen(false)}
        >
          ABOUT US
        </Link>
        <Link
          href="/service"
          className="text-[18px] lg:text-[22px] lg:text-[24px] font-medium"
          onClick={() => setMenuOpen(false)}
        >
          SERVICES
        </Link>
        <Link
          href="/contact_us"
          className="text-[18px] lg:text-[22px] lg:text-[24px] font-medium"
          onClick={() => setMenuOpen(false)}
        >
          CONTACT US
        </Link>
        <Link
          href="/book_appointment"
          className="text-[18px] lg:text-[22px] lg:text-[24px] font-medium"
          onClick={() => setMenuOpen(false)}
        >
          BOOK AN APPOINTMENT
        </Link>
      </div>
    </nav>
    </nav>
  );
};

export default Navbar;
