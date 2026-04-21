import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../apiConfig';

const Profile = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(require('../../assets/images/Profileimage.png'));
  const [passengerData, setPassengerData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera roll permissions are required to change the photo.');
      }
    })();
    
    loadPassengerData();
    
    loadSavedImage();
  }, []);

  const loadPassengerData = async () => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem('passengerData');
      if (data) {
        setPassengerData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading passenger data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('passengerImage');
      if (savedImage) {
        setImage({ uri: savedImage });
      }
    } catch (error) {
      console.error('Error loading saved image:', error);
    }
  };

  const handleChangePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        const newImageUri = result.assets[0].uri;
        setImage({ uri: newImageUri });
        
        await AsyncStorage.setItem('passengerImage', newImageUri);
      }
    } catch (error) {
      console.log('Image Picker Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('passengerData');
      await AsyncStorage.removeItem('passengerToken');
      await AsyncStorage.removeItem('passengerImage');
      
      setImage(require('../../assets/images/Profileimage.png'));
      
      setPassengerData({
        fullName: '',
        email: '',
        phone: '',
      });
      
      navigation.navigate('WelCome');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'Failed to logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
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
      <Text style={styles.text}>{passengerData.fullName || 'Not available'}</Text>
      
      <Text style={styles.label}>Email</Text>
      <Text style={styles.text}>{passengerData.email || 'Not available'}</Text>
      
      <Text style={styles.label}>Phone Number</Text>
      <Text style={styles.text}>{passengerData.phone || 'Not available'}</Text>
      
      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Passenger_UpdateProfile')}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity> */}
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    paddingTop: 30,
  },
  imageSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: '#08edf5ff',
    resizeMode: 'cover',
  },
  heading: {
    fontSize: 13,
    marginTop: 5,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#000',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#777',
    marginBottom: 10,
  },
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Profile;