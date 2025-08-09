import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import travel3 from '../../assets/images/travel3.png';

const WelCome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
    
        <Image
          source={travel3}
          style={{ width: '100%', height: 260 }}
          resizeMode="cover"/>

      <View style={{ alignItems: 'center', padding: 15 }}>
        <Text style={{ fontFamily: 'bold', fontSize: 30, fontStyle: 'italic' }}>
          WELCOME
        </Text>
      </View>

      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AdminLogin')}
        >
          <Text style={styles.buttontext}>Admin Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginPage')}>
          <Text style={styles.buttontext}>Driver Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginPage')}>
          <Text style={styles.buttontext}>Passenger Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Register')} >
          <Text style={styles.buttontext}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#3C29E9A3',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    margin: 15,
    marginVertical: 5,
  },
  buttontext: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default WelCome;