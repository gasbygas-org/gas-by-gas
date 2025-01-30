import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { loadAuthState, login, register, logout } from '../../contexts/AuthContext';

const HomeScreen = ({ navigation, testProp }) => {
  useEffect(() => {
    const initializeAuth = async () => {
      const { storedToken, storedUser } = await loadAuthState();
      if (storedToken && storedUser) {
        navigation.replace('Profile');
      }
    };

    initializeAuth();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>GasByGas {testProp}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Signup"
            color="#2e86de"
            onPress={() => navigation.replace('Signup')}
          />
          <Button
            title="Login"
            color="#666"
            onPress={() => navigation.replace('Login')}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
});

export default HomeScreen;
