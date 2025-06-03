import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import '../styles/calendar.css';

export default function CalendarView() {
  const [userId, setUserId] = useState(null);
  const [datesWithWorkouts, setDatesWithWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workoutsForDate, setWorkoutsForDate] = useState([]);
  const [newWorkout, setNewWorkout] = useState({ exercise: '', sets: '', reps: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchWorkoutDates(user.uid);
        await fetchWorkoutsForDate(new Date(), user.uid);
      } else {
        setUserId(null);
        setDatesWithWorkouts([]);
        setWorkoutsForDate([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchWorkoutDates = async (uid) => {
    const q = query(collection(db, 'workouts'), where('userId', '==', uid));
    const querySnapshot = await getDocs(q);
    const dates = new Set();

    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.date && !data.planned) {
        let dateStr;

        if (typeof data.date === 'string') {
          dateStr = data.date;
        } else if (data.date.toDate) {
          // Firestore Timestamp object
          dateStr = data.date.toDate().toISOString().split('T')[0];
        } else if (data.date instanceof Date) {
          dateStr = data.date.toISOString().split('T')[0];
        }

        if (dateStr) {
          dates.add(dateStr);
        }
      }
    });

    setDatesWithWorkouts([...dates]);
  };

  const fetchWorkoutsForDate = async (date, uid) => {
    const dateStr = date.toISOString().split('T')[0];
    const q = query(
      collection(db, 'workouts'),
      where('userId', '==', uid),
      where('date', '==', dateStr),
      where('planned', '==', false)
    );

    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }));

    setWorkoutsForDate(results);
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    if (userId) {
      await fetchWorkoutsForDate(date, userId);
    }
  };

  const handleInputChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  const handleAddWorkout = async () => {
    if (!newWorkout.exercise || !userId) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    await addDoc(collection(db, 'workouts'), {
      ...newWorkout,
      userId,
      date: dateStr,
      planned: false,
      createdAt: new Date(),
    });

    setNewWorkout({ exercise: '', sets: '', reps: '' });
    await fetchWorkoutDates(userId);
    await fetchWorkoutsForDate(selectedDate, userId);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      return datesWithWorkouts.includes(dateString) ? 'highlight' : null;
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Workout Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={tileClassName}
        locale="en-US"
        showNeighboringMonth={false}
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString(locale, { weekday: 'narrow' }) // single letter day header
        }
        className="mx-auto max-w-md"
      />

      <div className="mt-6">
        <h3 className="font-semibold text-xl mb-3">
          Workouts on{' '}
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </h3>
        {workoutsForDate.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {workoutsForDate.map((w, i) => (
              <li key={w.id || i}>
                {w.exercise} — {w.sets} sets × {w.reps} reps
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No workouts logged for this day.</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Add Workout</h3>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            name="exercise"
            placeholder="Exercise"
            value={newWorkout.exercise}
            onChange={handleInputChange}
            className="input input-sm input-bordered"
          />
          <input
            type="number"
            name="sets"
            placeholder="Sets"
            value={newWorkout.sets}
            onChange={handleInputChange}
            className="input input-sm input-bordered"
          />
          <input
            type="number"
            name="reps"
            placeholder="Reps"
            value={newWorkout.reps}
            onChange={handleInputChange}
            className="input input-sm input-bordered"
          />
        </div>
        <button onClick={handleAddWorkout} className="mt-3 btn btn-primary btn-sm">
          Add Workout
        </button>
      </div>
    </div>
  );
}
