import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Forget = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSendOTP = async () => {
    // Validate email
    if (!email.trim()) {
      setEmailError('Please enter your email');
      return;
    }
    
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    
    setEmailError('');
    setIsLoading(true);
    
    try {
      const response = await axios.post("http://10.190.119.73:5000/api/send-otp", { 
        email: email.trim() 
      });
      
      if (response.data.success) {
        Alert.alert('Success', 'OTP sent to your email', [
          { text: 'OK', onPress: () => navigation.navigate('OTP', { email: email.trim() }) }
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP Error:', error.response?.data || error.message);
      
      // Handle specific error cases
      if (error.response?.status === 500) {
        Alert.alert('Error', 
          error.response?.data?.error || 'Email service error. Please try again later.'
        );
      } else if (error.response?.status === 404) {
        Alert.alert('Error', 'API endpoint not found. Please check your server configuration.');
      } else {
        Alert.alert('Error', 
          error.response?.data?.message || 'Network error. Please check your connection and try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot Password</Text>
      <Text style={styles.subheading}>Enter your email to receive a verification code</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleSendOTP}
        disabled={isLoading}
      >
        <Text style={styles.buttontext}>
          {isLoading ? 'Sending...' : 'Send OTP'}
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

export default Forget;