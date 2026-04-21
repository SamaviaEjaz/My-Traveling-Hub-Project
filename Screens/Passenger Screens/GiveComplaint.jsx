import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../../apiConfig';

const SERVER_URL = `${BASE_URL}/api`;

const PassengerGiveComplaint = () => {
  const navigation = useNavigation();
  const [driverName, setDriverName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [approvedDrivers, setApprovedDrivers] = useState([]);
  const [fetchingDrivers, setFetchingDrivers] = useState(true);

  useEffect(() => {
    fetchApprovedDrivers();
  }, []);

  const fetchApprovedDrivers = async () => {
    setFetchingDrivers(true);
    try {

      console.log("Fetching drivers from:", `${SERVER_URL}/drivers`);
      const response = await axios.get(`${SERVER_URL}/drivers`);
      console.log("Drivers response:", response.data);
      
      if (response.data && response.data.success) {
        // Filter only approved drivers
        const approved = response.data.drivers.filter(driver => driver.status === 'approved');
        console.log("Approved drivers:", approved);
        setApprovedDrivers(approved);
      } else {
        console.log("No success flag in response");
        Alert.alert("Error", "Failed to fetch driver data");
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      Alert.alert("Error", "Failed to fetch driver data. Please check your connection.");
    } finally {
      setFetchingDrivers(false);
    }
  };

  const handleSubmit = async () => {
    if (!driverName || !message) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const driverExists = approvedDrivers.some(
      driver => {
        const driverFullName = (driver.name || driver.fullName || "").toLowerCase();
        const inputName = driverName.toLowerCase();
        return driverFullName === inputName;
      }
    );

    console.log("Checking if driver exists:", driverName, "Found:", driverExists);

    if (!driverExists) {
      Alert.alert("Error", "Driver name does not exist or is not an approved driver");
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting complaint for:", driverName);
      const response = await axios.post(`${SERVER_URL}/complaints`, { driverName, message });
      console.log("Complaint response:", response.data);
      
      Alert.alert("Success", "Complaint submitted!");
      setDriverName('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert("Error", error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Submit Complaint</Text>

      {fetchingDrivers ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1215efff" />
          <Text style={styles.loadingText}>Loading approved drivers...</Text>
        </View>
      ) : (
        <>
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
        </>
      )}
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
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16
  }
});

export default PassengerGiveComplaint;