import { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', reps: '', sets: '', date: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(collection(db, 'workouts'), where('userId', '==', user.uid));
        const unsubFirestore = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setWorkouts(data);
        });
        return () => unsubFirestore();
      }
    });

    return () => unsubscribe();
  }, []);

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
    setEditData({
      name: workout.name,
      reps: workout.reps,
      sets: workout.sets,
      date: workout.date
    });
  };

  const handleEditChange = (e) => {
    setEditData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
    <div className="space-y-4 mt-8">
      <h2 className="text-xl font-bold">Your Workouts</h2>
      {workouts.length === 0 && <p>No workouts logged yet.</p>}
      {workouts.map(workout => (
        <div key={workout.id} className="border p-4 rounded-lg shadow-sm bg-white">
          {editingId === workout.id ? (
            <div className="space-y-2">
              <input
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="reps"
                value={editData.reps}
                onChange={handleEditChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="sets"
                value={editData.sets}
                onChange={handleEditChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                name="date"
                value={editData.date}
                onChange={handleEditChange}
                className="w-full border p-2 rounded"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p><strong>Exercise:</strong> {workout.name}</p>
              <p><strong>Reps:</strong> {workout.reps}</p>
              <p><strong>Sets:</strong> {workout.sets}</p>
              <p><strong>Date:</strong> {workout.date}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(workout)}
                  className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(workout.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
