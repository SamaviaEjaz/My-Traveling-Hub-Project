import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriverContext } from './DriverContext';
import { BASE_URL } from '../../apiConfig';

const Driver_UpdateProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { driverName } = useContext(DriverContext);
  const { profile: initialProfile } = route.params || {};

  const [profile, setProfile] = useState({
    fullName: initialProfile?.fullName || '',
    email: initialProfile?.email || '',
    phone: initialProfile?.phone || '',
  });

  const handleUpdate = async () => {
    if (!profile.fullName || !profile.email || !profile.phone) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      await AsyncStorage.setItem(`driverProfile_${driverName}`, JSON.stringify(profile));

      try {
        const response = await fetch(`${BASE_URL}/api/drivers/${driverName}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({
            name: profile.fullName,
            email: profile.email,
            phone: profile.phone,
          }),
        });
        const data = await response.json();
        console.log('Server update response:', data);
      } catch (error) {
        console.log('Server update failed, local storage updated:', error);
      }

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Profile</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={profile.fullName}
          onChangeText={(text) => setProfile({ ...profile, fullName: text })}
          placeholder="Enter your full name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          onChangeText={(text) => setProfile({ ...profile, email: text })}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={profile.phone}
          onChangeText={(text) => setProfile({ ...profile, phone: text })}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  heading: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5, color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  button: { backgroundColor: '#269ee4ff', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default Driver_UpdateProfile;