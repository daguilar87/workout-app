import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/workout.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

          <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <motion.div
          className="text-center bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl max-w-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-4xl font-bold mb-6 text-gray-800"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome to the Workout App
          </motion.h1>

          {user && (
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Go to Dashboard
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
