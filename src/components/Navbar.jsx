import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';
import Avatar from 'react-avatar';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const avatarRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setAvatarDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully!');
    navigate('/');
  };

return (
  <nav className="bg-white shadow-md px-4 relative">
    <div className="flex items-center justify-between h-16 relative">

      
      <button
        className="md:hidden focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link to="/" className="text-xl font-bold text-blue-600">Workout App</Link>
      </div>

      
      <div className="hidden md:flex items-center gap-4 ml-auto">
        {!user ? (
          <>
            <Link to="/login" className="text-sm font-medium text-blue-600 hover:underline">Login</Link>
            <Link to="/register" className="text-sm font-medium text-blue-600 hover:underline">Register</Link>
          </>
        ) : (
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
              className="flex items-center gap-2"
            >
              <Avatar name={user.email} size="32" round textSizeRatio={2} />
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {avatarDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg z-50">
                <ul className="p-2">
                  <li><Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link></li>
                  <li><Link to="/workouttracker" className="block px-4 py-2 hover:bg-gray-100">Workouts</Link></li>
                  <li><button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button></li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>

  
    {mobileMenuOpen && (
      <div className="md:hidden mt-2 space-y-2">
        <Link to="/" className="block px-4 py-2 hover:bg-gray-100">Home</Link>
        {!user ? (
          <>
            <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
            <Link to="/register" className="block px-4 py-2 hover:bg-gray-100">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
            <Link to="/workouttracker" className="block px-4 py-2 hover:bg-gray-100">Workouts</Link>
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
          </>
        )}
      </div>
    )}
  </nav>
);

};

export default Navbar;
