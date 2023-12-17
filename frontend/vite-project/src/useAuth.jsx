import { useState, useEffect, createContext, useContext } from 'react';
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    const details = {
      'username': username,
      'password': password
    };

    const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
        credentials: 'include'
      });

      if (response.status === 204) {
        const response = await fetch('http://localhost:8000/auth/me', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.status === 200) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } else {
        const data = await response.json();
        throw new Error(data.detail);
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (username, email, password) => {
    const details = {
      'username': username,
      'email': email,
      'password': password,
      'is_active': true,
      'is_superuser': false,
      'is_verified': false
    };

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(details),
        credentials: 'include'
      });

      if (response.status === 204) {
        const response = await fetch('http://localhost:8000/auth/me', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.status === 200) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } else {
        const data = await response.json();
        throw new Error(data.detail);
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.status === 204) {
        setUser(null);
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('http://localhost:8000/auth/me', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.status === 200) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
