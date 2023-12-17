import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './useAuth';
import LoginComponent from './Login';
import ProductList from './ProductList';
import ProductPage from './ProductPage';
import Profile from './Profile';
import MenuAppBar from './MenuAppBar'
import CategoryPanel from './CategoryPanel.jsx'
import { useEffect } from 'react';
import RegisterComponent from './RegisterComponent.jsx';

export default function App() {
  return (
    <AuthProvider> {/* Оберните все внутри AuthProvider */}
      <Routing />
    </AuthProvider>
  );
}

function Routing() {
  let { user, loading } = useAuth(); // Теперь useAuth не будет undefined

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <MenuAppBar />
      <CategoryPanel />
      <Routes>
        <Route path='/login' element={!user ? <LoginComponent /> : <Navigate to="/profile" />}/>
        <Route path='/product/:id' element={<ProductPage />} />
        <Route path='/category/:id' element={<ProductList />} />
        <Route path='/profile' element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path='/register' element={!user ? <RegisterComponent /> : <Navigate to="/profile" />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}