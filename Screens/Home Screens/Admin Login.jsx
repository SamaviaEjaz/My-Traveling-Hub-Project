import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, showPassword } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const AdminLogin = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    console.log("toggle");
  }

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(password);

  const handleRegister = async () => {
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

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (!isValidPassword(password)) {
      setPasswordError(
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character'
      );
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    try {
      const response = await fetch('http://10.0.2.2:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        navigation.navigate('AdminDashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Error connecting to server: ' + error.message);
    }

    setFullName('');
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>Admin Login</Text>

      <View style={styles.inputContainer}>
        <Image source={require('../../assets/images/FullNamelogo.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

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
          {showPassword ? (
            <Entypo name="eye" size={20} color="black" />
          ) : (
            <Entypo name="eye-with-line" size={20} color="black" />
          )}
        </TouchableOpacity>
      </View>

      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      <View style={{ alignItems: 'flex-end', marginRight: 15, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Forget')}>
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
    flex: 1,
    paddingBottom: 90,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 3,
    margin: 7,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
  },
  icon: {
    width: 30,
    height: 20,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#6d6fc2ff',
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
  eyeIcon: {
    padding: 5,
  }
});

export default AdminLogin;
