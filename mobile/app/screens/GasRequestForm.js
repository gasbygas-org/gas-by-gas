import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getOutlets, getGasTypes, submitGasRequest } from '../../services/gasRequest';
import { loadAuthState } from '../../contexts/AuthContext';

const GasRequestForm = ({ navigation }) => {
  const [formData, setFormData] = useState({
    outletId: '',
    gasTypeId: '',
    quantity: '',
  });
  const [outlets, setOutlets] = useState([]);
  const [gasTypes, setGasTypes] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [outletsData, gasTypesData] = await Promise.all([
          getOutlets(),
          getGasTypes()
        ]);
        setOutlets(outletsData);
        setGasTypes(gasTypesData);
      } catch (error) {
        setMessage({ text: 'Failed to load form data', type: 'error' });
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { storedUser } = await loadAuthState();
      const userId = storedUser.id;

      await submitGasRequest({
        userId,
        outletId: formData.outletId,
        gasTypeId: formData.gasTypeId,
        quantity: parseInt(formData.quantity),
      });

      setMessage({ text: 'Your gas request has been successfully submitted', type: 'success' });

      setTimeout(() => {
        navigation.replace('GasRequests');
      }, 3000);
    } catch (error) {
      setMessage({ text: error.message || 'Submission failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Gas Request</Text>
      {message.text ? (
        <Text style={[styles.message, message.type === 'success' ? styles.successText : styles.errorText]}>
          {message.text}
        </Text>
      ) : null}

      <Picker
        selectedValue={formData.outletId}
        onValueChange={value => setFormData(p => ({ ...p, outletId: value }))}
        style={styles.picker}
      >
        <Picker.Item label="Select Outlet" value="" />
        {outlets.map(outlet => (
          <Picker.Item
            key={outlet.id}
            label={`${outlet.outlet_name} - ${outlet.district}`}
            value={outlet.id}
          />
        ))}
      </Picker>

      <Picker
        selectedValue={formData.gasTypeId}
        onValueChange={value => setFormData(p => ({ ...p, gasTypeId: value }))}
        style={styles.picker}
      >
        <Picker.Item label="Select Gas Type" value="" />
        {gasTypes.map(type => (
          <Picker.Item
            key={type.id}
            label={type.gas_type_name}
            value={type.id}
          />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        keyboardType="numeric"
        value={formData.quantity}
        onChangeText={text => setFormData(p => ({ ...p, quantity: text }))}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Submitting..." : "Submit Request"}
          onPress={handleSubmit}
          disabled={loading}
          color="#2e86de"
        />
        <Button
          title="Back to Gas Requests"
          onPress={() => navigation.replace('GasRequests')}
          color="#666"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  message: {
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  successText: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  errorText: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  buttonContainer: {
    gap: 10,
  },
});

export default GasRequestForm;
