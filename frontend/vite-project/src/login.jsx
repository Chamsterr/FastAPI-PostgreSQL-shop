import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

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
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="e-mail" style={{ padding: '10px' }} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ padding: '10px' }} />
        <button onClick={handleLogin} style={{ padding: '10px', cursor: 'pointer' }}>Login</button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default LoginComponent;