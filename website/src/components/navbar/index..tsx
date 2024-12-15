import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-200 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-white">
              {/* MyBrand */}
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <a href="/workspace" className="hover:text-gray-600">
              WorkSpace
            </a>
            <a href="/team-invite" className="hover:text-gray-600">
              Invite Team
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
