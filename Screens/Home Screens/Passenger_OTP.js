import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../../apiConfig';


const Passenger_OTP = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phone } = route.params || {};

  const inputs = Array.from({ length: 6 }, () => useRef());
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [count, setCount] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    inputs[0].current?.focus();
    const timer = setInterval(() => {
      setCount(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index, value) => {
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) inputs[index + 1].current.focus();
    if (!value && index > 0) inputs[index - 1].current.focus();
  };

  const otpValidate = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      Alert.alert('Error', 'Enter complete OTP');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/passengers/verify-otp`, { phone, otp: enteredOtp });
      Alert.alert("✅ Verified", res.data.message, [
        { text: "OK", onPress: () => navigation.navigate('Passenger_Dashboard') }
      ]);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid OTP";
      Alert.alert("Error", errorMessage);
      setOtp(['', '', '', '', '', '']);
      inputs[0].current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (count > 0 || isResending) return;
    setIsResending(true);
    try {
      await axios.post(`${BASE_URL}/api/passengers/send-otp`, { phone });
      
      Alert.alert("OTP Sent", `New OTP sent to your phone number ${phone}.`);
      setCount(60);
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>Code sent to {phone}</Text>

      <View style={styles.OTPView}>
        {otp.map((v, i) => (
          <TextInput
            key={i}
            ref={inputs[i]}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            value={v}
            onChangeText={val => handleOtpChange(i, val)}
          />
        ))}
      </View>

      <TouchableOpacity style={[styles.button, isLoading && styles.disabledButton]} onPress={otpValidate} disabled={isLoading}>
        <Text style={styles.btnText}>{isLoading ? 'Verifying...' : 'Verify OTP'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResend} disabled={count > 0 || isResending} style={styles.resendContainer}>
        <Text style={[styles.resend, (count > 0 || isResending) && styles.disabledText]}>
          Resend OTP {count > 0 && `(${count}s)`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f2f2' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginTop: 80 },
  subtitle: { textAlign: 'center', marginVertical: 10 },
  OTPView: { flexDirection: 'row', justifyContent: 'center', marginVertical: 30 },
  input: { width: 45, height: 45, borderWidth: 1, margin: 5, textAlign: 'center', fontSize: 18, borderRadius: 8, backgroundColor: '#fff' },
  button: { backgroundColor: '#2400ee', padding: 15, borderRadius: 10, alignItems: 'center' },
  disabledButton: { backgroundColor: '#a0a0a0' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  resendContainer: { marginTop: 20, alignItems: 'center' },
  resend: { textAlign: 'center', color: '#2400ee', fontWeight: '500' },
  disabledText: { color: '#a0a0a0' }
});

export default Passenger_OTP;