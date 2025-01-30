import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';

import { loadAuthState, login, register, logout } from '../../contexts/AuthContext';

const LoginScreen = ({ navigation, token }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // useEffect(() => {
    //     const initializeAuth = async () => {
    //         const { storedToken, storedUser } = await loadAuthState();
    //         console.log(storedToken, storedUser);
    //         if (storedToken && storedUser) {
    //             navigation.replace('Profile');
    //         }
    //     };

    //     initializeAuth();
    // }, []);

    const handleSubmit = async () => {
        if (!email || !password) {
            setErrorMessage('Email and password are required');

            return;
        }

        try {
            const success = await login({ email, password });
            if (success) navigation.replace('Profile');
        } catch (error) {
            setErrorMessage(error.message || 'Invalid credentials');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>
                {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <View style={styles.buttonContainer}>
                    <Button
                        title="Login"
                        color="#2e86de"
                        onPress={handleSubmit}
                    />
                    <Button
                        title="Back to Home"
                        color="#666"
                        onPress={() => navigation.replace('Home')}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 20,
        gap: 10,
    },
});

export default LoginScreen;
