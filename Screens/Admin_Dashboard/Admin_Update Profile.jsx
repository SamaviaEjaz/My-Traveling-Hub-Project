import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const UpdateProfile = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Email must be example@example.com');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    try {
      const response = await fetch("http://YOUR-IP:5000/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg("Profile updated successfully!");
        setEmail('');
        setPassword('');
      } else {
        setSuccessMsg(data.message || "Update failed!");
      }
    } catch (error) {
      console.error("Update Error:", error);
      setSuccessMsg("Server error. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Update Profile</Text>

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
          {!showPassword ? (
            <Entypo name="eye" size={24} color="gray" />
          ) : (
            <Entypo name="eye-with-line" size={24} color="gray" />
          )}
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

      <View style={{ alignItems: 'flex-end', marginRight: 15, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Forget')}>
          <Text style={{ color: '#210ce1c3', fontWeight: 'bold' }}>ForgetPassword</Text>
        </TouchableOpacity>
      </View>

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
    flex: 1,
    paddingBottom: 90,
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
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
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
  success: {
    color: 'green',
    marginLeft: 20,
    marginBottom: 5,
  },
  eyeIcon: {
    padding: 5,
  },
});

export default UpdateProfile;
