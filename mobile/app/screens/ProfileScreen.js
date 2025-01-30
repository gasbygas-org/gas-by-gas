import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { loadAuthState, login, register, logout } from '../../contexts/AuthContext';

const ProfileScreen = ({ navigation, user/*, logout*/ }) => {
    const [authUser, setAuthUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const initializeAuth = async () => {
            const { storedToken, storedUser } = await loadAuthState();
            console.log(storedToken, storedUser);
            if (!storedToken || !storedUser) {
                navigation.replace('Home');
            } else {
                setAuthUser(storedUser);
            }
        };

        initializeAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigation.replace('Home');
        } catch (error) {
            console.log(error.message);
            setErrorMessage('Logout failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
            <Text style={styles.title}>User Profile</Text>
            <View style={styles.profileInfo}>
                <Text style={styles.label}>NIC:</Text>
                <Text style={styles.info}>{authUser?.nic}</Text>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.info}>{authUser?.name}</Text>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.info}>{authUser?.email}</Text>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.info}>{authUser?.phone}</Text>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.info}>{authUser?.address}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Gas Requests"
                    color="#2e86de"
                    onPress={() => navigation.replace('GasRequests')}
                />
                <Button
                    title="Logout"
                    color="red"
                    onPress={handleLogout}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    profileInfo: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 20,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    info: {
        marginBottom: 15,
    },
    buttonContainer: {
        gap: 10,
    },
});

export default ProfileScreen;
