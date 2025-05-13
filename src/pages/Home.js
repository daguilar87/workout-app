import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to FitGenie</h1>
      <p className="home-description">
        Your personalized workout planner and tracker. Log workouts, get exercise suggestions, and track your progress.
      </p>

      <div className="home-buttons">
        <Link to="/register" className="home-btn primary-btn">Get Started</Link>
        <Link to="/login" className="home-btn secondary-btn">Log In</Link>
      </div>
    </div>
  );
};

export default Home;

