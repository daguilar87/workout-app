import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

    const handleSignOut = async () => {
        try {
    await signOut(auth);
    toast.success('Signed out successfully!');
    navigate('/');
  } catch (error) {
    console.error('Sign out error:', error);
    toast.error('Failed to sign out');
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
        {user && (
          <p className="text-gray-700 mb-6">Logged in as <strong>{user.email}</strong></p>
        )}
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
