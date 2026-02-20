// Home.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { DriverContext } from './DriverContext';

const Home = ({ route }) => {
  const navigation = useNavigation();
  const { driverName, userSessionId } = useContext(DriverContext);
  const [currentDriverName, setCurrentDriverName] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');

  useEffect(() => {
    // Update local state when props change
    if (route.params?.driverName && route.params?.driverName !== currentDriverName) {
      setCurrentDriverName(route.params.driverName);
      console.log("Home: Driver name updated to:", route.params.driverName);
    }
    
    if (route.params?.key && route.params?.key !== currentSessionId) {
      setCurrentSessionId(route.params?.key);
      console.log("Home: Session ID updated to:", route.params?.key);
    }
  }, [route.params, currentDriverName, currentSessionId]);

  // Use context values as fallback
  const displayName = currentDriverName || driverName || "Driver";
  const displaySessionId = currentSessionId || userSessionId || '';

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {displayName}!</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Share Post', { 
          driverName: displayName, 
          sessionId: displaySessionId 
        })}>
        <Text style={styles.buttontext}>Share Post</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ViewSharedPost', { 
          driverName: displayName, 
          sessionId: displaySessionId 
        })}>
        <Text style={styles.buttontext}>View Shared Post</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Receive Request', { 
          driverName: displayName, 
          sessionId: displaySessionId 
        })}>
        <Text style={styles.buttontext}>Receive Requests</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // full screen
    justifyContent: 'center', // center vertically
    paddingHorizontal: 5,
    backgroundColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#2976e9a3',
    padding: 50,
    borderRadius: 15,
    alignItems: 'center',
    margin: 15,
    marginVertical: 5,
  },
  buttontext: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Home;