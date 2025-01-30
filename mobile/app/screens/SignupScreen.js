import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import { loadAuthState, login, register, logout } from '../../contexts/AuthContext';

const SignupScreen = ({ navigation/*, register*/ }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        nic: '',
        address: ''
    });
    const [isPasswordStrong, setIsPasswordStrong] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            setIsPasswordStrong(value.length >= 8);
        }
    };

    const validateForm = () => {
        const requiredFields = ['name', 'email', 'password', 'phone', 'nic', 'address'];
        return requiredFields.every(field => formData[field].trim());
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setErrorMessage('All fields are required');
            return;
        }

        if (!isPasswordStrong) {
            setErrorMessage('Password must be at least 8 characters');
            return;
        }

        try {
            const success = await register({ ...formData, role: 'user' });
            if (success) navigation.replace('Login');
        } catch (error) {
            setErrorMessage(error.message || 'Please try again');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Create Account</Text>
                {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}

                {Object.entries(formData).map(([key, value]) => (
                    key !== 'password' ? (
                        <TextInput
                            key={key}
                            style={styles.input}
                            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={value}
                            onChangeText={text => handleChange(key, text)}
                            autoCapitalize={key === 'email' ? 'none' : 'words'}
                            keyboardType={
                                key === 'email' ? 'email-address' :
                                    key === 'phone' ? 'phone-pad' : 'default'
                            }
                        />
                    ) : (
                        <View key={key} style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={value}
                                onChangeText={text => handleChange(key, text)}
                                secureTextEntry
                            />
                            {formData.password && (
                                <Text style={[styles.passwordStrength, { color: isPasswordStrong ? 'green' : 'red' }]}>
                                    {isPasswordStrong ? '✓ Strong' : '✗ Weak'}
                                </Text>
                            )}
                        </View>
                    )
                ))}

                <View style={styles.buttonContainer}>
                    <Button
                        title="Sign Up"
                        onPress={handleSubmit}
                        color="#2e86de"
                    />
                    <Button
                        title="Back to Home"
                        onPress={() => navigation.replace('Home')}
                        color="#666"
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
    scrollView: {
        flex: 1,
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
    passwordContainer: {
        marginBottom: 15,
    },
    passwordStrength: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 5,
    },
    buttonContainer: {
        marginTop: 20,
        gap: 10,
    },
});

export default SignupScreen;
