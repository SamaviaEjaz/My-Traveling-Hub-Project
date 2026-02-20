// ResetPassword.js
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    let valid = true;
    
    // Reset errors
    setPasswordError('');
    setConfirmError('');
    
    // Validate password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;
    if (!newPassword) {
      setPasswordError('Password is required');
      valid = false;
    } else if (!passwordRegex.test(newPassword)) {
      setPasswordError('Password must be at least 6 characters, include a number and a special character');
      valid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      setConfirmError('Please confirm your password');
      valid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmError('Passwords do not match');
      valid = false;
    }
    
    if (!valid) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post("http://10.186.73.73:5000/api/reset-password", {
        email,
        password: newPassword
      });

      if (response.data.success) {
        Alert.alert('Success', 'Password reset successfully!');
        navigation.navigate('Login'); // Assuming you have a Login screen
      } else {
        Alert.alert('Error', response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset Password Error:', error.response?.data || error.message);
      Alert.alert('Error', 
        error.response?.status === 404 
          ? 'API endpoint not found' 
          : 'Network error. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reset Password</Text>
      <Text style={styles.subheading}>Create a new password for your account</Text>
      
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        editable={!isLoading}
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!isLoading}
      />
      {confirmError ? <Text style={styles.error}>{confirmError}</Text> : null}
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleReset}
        disabled={isLoading}
      >
        <Text style={styles.buttontext}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2400ee',
  },
  subheading: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2,
    marginBottom: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#FFF',
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#2400ee',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 60,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#949494',
  },
  buttontext: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginLeft: 20,
    marginBottom: 10,
  },
});

export default ResetPassword;