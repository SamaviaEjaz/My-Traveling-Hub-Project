import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const SERVER_URL = "http://10.101.99.73:5000/api";

const PassengerGiveComplaint = () => {
  const navigation = useNavigation();
  const [driverName, setDriverName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!driverName || !message) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${SERVER_URL}/complaints`, { driverName, message });
      Alert.alert("Success", "Complaint submitted!");
      setDriverName('');
      setMessage('');
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Submit Complaint</Text>

      <View style={[styles.inputContainer, { height: 45 }]}>
        <TextInput
          style={styles.input}
          placeholder="Driver Name"
          value={driverName}
          onChangeText={setDriverName}
        />
      </View>

      <View style={[styles.inputContainer, { height: 100 }]}>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Write your complaint"
          value={message}
          onChangeText={setMessage}
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttontext}>{loading ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center'
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333'
  },
  inputContainer: {
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333'
  },
  button: {
    backgroundColor: '#1215efff',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10
  },
  disabledButton: {
    backgroundColor: '#999'
  },
  buttontext: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default PassengerGiveComplaint;
