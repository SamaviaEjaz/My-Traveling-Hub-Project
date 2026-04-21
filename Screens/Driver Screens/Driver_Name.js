import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const Driver_Dashboard = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { driverName } = route.params || {}; // Get driverName from login

  useEffect(() => {
    console.log('Driver_Dashboard mounted with driverName:', driverName);
    
    if (!driverName) {
      Alert.alert(
        'Error',
        'Driver information not found. Please login again.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('LoginPage'),
          },
        ]
      );
    }
  }, [driverName, navigation]);

  const handleSharePost = () => {
    console.log('Navigating to SharePost with driverName:', driverName);
    
    navigation.navigate('SharePost', { driverName });
  };

  const handleViewRides = () => {
    navigation.navigate('ViewSharedPost', { driverName });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/Profileimage.png')}
          style={styles.profileImage}
        />
        <Text style={styles.welcomeText}>Welcome, {driverName || 'Driver'}!</Text>
      </View>
      
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleSharePost}>
          <Image source={require('../../assets/images/Profileimage.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>Share a Ride</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleViewRides}>
          <Image source={require('../../assets/images/Profileimage.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>My Rides</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Image source={require('../../assets/images/Profileimage.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  menuText: {
    fontSize: 18,
    color: '#333',
  },
});

export default Driver_Dashboard;