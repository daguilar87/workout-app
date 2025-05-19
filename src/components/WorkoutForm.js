import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function WorkoutForm() {
  const [formData, setFormData] = useState({
    name: '',
    reps: '',
    sets: '',
    date: ''
  });
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    try {
      await addDoc(collection(db, 'workouts'), {
        ...formData,
        userId,
        timestamp: new Date()
      });
      toast.success('Workout saved!');
      setFormData({ name: '', reps: '', sets: '', date: '' });
    } catch (err) {
      toast.error('Failed to save workout');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Exercise name" required />
      <input name="reps" value={formData.reps} onChange={handleChange} placeholder="Reps" required />
      <input name="sets" value={formData.sets} onChange={handleChange} placeholder="Sets" required />
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      <button type="submit" className="btn bg-blue-600 text-white">Save Workout</button>
    </form>
  );
}
