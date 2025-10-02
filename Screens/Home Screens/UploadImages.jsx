import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const UploadImages = () => {

  const [personalImage, setPersonalImage] = useState(null);
  const [cnicFront, setCnicFront] = useState(null);
  const [cnicBack, setCnicBack] = useState(null);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);

  const captureImage = async (setter) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const renderImage = (label, imageUri, onPress) => (
    <View style={styles.imageContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.overlayWrapper} onPress={onPress}>
        <Image
          source={require('../../assets/images/imageupload.png')}
          style={styles.icon}
        />
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.overlayedImage}
          />
        )}
      </TouchableOpacity>
      {imageUri && <Text style={styles.doneText}>✔ Done</Text>}
    </View>
  );

  return (

    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Upload Images</Text>

        <View style={styles.imagerow}>
          {renderImage('Personal Image', personalImage, () => captureImage(setPersonalImage))}
          {renderImage('Vehicle image', vehicleImage, () => captureImage(setVehicleImage))}
        </View>

        <View style={styles.imagerow}>
          {renderImage('CNIC Front', cnicFront, () => captureImage(setCnicFront))}
          {renderImage('CNIC Back', cnicBack, () => captureImage(setCnicBack))}
        </View>

        <View style={styles.imagerow}>
          {renderImage('License Front', licenseFront, () => captureImage(setLicenseFront))}
          {renderImage('License Back', licenseBack, () => captureImage(setLicenseBack))}
        </View>
        <View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttontext}>Register</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f1f3eeff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagerow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  overlayWrapper: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  icon: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 8,
    opacity: 0.3,
  },
  overlayedImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  doneText: {
    textAlign: 'center',
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#290cffff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 17,
  },
  buttontext: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default UploadImages;
