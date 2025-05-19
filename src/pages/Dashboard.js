import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Log a Workout" onClick={() => navigate('/log-workout')} />
          <Card title="View Workouts" onClick={() => navigate('/workoutlist')} />
          <Card title="Exercise Suggestions" onClick={() => navigate('/suggestions')} />
          <Card title="Progress Chart" onClick={() => navigate('/progress')} />
          <Card title="Workout Calendar" onClick={() => navigate('/calendar')} />
        </div>
      </div>
    </div>
  );
}

function Card({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-6 bg-white shadow-lg rounded-xl hover:shadow-xl hover:scale-105 transition"
    >
      <h2 className="text-xl font-semibold text-center">{title}</h2>
    </div>
  );
}
