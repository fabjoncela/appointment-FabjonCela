import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CustomerRoute = () => {
  const { user, token } = useSelector((state) => state.auth);

  // If no token or no user, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // If user is not a customer, redirect to home
  if (user.role !== 'customer') {
    return <Navigate to="/" />;
  }

  // Render nested routes
  return <Outlet />;
};

export default CustomerRoute;
