import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();

useEffect(() => {
    if (localStorage.getItem('token')) {
    const role = localStorage.getItem('role');
    if (role === 'customer') {
      navigate('/customer');
    } else {
      navigate('/provider');
    }
  }
}, [])


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bookings Made Easy
        </h1>
        <p className="text-gray-600 text-lg">
          Simplify your booking experience with our platform
        </p>
      </div>

      <div className="space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LandingPage;