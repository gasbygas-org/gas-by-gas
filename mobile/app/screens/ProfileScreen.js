import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSave = () => {
        // logic to save the updated profile information
        console.log('Profile updated:', { name, email });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>User Profile</Text>
            <Text style={{ marginVertical: 10 }}>Welcome, {name || 'User'}</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Name"
                style={{ borderWidth: 1, width: '80%', marginBottom: 10, padding: 8 }}
            />
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                style={{ borderWidth: 1, width: '80%', marginBottom: 10, padding: 8 }}
            />
            <Button title="Save Profile" onPress={handleSave} />
        </View>
    );
};

export default ProfileScreen;
