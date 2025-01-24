import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signup } from '../../services/auth';

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isPasswordStrong, setIsPasswordStrong] = useState(false);

    const handlePasswordChange = (password) => {
        setPassword(password);
        // simple password strength check
        setIsPasswordStrong(password.length >= 8);
    };

    const handleSubmit = async () => {
        if (!email || !password) {
            setErrorMessage('Email and password are required.');
            return;
        }

        const result = await signup({ email, password });
        if (result.token) {
            navigation.navigate('App');
        } else {
            setErrorMessage('Signup failed. Please try again.');
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
                onChangeText={handlePasswordChange}
                value={password}
                secureTextEntry
                placeholder="Password"
            />
            {password && (
                <Text style={{ color: isPasswordStrong ? 'green' : 'red' }}>
                    {isPasswordStrong ? 'Strong password' : 'Password must be at least 8 characters'}
                </Text>
            )}
            <Button onPress={handleSubmit} title="Sign Up" />
        </View>
    );
};

export default SignupScreen;
