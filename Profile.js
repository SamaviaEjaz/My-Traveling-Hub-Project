import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Profile = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(require('../../assets/images/Profileimage.png'));

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera roll permissions are required to change the photo.');
      }
    })();
  }, []);

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

  return (
    <View style={styles.container}>
      <View style={styles.imageSection}>
        <TouchableOpacity onPress={handleChangePhoto}>
          <Image source={image} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

     <Text style={styles.heading}>Profile Photo</Text>

      <Text style={styles.label}>Full Name</Text>
      <Text style={styles.text}>UserName</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.text}>User@example.com</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Admin_UpdateProfile')}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton}>
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
});

export default Profile;