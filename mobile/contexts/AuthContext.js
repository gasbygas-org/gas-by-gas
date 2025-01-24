import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken, setAuthToken } from '../services/auth';
import { Text } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getAuthToken();
      if (token) {
        setUser({ token });
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    const token = await setAuthToken(credentials);
    setUser({ token });
  };

  const logout = () => {
    setUser(null);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
