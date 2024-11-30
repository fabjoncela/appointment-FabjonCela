import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProviderRoute = ({ children }) => {
  const { user, token } = useSelector(state => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'provider') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProviderRoute; 