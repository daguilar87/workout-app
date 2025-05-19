import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import WorkoutForm from './components/WorkoutForm';


function App() {
  return (
      <>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/log-workout" element={<WorkoutForm />} />
      </Routes>
      </>
  );
}

export default App;
