import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <Text style={styles.welcome}>Welcome, Admin!</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DriversAuthorization')}>
        <Text style={styles.buttonText}>Verify Drivers</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('View Registered Driver')}>
        <Text style={styles.buttonText}>View Registered Drivers</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    backgroundColor: '#2f74f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#5080dbff',
    padding: 35,
    marginBottom: 15,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Home;