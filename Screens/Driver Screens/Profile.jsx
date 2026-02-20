// Profile.js
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriverContext } from './DriverContext';

const Profile = () => {
  const navigation = useNavigation();
  const { driverName, clearAllUserData } = useContext(DriverContext);

  const [image, setImage] = useState(require('../../assets/images/ProfilePhoto.png'));
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Load profile data whenever screen comes back in focus
  useFocusEffect(
    React.useCallback(() => {
      if (driverName) {
        loadProfileData();
      }
    }, [driverName])
  );

  const loadProfileData = async () => {
    try {
      if (initialLoad) {
        setLoading(true);
      }
      
      console.log('Loading profile for driver:', driverName);
      
      // Use user-specific key for profile data
      const data = await AsyncStorage.getItem(`driverProfile_${driverName}`);
      console.log('Profile data from AsyncStorage:', data);
      
      if (data) {
        setProfile(JSON.parse(data));
        setLoading(false);
      } else {
        // If no specific profile data, try to get from server
        try {
          console.log('Fetching profile from server for:', driverName);
          const response = await fetch(`http://10.133.138.73:5000/api/drivers?name=${driverName}`);
          const result = await response.json();
          
          console.log('Server response:', result);
          
          if (response.ok && result.success && result.drivers && result.drivers.length > 0) {
            const driverData = result.drivers[0];
            const newProfile = {
              fullName: driverData.name || '',
              email: driverData.email || '',
              phone: driverData.phone || '',
            };
            
            console.log('Setting new profile:', newProfile);
            setProfile(newProfile);
            
            // Save this data to AsyncStorage for future use
            await AsyncStorage.setItem(`driverProfile_${driverName}`, JSON.stringify(newProfile));
          } else {
            console.log('No driver data found in server response');
          }
        } catch (error) {
          console.log('Error fetching profile from server:', error);
        } finally {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    } catch (error) {
      console.log('Error loading profile:', error);
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera roll permission required.');
        return;
      }

      if (driverName) {
        console.log('Loading profile image for:', driverName);
        const savedImageUri = await AsyncStorage.getItem(`profilePhoto_${driverName}`);
        if (savedImageUri) {
          console.log('Found saved image URI:', savedImageUri);
          setImage({ uri: savedImageUri });
        } else {
          console.log('No saved image found, using default');
        }
      }
    })();
  }, [driverName]);

  const handleChangePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && driverName) {
      const uri = result.assets[0].uri;
      console.log('Saving new profile image for:', driverName);
      setImage({ uri });
      await AsyncStorage.setItem(`profilePhoto_${driverName}`, uri);
    }
  };

  const handleLogout = async () => {
    await clearAllUserData();
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginPage' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#269ee4ff" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageSection}>
        <TouchableOpacity onPress={handleChangePhoto}>
          <Image source={image} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <Text style={styles.heading}>Profile Photo</Text>

      <Text style={styles.label}>Full Name</Text>
      <Text style={styles.text}>{profile.fullName || driverName || 'Not available'}</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.text}>{profile.email || 'user@example.com'}</Text>

      <Text style={styles.label}>Phone</Text>
      <Text style={styles.text}>{profile.phone || '03XXXXXXXXX'}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Driver_UpdateProfile', { profile })}
      >
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  imageSection: { alignItems: 'center' },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: '#08edf5ff',
  },
  heading: { fontSize: 13, textAlign: 'center', marginTop: 5 },
  label: { fontSize: 18, marginTop: 10 },
  text: { fontSize: 16, color: '#777', marginBottom: 10 },
  button: {
    backgroundColor: '#269ee4ff',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#d34c23ff',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555'
  }
});

export default Profile;