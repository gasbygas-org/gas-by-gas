import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const GasRequestForm = () => {
  const [requestDetails, setRequestDetails] = useState('');

  const handleSubmit = () => {
    console.log('Gas request submitted:', requestDetails);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Submit a Gas Request</Text>
      <TextInput
        placeholder="Enter request details"
        value={requestDetails}
        onChangeText={setRequestDetails}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default GasRequestForm;
