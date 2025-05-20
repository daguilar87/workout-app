import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';
import Avatar from 'react-avatar';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully!');
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="bg-base-100 shadow-md px-4">
      <div className="flex items-center justify-between h-16 relative">

        <div className="relative">
          <button onClick={toggleDropdown} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>

          <div
            className={`absolute z-50 left-0 mt-2 w-52 rounded-md shadow-lg bg-white transform transition-all duration-300 origin-top ${
              dropdownOpen
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}
          >
            <ul className="menu p-2">
              <li><Link to="/" onClick={closeDropdown}>Home</Link></li>
              {!user ? (
                <>
                  <li><Link to="/login" onClick={closeDropdown}>Login</Link></li>
                  <li><Link to="/register" onClick={closeDropdown}>Register</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/workouts" onClick={closeDropdown}>Workouts</Link></li>
                  <li><Link to="/dashboard" onClick={closeDropdown}>Dashboard</Link></li>
                  <li><button onClick={() => { handleLogout(); closeDropdown(); }}>Logout</button></li>
                </>
              )}
            </ul>
          </div>
        </div>

     
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link
            to="/"
            className="text-xl font-bold hover:text-blue-600 transition duration-200"
          >
            Workout App
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <>
              <Avatar name={user.email} size="32" round textSizeRatio={2} />
              <span className="hidden sm:inline text-sm font-medium">{user.email}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
