import React, { useEffect, useState } from 'react';
import { loadAuthState, login, register, logout } from '../contexts/AuthContext';
import RootLayout from './_layout';
import { ActivityIndicator } from 'react-native';

export default function Index() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const { storedToken, storedUser } = await loadAuthState();
            setToken(storedToken);
            setUser(storedUser);
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    if (isLoading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <RootLayout
            user={user}
            token={token}
            login={login}
            register={register}
            logout={logout}
        />
    );
}
