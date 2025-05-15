import '../styles/home.css';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Welcome to Your Workout App</h1>
        <p className="text-gray-600">Track your progress and stay strong!</p>
        <button
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Log In
        </button>
      </div>
    </div>
  );
}