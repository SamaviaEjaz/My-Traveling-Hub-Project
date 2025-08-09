import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const AdminLogin = () => {
  const navigation = useNavigation();


  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = () => {
    let valid = true;



    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Email must be name@example.com');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!valid) return;

    if (fullName.trim().toLowerCase() === 'admin') {
      navigation.navigate('AdminDashboard');
    } else {
      alert('Only Admin is allowed in this demo.');
    }
    setFullName('');
    setEmail('');
    setPassword('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        keyboardType="default"
        secureTextEntry={true}
      />

      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}


      <View style={{ alignItems: 'flex-end', marginRight: 15, marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Forget')}>
          <Text style={{ color: '#210ce1c3', fontWeight: 'bold' }}>ForgetPassword</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttontext}>Submit</Text>
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
    fontSize: 40,
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
    backgroundColor: '#1215efff',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 60,
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

export default AdminLogin;