import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';


const ResetPassword = () => {
  const [newpassword, setNewPassword] = useState('');

  {
    const handleRegister = () => {
      if (!newpassword) {
        alert('Password must contain numeric,alphanumeric and specialcharacter');
        return;
      }

      console.log('NewPassword:', newpassword);

      setNewPassword('');
    };
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Reset Password</Text>

        <TextInput
          style={styles.input}
          placeholder="NewPassword"
          value={newpassword}
          onChangeText={setNewPassword}
          keyboardType="default"
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttontext}>Reset Password</Text>
        </TouchableOpacity>

      </View>

    );
  };
}
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
      backgroundColor: 'blue',
      padding: 16,
      borderRadius: 15,
      alignItems: 'center',
      marginHorizontal: 85,
      marginTop: 15,
    },
    buttontext: {
      color: 'white',
      fontSize: 15,
      fontWeight: 'bold',
    },
  });


export default ResetPassword;