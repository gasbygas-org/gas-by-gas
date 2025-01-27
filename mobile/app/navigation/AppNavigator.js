import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const AuthStack = createStackNavigator();
export const AuthStackNavigator = () => (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
);

const Tab = createBottomTabNavigator();
export const AppTabs = () => (
    <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

const RootStack = createStackNavigator();
export const RootNavigator = () => {
    const { user } = useContext(AuthContext);
    const isAuthenticated = !!user;

    return (
        <RootStack.Navigator>
            {isAuthenticated ? (
                <RootStack.Screen name="App" component={AppTabs} />
            ) : (
                <RootStack.Screen name="Auth" component={AuthStackNavigator} />
            )}
        </RootStack.Navigator>
    );
};
