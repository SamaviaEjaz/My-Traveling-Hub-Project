import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const navigation = useNavigation();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(require('../../assets/images/Profileimage.png'));

  useEffect(() => {
    fetchAdminData();
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera roll permissions are required to change the photo.');
      }
    })();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('adminToken');
      const storedAdminData = await AsyncStorage.getItem('adminData');
      
      if (storedAdminData) {
        setAdminData(JSON.parse(storedAdminData));
      }
      
      if (token) {
        const response = await fetch('http://10.101.99.73:5000/api/admin/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          setAdminData(data.admin);
          // Update the stored admin data
          await AsyncStorage.setItem('adminData', JSON.stringify(data.admin));
        } else {
          Alert.alert('Error', data.message || 'Failed to fetch admin data');
        }
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      Alert.alert('Error', 'Failed to fetch admin data');
    } finally {
      setLoading(false);
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
        setImage({ uri: result.assets[0].uri });
       
      }
    } catch (error) {
      console.log('Image Picker Error:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('adminToken');
              await AsyncStorage.removeItem('adminData');
              navigation.reset({
                index: 0,
                routes: [{ name: 'AdminLogin' }]
              });
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6d6fc2ff" />
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
      

      
      <Text style={styles.label}>Email</Text>
      <Text style={styles.text}>{adminData?.email || 'admin@example.com'}</Text>
      
      
      
      
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
});
export default Profile;