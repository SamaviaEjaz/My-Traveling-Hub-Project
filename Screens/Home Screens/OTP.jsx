import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../../apiConfig';

const OTP = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};

  const refs = [
    useRef(), useRef(), useRef(), useRef(), useRef(), useRef()
  ];

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [count, setCount] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (refs[0].current) refs[0].current.focus();
  }, []);

  useEffect(() => {
    if (count <= 0) return;
    const interval = setInterval(() => {
      setCount(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  // ✅ Sirf value enter hone pe handle karo
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return; // sirf numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Aage jao sirf jab digit enter ho
    if (value && index < 5) {
      refs[index + 1].current.focus();
    }
  };

  // ✅ Backspace alag handle karo
  const handleKeyPress = (index, key) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      refs[index - 1].current.focus();
    }
  };

  const otpValidate = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 6) {
      Alert.alert('Error', 'Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/verify-otp`, {
        email,
        otp: enteredOtp
      });

      if (response.data.success) {
        Alert.alert('Success', 'OTP Verified', [
          { text: 'OK', onPress: () => navigation.navigate('Reset Password', { email }) }
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        if (refs[0].current) refs[0].current.focus();
      }
    } catch (error) {
      console.error('Verify OTP Error:', error.response?.data || error.message);

      if (error.response?.status === 400) {
        Alert.alert('Error', error.response?.data?.message || 'Invalid OTP');
      } else if (error.response?.status === 404) {
        Alert.alert('Error', 'API endpoint not found. Please check your server configuration.');
      } else {
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
      }

      setOtp(['', '', '', '', '', '']);
      if (refs[0].current) refs[0].current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (count > 0) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/send-otp`, { email });

      if (response.data.success) {
        Alert.alert('Success', 'OTP resent to your email');
        setCount(60);
        setOtp(['', '', '', '', '', '']);
        if (refs[0].current) refs[0].current.focus();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      if (error.response?.status === 500) {
        Alert.alert('Error', error.response?.data?.error || 'Email service error. Please try again later.');
      } else {
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>We've sent a code to {email}</Text>

      <View style={styles.OTPView}>
        {refs.map((ref, index) => (
          <TextInput
            key={index}
            ref={ref}
            style={[styles.inputView, { borderColor: otp[index] ? '#2400ee' : '#ccc' }]}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[index]}
            onChangeText={(value) => handleOtpChange(index, value)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)} // ✅ Fix
            editable={!isLoading}
            selectTextOnFocus={true}
          />
        ))}
      </View>

      <View style={styles.ResendView}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <TouchableOpacity onPress={handleResend} disabled={count > 0 || isLoading}>
          <Text style={[styles.resendLink, (count > 0 || isLoading) && styles.disabledLink]}>
            Resend {count > 0 && `(${count}s)`}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.verifyOTPBtn, { backgroundColor: isOtpComplete ? '#2400ee' : '#949494' }]}
        onPress={otpValidate}
        disabled={!isOtpComplete || isLoading}
      >
        <Text style={styles.buttontext}>
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 80, alignSelf: 'center', color: '#2400ee', marginBottom: 10 },
  subtitle: { fontSize: 16, alignSelf: 'center', color: '#666', marginBottom: 40 },
  OTPView: { justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: 30 },
  inputView: { width: 45, height: 45, borderWidth: 1, borderRadius: 10, textAlign: 'center', fontSize: 18, fontWeight: '700', margin: 5, backgroundColor: '#fff' },
  verifyOTPBtn: { padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 40 },
  buttontext: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  ResendView: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  resendText: { fontSize: 16, color: '#666' },
  resendLink: { fontSize: 16, fontWeight: 'bold', color: '#2400ee', marginLeft: 5 },
  disabledLink: { color: '#949494' },
});

export default OTP;