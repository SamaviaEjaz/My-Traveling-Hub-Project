import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const Driver_UpdateProfile = () => {
  const navigation = useNavigation();


  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

    if (!isValidPhone(phone)) {
      setPhoneError('Phone number must start with 03 and be 11 digits');
      valid = false;
    } else {
      setPhoneError('');
    }


    if (!valid) return;

    setFullName('');
    setEmail('');
    setPhone('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
      />
      {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttontext}>Update</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 50,
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
  button: {
    backgroundColor: '#1f98cfff',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 15,
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

export default Driver_UpdateProfile;