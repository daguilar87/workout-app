import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md px-4 py-2">
      <div className="flex items-center justify-between relative max-w-7xl mx-auto">
        
        <div className="relative">
          <button
            onClick={handleToggle}
            className="btn btn-ghost btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>

          <div
            className={`absolute mt-2 w-48 bg-white rounded-md shadow-md transition-all duration-300 origin-top transform z-50 ${
              menuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
            }`}
          >
            <ul className="menu p-2 space-y-1">
              <li><Link to="/" onClick={handleClose}>Home</Link></li>
              <li><Link to="/workouts" onClick={handleClose}>Workouts</Link></li>
              <li><Link to="/profile" onClick={handleClose}>Profile</Link></li>
              <li>
                <button
                  onClick={() => {
                    handleClose();
                    alert('Logged out!');
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="text-xl font-bold text-gray-800">
            WorkoutApp
          </Link>
        </div>
        <div className="w-8" /> 
      </div>
    </nav>
  );
};

export default Navbar;
