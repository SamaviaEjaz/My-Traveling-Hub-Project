import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const DriverRegister = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');



  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return passwordRegex.test(password);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^03[0-9]{9}$/;
    return phoneRegex.test(phone);
  };


  const handleRegister = () => {
    let valid = true;

    if (!fullName) {
      setFullNameError('Full name is required');
      valid = false;
    } else {
      setFullNameError('');
    }

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Email must be example@.com');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (!isValidPassword(password)) {
      setPasswordError('Password must be at least 8 characters, include uppercase, lowercase, number, and special character');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmpassword) {
      setConfirmPasswordError('Confirm Password is required');
      valid = false;
    } else if (password !== confirmpassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (!isValidPhone(phone)) {
      setPhoneError('Phone number must start with 03 and be 11 digits');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (!valid) return;

    console.log('FullName:', fullName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('ConfirmPassword:', confirmpassword);
    console.log('Phone:', phone);

    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhone('');

    navigation.navigate('UploadImages');

  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Passenger Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        {fullNameError ? <Text style={styles.error}>{fullNameError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmpassword}
          onChangeText={setConfirmPassword}
          keyboardType="default"
          secureTextEntry={true}
        />
        {confirmPasswordError ? <Text style={styles.error}>{confirmPasswordError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
        />
        {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}


        <TouchableOpacity style={styles.uploadbutton} onPress={handleRegister}>
          <Text style={styles.buttontext}>Upload Image</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: '10' }}>
          <Text>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginPage')}>
            <Text style={{ color: '#0d09fca3', fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 5,
    backgroundColor: '#f0f0f0',
    paddingBottom: 130,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 30,
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 2,
    marginBottom: 5,
    paddingHorizontal: 15,
    borderRadius: 3,
    backgroundColor: '#FFF',
    fontSize: 16,
    color: '#333',
    margin: 15,
  },
  uploadbutton: {
    backgroundColor: '#a39cacff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 17,
    marginTop: 15,
  },
  buttontext: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

  error: {
    color: 'red',
    marginLeft: 20,
    marginBottom: 5,
  },
});

export default DriverRegister;