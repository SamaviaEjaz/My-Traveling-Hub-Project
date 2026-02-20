import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const Driver_OTP = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phone, driverId } = route.params || {};

  const inputs = Array.from({ length: 6 }, () => useRef());
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [count, setCount] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [testOTP, setTestOTP] = useState(null); // For testing only

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
      console.log("Verifying OTP for phone:", phone);
      const res = await axios.post(
        "http://10.64.5.73:5000/api/drivers/verify-otp",
        { phone, otp: enteredOtp }
      );

      console.log("OTP verification response:", res.data);
      Alert.alert("✅ Verified", res.data.message, [
      ]);
    } catch (err) {
      console.error("OTP verification error:", err);
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
      console.log("Resending OTP to:", phone);
      const response = await axios.post(
        "http://10.64.5.73:5000/api/drivers/send-otp",
        { phone }
      );
      
      console.log("Resend OTP response:", response.data);
      
      // For testing only - show the OTP if it's included in the response
      if (response.data.otp) {
        setTestOTP(response.data.otp);
        Alert.alert(
          "OTP Sent", 
          `New OTP sent to your phone. For testing: ${response.data.otp}`
        );
      } else {
        Alert.alert("OTP Sent", "New OTP sent to your phone");
      }
      // Driver_OTP component mein OTP verification ke baad
const handleOTPVerification = async () => {
  try {
    // OTP verification logic...
    const response = await fetch('http://10.64.5.73:5000/api/drivers/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phone, otp: otp })
    });
    
    const data = await response.json();
    
    if (data.success) {
      Alert.alert(
        "Success",
        "Your registration has been submitted for approval. You will be notified once approved.",
        [
          { 
            text: "OK", 
            onPress: () => {
              // Yahan DriversAuthorization par navigate karein
              navigation.navigate('DriversAuthorization', { driverId: data.driverId });
            }
          }
        ]
      );
    } else {
      Alert.alert("Error", data.message || "Invalid OTP");
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    Alert.alert("Error", "Network error occurred");
  }
};
      
      setCount(60);
    } catch (error) {
      console.error("Resend OTP error:", error);
      
      // For testing only - show the OTP if it's included in the error response
      if (error.response?.data?.otp) {
        setTestOTP(error.response.data.otp);
        Alert.alert(
          "OTP Generated", 
          `Failed to send SMS, but OTP is generated for testing: ${error.response.data.otp}`
        );
      } else {
        Alert.alert("Error", "Failed to resend OTP. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>Code sent to {phone}</Text>

      {/* For testing only - show the OTP if available */}
      {testOTP && (
        <View style={styles.testOtpContainer}>
          <Text style={styles.testOtpText}>For Testing Only: {testOTP}</Text>
        </View>
      )}

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

      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={otpValidate}
        disabled={isLoading}
      >
        <Text style={styles.btnText}>
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleResend} 
        disabled={count > 0 || isResending}
        style={styles.resendContainer}
      >
        <Text style={[styles.resend, (count > 0 || isResending) && styles.disabledText]}>
          Resend OTP {count > 0 && `(${count}s)`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Driver_OTP;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f2f2f2' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginTop: 80 },
  subtitle: { textAlign: 'center', marginVertical: 10 },
  testOtpContainer: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center'
  },
  testOtpText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32'
  },
  OTPView: { flexDirection: 'row', justifyContent: 'center', marginVertical: 30 },
  input: {
    width: 45,
    height: 45,
    borderWidth: 1,
    margin: 5,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#2400ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#a0a0a0'
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  resendContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  resend: { 
    textAlign: 'center', 
    color: '#2400ee',
    fontWeight: '500'
  },
  disabledText: {
    color: '#a0a0a0'
  }
});