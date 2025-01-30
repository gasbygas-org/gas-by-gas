import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import GasRequestScreen from './screens/GasRequestScreen';
import GasRequestForm from './screens/GasRequestForm';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const Stack = createStackNavigator();

export default function RootLayout({ user, token, login, register, logout }) {
    return (
        // <Stack.Navigator>
        //     {user ? (
        //         <>
        //             <Stack.Screen name="Profile">
        //                 {props => <ProfileScreen {...props} user={user} logout={logout} />}
        //             </Stack.Screen>
        //             <Stack.Screen name="GasRequests" component={GasRequestScreen} />
        //             <Stack.Screen name="GasRequestForm" component={GasRequestForm} />
        //         </>
        //     ) : (
        //         <>
        //             <Stack.Screen name="Home" component={HomeScreen} />
        //             <Stack.Screen name="Login">
        //                 {props => <LoginScreen {...props} login={login} />}
        //             </Stack.Screen>
        //             <Stack.Screen name="Signup">
        //                 {props => <SignupScreen {...props} register={register} />}
        //             </Stack.Screen>
        //         </>
        //     )}
        // </Stack.Navigator>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login">
                {props => <LoginScreen {...props} login={login} />}
            </Stack.Screen>
            <Stack.Screen name="Signup">
                {props => <SignupScreen {...props} register={register} />}
            </Stack.Screen>
            <Stack.Screen name="Profile">
                {props => <ProfileScreen {...props} user={user} logout={logout} />}
            </Stack.Screen>
            <Stack.Screen name="GasRequests" component={GasRequestScreen} />
            <Stack.Screen name="GasRequestForm" component={GasRequestForm} />
        </Stack.Navigator>
    );
}
