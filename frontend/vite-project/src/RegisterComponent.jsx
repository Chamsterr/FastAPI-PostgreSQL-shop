import React, { useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'; // Импорт Yup
import { useForm } from 'react-hook-form'; // Импорт useForm
import { yupResolver } from '@hookform/resolvers/yup'; // Импорт yupResolver

const RegisterComponent = () => {
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
  });

  const { register: formRegister, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const handleRegister = async (data) => {
    try {
      await register(data.username, data.email, data.password);
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <input type="text" {...formRegister('username')} placeholder="Username" style={{ padding: '10px' }} />
        <p style={{ display: 'flex', justifyContent: 'center' }}>{errors.username?.message}</p>
        <input type="email" {...formRegister('email')} placeholder="Email" style={{ padding: '10px' }} />
        <p style={{ display: 'flex', justifyContent: 'center' }}>{errors.email?.message}</p>
        <input type="password" {...formRegister('password')} placeholder="Password" style={{ padding: '10px' }} />
        <p style={{ display: 'flex', justifyContent: 'center' }}>{errors.password?.message}</p>
        <input type="password" {...formRegister('confirmPassword')} placeholder="Confirm Password" style={{ padding: '10px' }} />
        <p style={{ display: 'flex', justifyContent: 'center' }}>{errors.confirmPassword?.message}</p>
        <button onClick={handleSubmit(handleRegister)} style={{ padding: '10px', cursor: 'pointer' }}>Register</button>
        {error && <p style={{ display: 'flex', justifyContent: 'center' }}>{error}</p>}
      </div>
    </div>
  );
};

export default RegisterComponent;