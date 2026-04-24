import { useNavigation } from '@react-navigation/native';
import React, { useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriverContext } from '../Driver Screens/DriverContext';
import { BASE_URL } from '../../apiConfig';

const LoginPage = () => {
  const navigation = useNavigation();
  const { saveDriverData, clearAllUserData, createUserSession } = useContext(DriverContext);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])[A-Za-z\d\S]{8,}$/.test(password);

  const handleLogin = async () => {
    let valid = true;

    if (!email) { setEmailError('Email is required'); valid = false; }
    else if (!isValidEmail(email)) { setEmailError('Email must be name@example.com'); valid = false; }
    else { setEmailError(''); }

    if (!password) { setPasswordError('Password is required'); valid = false; }
    else if (!isValidPassword(password)) {
      setPasswordError('Password must be at least 8 characters, include uppercase, lowercase, number, and special character');
      valid = false;
    }
    else { setPasswordError(''); }

    if (!valid) return;

    try {
      const response = await fetch(`${BASE_URL}/api/drivers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (response.ok && data.success) {

        if (data.driver.status !== 'approved') {
          Alert.alert('Account Pending Approval', 'Your account is pending approval.', [{ text: 'OK' }]);
          return;
        }

        await clearAllUserData();

        const allKeys = await AsyncStorage.getAllKeys();
        const profileKeys = allKeys.filter(key => key.startsWith('driverProfile_'));
        if (profileKeys.length > 0) {
          await AsyncStorage.multiRemove(profileKeys);
          console.log('Purani profile cache delete hui:', profileKeys);
        }

        await saveDriverData(data.driver);

        const profileData = {
          _id: data.driver._id || '',
          fullName: data.driver.name || '',
          email: data.driver.email || '',
          phone: data.driver.phone || '',   
        };
        await AsyncStorage.setItem(`driverProfile_${data.driver.name}`, JSON.stringify(profileData));
        console.log('Naya profile saved:', profileData);

        await createUserSession(data.driver.name);

        navigation.navigate('Driver_Dashboard', {
          driverName: data.driver.name,
          newSession: true,
        });

      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Error connecting to server: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Driver Login</Text>

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
          {!showPassword
            ? <Entypo name="eye" size={24} color="gray" />
            : <Entypo name="eye-with-line" size={24} color="gray" />
          }
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      <View style={{ alignItems: 'flex-end', marginRight: 15, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Forget')}>
          <Text style={{ color: '#210ce1c3', fontWeight: 'bold' }}>ForgetPassword</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttontext}>Submit</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
        <Text>No account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: '#0d09fca3', fontWeight: 'bold' }}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', paddingHorizontal: 10, backgroundColor: '#f0f0f0', flex: 1, paddingBottom: 90 },
  heading: { fontSize: 26, fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: 40, marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderColor: '#ccc', borderWidth: 2, borderRadius: 3, margin: 7, backgroundColor: '#FFF', paddingHorizontal: 10 },
  icon: { width: 30, height: 30, marginRight: 8 },
  input: { flex: 1, height: 50, fontSize: 16, color: '#333' },
  button: { backgroundColor: '#6d6fc2ff', padding: 16, borderRadius: 15, alignItems: 'center', marginHorizontal: 60, marginTop: 15 },
  buttontext: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  error: { color: 'red', marginLeft: 20, marginBottom: 5 },
  eyeIcon: { padding: 5 },
});

export default LoginPage;