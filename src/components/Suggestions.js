import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

const bodyParts = [
  'back', 'cardio', 'chest', 'lower arms', 'lower legs',
  'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'
];

export default function Suggestions() {
  const [selectedPart, setSelectedPart] = useState('');
  const [suggestion, setSuggestion] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const fetchSuggestion = async () => {
    if (!selectedPart) {
      toast.error('Please select a body part');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${selectedPart}`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPI_HOST
          }
        }
      );
      const data = await response.json();
      const randomExercise = data[Math.floor(Math.random() * data.length)];
      setSuggestion(randomExercise);
      setReps('');
      setSets('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch suggestion');
    } finally {
      setLoading(false);
    }
  };

  const saveSuggestion = async () => {
    if (!userId || !suggestion) return;
    if (!reps || !sets) {
      toast.error('Please enter reps and sets');
      return;
    }

    try {
      await addDoc(collection(db, 'workouts'), {
        name: suggestion.name,
        reps,
        sets,
        equipment: suggestion.equipment || 'N/A',
        date: new Date().toISOString().slice(0, 10),
        userId,
        timestamp: new Date()
      });
      toast.success('Suggested workout added!');
      setSuggestion(null);
      setReps('');
      setSets('');
    } catch (err) {
      toast.error('Failed to save workout');
      console.error(err);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md mt-8 space-y-4">
      <h2 className="text-xl font-bold">Get a Workout Suggestion</h2>

      <select
        value={selectedPart}
        onChange={(e) => setSelectedPart(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Select a body part</option>
        {bodyParts.map(part => (
          <option key={part} value={part}>{part}</option>
        ))}
      </select>

      <button
        onClick={fetchSuggestion}
        disabled={loading}
        className="btn bg-blue-600 text-white w-full"
      >
        {loading ? 'Loading...' : 'Get Suggestion'}
      </button>

      {suggestion && (
        <div className="border p-4 rounded mt-4 bg-gray-50 space-y-2">
          <p><strong>Name:</strong> {suggestion.name}</p>
          <p><strong>Target:</strong> {suggestion.target}</p>
          <p><strong>Equipment:</strong> {suggestion.equipment}</p>
          <p><strong>Body Part:</strong> {suggestion.bodyPart}</p>

          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps"
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="Sets"
            className="w-full border p-2 rounded"
          />

          <button
            onClick={saveSuggestion}
            className="mt-2 btn bg-green-600 text-white w-full"
          >
            Add to My Workouts
          </button>
        </div>
      )}
    </div>
  );
}
