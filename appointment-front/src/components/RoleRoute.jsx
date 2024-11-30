import { Navigate } from 'react-router-dom'
import { useRole } from '../hooks/useRole'

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector(state => state.auth)

  if (!token || !user?.role) {
    return <Navigate to="/login" />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />
  }


  return children
}

export default RoleRoute 