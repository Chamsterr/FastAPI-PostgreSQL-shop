import { Route, Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    return !!document.cookie.includes('bonds');
};
  

const ProtectedRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? <Route {...rest} element={element} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
