import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import travel3 from '../../assets/images/travel3.png';

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <Image
        source={travel3}
        style={{ width: '100%', height: 340 }}
        resizeMode="cover"
      />

      <View style={{ alignItems: 'center', padding: 25 }}>
        <Text style={{ fontFamily: 'bold', fontSize: 30, fontStyle: 'italic' }}>
          Register
        </Text>
      </View>

      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('DriverRegister')}>
          <Text style={styles.buttontext}>Driver Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PassengerRegister')} >
          <Text style={styles.buttontext}>Passenger Register</Text>
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
    marginVertical: 5,
    margin: 15,
  },
  buttontext: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Welcome;
