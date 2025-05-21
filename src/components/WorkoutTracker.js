import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function WorkoutTracker() {
  const [formData, setFormData] = useState({ name: '', reps: '', sets: '', date: '' });
  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', reps: '', sets: '', date: '' });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        const q = query(collection(db, 'workouts'), where('userId', '==', user.uid));
        const unsubFirestore = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setWorkouts(data);
        });
        return () => unsubFirestore();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
        timestamp: new Date(),
      });
      toast.success('Workout saved!');
      setFormData({ name: '', reps: '', sets: '', date: '' });
    } catch (err) {
      toast.error('Failed to save workout');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this workout?');
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, 'workouts', id));
      toast.success('Workout deleted!');
    } catch (err) {
      toast.error('Failed to delete workout');
      console.error(err);
    }
  };

  const handleEdit = (workout) => {
    setEditingId(workout.id);
    setEditData({ name: workout.name, reps: workout.reps, sets: workout.sets, date: workout.date });
  };

  const handleEditChange = (e) => {
    setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, 'workouts', editingId), editData);
      toast.success('Workout updated!');
      setEditingId(null);
      setEditData({ name: '', reps: '', sets: '', date: '' });
    } catch (err) {
      toast.error('Failed to update workout');
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Track Your Workout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Exercise name" required className="w-full border p-2 rounded" />
        <input name="reps" value={formData.reps} onChange={handleChange} placeholder="Reps" required className="w-full border p-2 rounded" />
        <input name="sets" value={formData.sets} onChange={handleChange} placeholder="Sets" required className="w-full border p-2 rounded" />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Workout</button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Your Workouts</h3>
        {workouts.length === 0 && <p className="text-gray-600 mt-2">No workouts logged yet.</p>}
        {workouts.map(workout => (
          <div key={workout.id} className="mt-4 p-4 border rounded shadow-sm bg-gray-50">
            {editingId === workout.id ? (
              <div className="space-y-2">
                <input name="name" value={editData.name} onChange={handleEditChange} className="w-full border p-2 rounded" />
                <input name="reps" value={editData.reps} onChange={handleEditChange} className="w-full border p-2 rounded" />
                <input name="sets" value={editData.sets} onChange={handleEditChange} className="w-full border p-2 rounded" />
                <input type="date" name="date" value={editData.date} onChange={handleEditChange} className="w-full border p-2 rounded" />
                <div className="flex space-x-2">
                  <button onClick={handleSaveEdit} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p><strong>Exercise:</strong> {workout.name}</p>
                <p><strong>Reps:</strong> {workout.reps}</p>
                <p><strong>Sets:</strong> {workout.sets}</p>
                <p><strong>Date:</strong> {workout.date}</p>
                <div className="flex space-x-2 mt-2">
                  <button onClick={() => handleEdit(workout)} className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500">Edit</button>
                  <button onClick={() => handleDelete(workout.id)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
