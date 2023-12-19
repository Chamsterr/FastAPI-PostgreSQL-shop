import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(username, password);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" value={username} onChange={e => setUsername(e.target.value)} placeholder="Email" style={{ padding: '10px', margin: '10px' }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ padding: '10px', margin: '10px' }} />
        <button onClick={handleLogin} style={{ padding: '10px', margin: '10px', cursor: 'pointer' }}>Login</button>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/register">Register</Link>
        </div>
        {error && <p style={{ display: 'flex', justifyContent: 'center' }}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginComponent;
