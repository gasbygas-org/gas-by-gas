import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>GasByGas</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />

      <Button
        title="Go to Signup"
        onPress={() => navigation.navigate('Signup')}
      />
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

export default HomeScreen;
