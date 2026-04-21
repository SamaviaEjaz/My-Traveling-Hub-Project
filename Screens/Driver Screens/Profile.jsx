import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriverContext } from './DriverContext';
import { BASE_URL } from '../../apiConfig';

const Profile = () => {
  const navigation = useNavigation();
  const { driverName, clearAllUserData } = useContext(DriverContext);

  const [image, setImage] = useState(require('../../assets/images/ProfilePhoto.png'));
  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [driverId, setDriverId] = useState(null);
  console.log('DRIVER NAME IN PROFILE:', driverName);

  useFocusEffect(
    React.useCallback(() => {
      if (driverName) {
        loadProfileData();
      }
    }, [driverName])
  );

  const loadProfileData = async () => {
    try {
      setLoading(true);

      await AsyncStorage.removeItem(`driverProfile_${driverName}`);

      const response = await fetch(
        `${BASE_URL}/api/drivers?name=${encodeURIComponent(driverName)}`,
        { headers: { 'ngrok-skip-browser-warning': 'true' } }
      );

      const result = await response.json();
      console.log('DB result:', result);

      if (response.ok && result.success && result.drivers?.length > 0) {

        const trimmedName = driverName?.trim();

        const driverData = result.drivers.find(
          d => d.name?.trim().toLowerCase() === trimmedName.toLowerCase()
        );

        if (!driverData) {
          console.log('Driver not found!');
          setLoading(false);
          return;
        }

        const newProfile = {
          _id: driverData._id || '',
          fullName: driverData.name || '',
          email: driverData.email || '',
          phone: driverData.phone || '',
        };

        console.log('Profile set:', newProfile);

        setProfile(newProfile);
        setDriverId(driverData._id);

        await AsyncStorage.setItem(
          `driverProfile_${driverName}`,
          JSON.stringify(newProfile)
        );
      }

    } catch (error) {
      console.log('Profile load error:', error);
    } finally {
      setLoading(false);
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
        const savedImageUri = await AsyncStorage.getItem(`profilePhoto_${driverName}`);
        if (savedImageUri) setImage({ uri: savedImageUri });
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
      setImage({ uri });
      await AsyncStorage.setItem(`profilePhoto_${driverName}`, uri);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout & Delete Account",
      "Are you sure? Your account will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: async () => {
            try {
              let idToDelete = driverId || profile._id;

              if (!idToDelete) {
                const res = await fetch(
                  `${BASE_URL}/api/drivers?name=${encodeURIComponent(driverName)}`,
                  { headers: { 'ngrok-skip-browser-warning': 'true' } }
                );

                const result = await res.json();

                if (result.success && result.drivers?.length > 0) {
                  const trimmedName = driverName?.trim();

                  const matchedDriver = result.drivers.find(
                    d => d.name?.trim().toLowerCase() === trimmedName.toLowerCase()
                  );

                  if (matchedDriver) {
                    idToDelete = matchedDriver._id;
                  }
                }
              }

              if (idToDelete) {
                const deleteRes = await fetch(
                  `${BASE_URL}/api/drivers/${idToDelete}`,
                  {
                    method: 'DELETE',
                    headers: { 'ngrok-skip-browser-warning': 'true' },
                  }
                );

                const deleteData = await deleteRes.json();
                console.log('Delete response:', deleteData);
              }

            } catch (err) {
              console.log('Error deleting driver:', err);
            }

            await clearAllUserData();
            navigation.reset({ index: 0, routes: [{ name: 'LoginPage' }] });
          }
        }
      ]
    );
  };

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
      <Text style={styles.text}>{profile.email || 'Not available'}</Text>

      <Text style={styles.label}>Phone</Text>
      <Text style={styles.text}>{profile.phone || 'Not available'}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  imageSection: { alignItems: 'center' },
  profileImage: { width: 150, height: 150, borderRadius: 85, borderWidth: 2, borderColor: '#08edf5ff' },
  heading: { fontSize: 13, textAlign: 'center', marginTop: 5 },
  label: { fontSize: 18, marginTop: 10 },
  text: { fontSize: 16, color: '#777', marginBottom: 10 },
  button: { backgroundColor: '#269ee4ff', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  logoutButton: { backgroundColor: '#d34c23ff', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
});

export default Profile;