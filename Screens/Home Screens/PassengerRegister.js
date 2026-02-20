import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';

const PassengerRegister = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(password);
  const isValidPhone = (phone) => /^03[0-9]{9}$/.test(phone);

  const handleRegister = async () => {
    setFullNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setPhoneError('');
    let valid = true;

    if (!fullName) { setFullNameError('Full name is required'); valid = false; }
    if (!email) { setEmailError('Email is required'); valid = false; } 
    else if (!isValidEmail(email)) { setEmailError('Please enter a valid email'); valid = false; }
    if (!password) { setPasswordError('Password is required'); valid = false; } 
    else if (!isValidPassword(password)) { setPasswordError('Password must be at least 8 characters, include uppercase, lowercase, number, and special character'); valid = false; }
    if (!confirmpassword) { setConfirmPasswordError('Confirm Password is required'); valid = false; } 
    else if (password !== confirmpassword) { setConfirmPasswordError('Passwords do not match'); valid = false; }
    if (!isValidPhone(phone)) { setPhoneError('Phone number must start with 03 and be 11 digits'); valid = false; }
    if (!valid) return;

    setLoading(true);
    try {
      const response = await fetch('http://10.133.138.73:5000/api/passengers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, phone }),
      });
      const data = await response.json();

      if (response.ok) {
        // 存储乘客信息，但先不导航到仪表板
        await AsyncStorage.setItem('passengerData', JSON.stringify({ fullName, email, phone }));

        Alert.alert(
          'Registration Successful',
          'Your account has been created! Please verify your phone number.',
          [{ text: 'OK', onPress: () => navigation.navigate('Passenger_OTP', { phone }) }]
        );

        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
      } else {
        if (data.errors) {
          data.errors.forEach(error => {
            switch (error.param) {
              case 'fullName': setFullNameError(error.msg); break;
              case 'email': setEmailError(error.msg); break;
              case 'password': setPasswordError(error.msg); break;
              case 'phone': setPhoneError(error.msg); break;
              default: Alert.alert('Error', error.msg);
            }
          });
        } else {
          Alert.alert('Registration Failed', data.message || 'Something went wrong');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Network Error', 'Please check your connection and try again');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Passenger Register</Text>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Image source={require('../../assets/images/FullNamelogo.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        {fullNameError ? <Text style={styles.error}>{fullNameError}</Text> : null}

        {/* Email */}
        <View style={styles.inputContainer}>
          <Image source={require('../../assets/images/emaillogo.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        {/* Password */}
        <View style={styles.inputContainer}>
          <Image source={require('../../assets/images/Passwordlogo.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            {!showPassword ? (
              <Entypo name="eye" size={22} color="gray" />
            ) : (
              <Entypo name="eye-with-line" size={22} color="gray" />
            )}
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Image source={require('../../assets/images/Passwordlogo.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmpassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            {!showConfirmPassword ? (
              <Entypo name="eye" size={22} color="gray" />
            ) : (
              <Entypo name="eye-with-line" size={22} color="gray" />
            )}
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? <Text style={styles.error}>{confirmPasswordError}</Text> : null}

        {/* Phone */}
        <View style={styles.inputContainer}>
          <Image source={require('../../assets/images/PhoneLogo.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
          />
        </View>
        {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}

        <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttontext}>{loading ? 'Registering...' : 'Register'}</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
            <Text style={{ color: '#0d09fca3', fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', paddingHorizontal: 5, backgroundColor: '#f0f0f0', paddingBottom: 130 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', marginTop: 30 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 3,
    margin: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
  },
  icon: { width: 30, height: 30, marginRight: 8 },
  input: { flex: 1, height: 50, fontSize: 16, color: '#333' },
  eyeIcon: { padding: 5 },
  button: { backgroundColor: '#290cffff', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 15, marginHorizontal: 50 },
  disabledButton: { backgroundColor: '#cccccc' },
  buttontext: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  error: { color: 'red', marginLeft: 20, marginBottom: 5 },
});

export default PassengerRegister;