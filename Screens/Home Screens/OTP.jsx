import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const OTP = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};
  
  const et1 = useRef();
  const et2 = useRef();
  const et3 = useRef();
  const et4 = useRef();
  const et5 = useRef();
  const et6 = useRef();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [count, setCount] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Focus first input when component mounts
    if (et1.current) {
      et1.current.focus();
    }
    
    const interval = setInterval(() => {
      if (count > 0) {
        setCount(count - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [count]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      switch(index) {
        case 0: et2.current.focus(); break;
        case 1: et3.current.focus(); break;
        case 2: et4.current.focus(); break;
        case 3: et5.current.focus(); break;
        case 4: et6.current.focus(); break;
      }
    }
    
    // Auto focus previous input on delete
    if (!value && index > 0) {
      switch(index) {
        case 1: et1.current.focus(); break;
        case 2: et2.current.focus(); break;
        case 3: et3.current.focus(); break;
        case 4: et4.current.focus(); break;
        case 5: et5.current.focus(); break;
      }
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
      const response = await axios.post("http://10.26.42.73.73:5000/api/verify-otp", {
        email,
        otp: enteredOtp
      });
      
      if (response.data.success) {
        Alert.alert('Success', 'OTP Verified', [
          { text: 'OK', onPress: () => navigation.navigate('ResetPassword', { email }) }
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Invalid OTP');
        // Reset OTP fields
        setOtp(['', '', '', '', '', '']);
        if (et1.current) et1.current.focus();
      }
    } catch (error) {
      console.error('Verify OTP Error:', error.response?.data || error.message);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        Alert.alert('Error', error.response?.data?.message || 'Invalid OTP');
      } else if (error.response?.status === 404) {
        Alert.alert('Error', 'API endpoint not found. Please check your server configuration.');
      } else {
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
      }
      
      // Reset OTP fields on error
      setOtp(['', '', '', '', '', '']);
      if (et1.current) et1.current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (count > 0) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post("http://10.26.42.73.73:5000/api/send-otp", {
        email
      });
      
      if (response.data.success) {
        Alert.alert('Success', 'OTP resent to your email');
        setCount(60);
        setOtp(['', '', '', '', '', '']);
        if (et1.current) et1.current.focus();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error.response?.data || error.message);
      
      // Handle specific error cases
      if (error.response?.status === 500) {
        Alert.alert('Error', 
          error.response?.data?.error || 'Email service error. Please try again later.'
        );
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
        {[et1, et2, et3, et4, et5, et6].map((ref, index) => (
          <TextInput
            key={index}
            ref={ref}
            style={[
              styles.inputView, 
              { borderColor: otp[index] ? '#2400ee' : '#ccc' }
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[index]}
            onChangeText={(value) => handleOtpChange(index, value)}
            editable={!isLoading}
            selectTextOnFocus={true}
          />
        ))}
      </View>
      
      <View style={styles.ResendView}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <TouchableOpacity onPress={handleResend} disabled={count > 0 || isLoading}>
          <Text style={[
            styles.resendLink, 
            (count > 0 || isLoading) && styles.disabledLink
          ]}>
            Resend {count > 0 && `(${count}s)`}
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={[
          styles.verifyOTPBtn,
          { backgroundColor: isOtpComplete ? '#2400ee' : '#949494' }
        ]}
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
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f0f0f0'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 80,
    alignSelf: 'center',
    color: '#2400ee',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    alignSelf: 'center',
    color: '#666',
    marginBottom: 40,
  },
  OTPView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },
  inputView: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    margin: 5,
    backgroundColor: '#fff',
  },
  verifyOTPBtn: {
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 40,
  },
  buttontext: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ResendView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 16,
    color: '#666',
  },
  resendLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2400ee',
    marginLeft: 5,
  },
  disabledLink: {
    color: '#949494',
  },
});
  
export default OTP;