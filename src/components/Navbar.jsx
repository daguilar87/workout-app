import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      <div className="navbar-start flex-1 relative">
        <button className="btn btn-ghost btn-circle" onClick={toggleDropdown}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/>
          </svg>
        </button>
        {dropdownOpen && (
          <ul className="absolute top-12 left-0 menu p-2 shadow bg-white rounded-box w-52 z-50">
            <li><Link to="/" onClick={closeDropdown}>Home</Link></li>
            {!user && <li><Link to="/login" onClick={closeDropdown}>Login</Link></li>}
            {!user && <li><Link to="/register" onClick={closeDropdown}>Register</Link></li>}
            {user && <li><Link to="/workouts" onClick={closeDropdown}>Workouts</Link></li>}
            {user && <li><Link to="/profile" onClick={closeDropdown}>Profile</Link></li>}
            {user && <li><button onClick={() => { handleLogout(); closeDropdown(); }}>Logout</button></li>}
          </ul>
        )}
      </div>

      <div className="navbar-center flex-none">
        <Link to="/" className="btn btn-ghost normal-case text-xl">Workout App</Link>
      </div>

      <div className="navbar-end flex-1"></div>
    </div>
  );
};

export default Navbar;
