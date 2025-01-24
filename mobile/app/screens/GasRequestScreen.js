import React from 'react';
import { View, Text, Button } from 'react-native';
import GasRequestForm from './GasRequestForm';

const GasRequestScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Gas Request Management</Text>
      <GasRequestForm />
      <Text style={{ marginVertical: 10 }}>Please fill out the form below:</Text>

      <GasRequestForm />
      <Button
        title="Submit Request"
        onPress={() => {
          // form submission logic
        }}
      />
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />

    </View>
  );
};





export default GasRequestScreen;
