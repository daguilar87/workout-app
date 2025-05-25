
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import './styles/calendar.css';

export default function CalendarView() {
  const [userId, setUserId] = useState(null);
  const [datesWithWorkouts, setDatesWithWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchWorkoutDates(user.uid);
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
      if (data.date) {
        dates.add(data.date);
      }
    });

    setDatesWithWorkouts([...dates]);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      return datesWithWorkouts.includes(dateString) ? 'highlight' : null;
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Workout Calendar</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={tileClassName}
      />
    </div>
  );
}
