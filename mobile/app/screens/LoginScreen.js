import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signin } from '../../services/auth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        if (!email || !password) {
            setErrorMessage('Email and password are required.');
            return;
        }

        const result = await signin({ email, password });

        if (result) {
            navigation.navigate('Profile');
        } else {
            setErrorMessage('Login failed. Please check your credentials.');
        }
    };

    return (
        <View>
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
            <TextInput
                onChangeText={setEmail}
                value={email}
                placeholder="Email"
            />
            <TextInput
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                placeholder="Password"
            />
            <Button onPress={handleSubmit} title="Login" />
            <Text style={{ marginVertical: 10 }}>
                <Text style={{ color: 'blue' }} onPress={() => {/* forgot password logic */ }}>
                    Forgot Password?
                </Text>
            </Text>
        </View>
    );
};

export default LoginScreen;
