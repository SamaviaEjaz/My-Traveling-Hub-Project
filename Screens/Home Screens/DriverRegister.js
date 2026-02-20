import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const DriverRegister = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState({
    personalImage: null,
    cnicFront: null,
    cnicBack: null,
    vehicleImage: null,
    licenseFront: null,
    licenseBack: null
  });

  const [errors, setErrors] = useState({});

  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  const isValidPhone = phone => /^03[0-9]{9}$/.test(phone);
  const isValidCnic = cnic => /^[0-9]{13}$/.test(cnic);

  const pickImage = async (imageType) => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5
    });
    if (!result.canceled) {
      setImages(prev => ({ ...prev, [imageType]: result.assets[0].uri }));
    }
  };

  const handleRegister = async () => {
    setErrors({});
    setLoading(true);

    let valid = true;
    let tempErrors = {};

    if (!fullName.trim()) { tempErrors.fullName = 'Full name is required'; valid = false; }
    if (!email) { tempErrors.email = 'Email is required'; valid = false; }
    else if (!isValidEmail(email)) { tempErrors.email = 'Email must be valid'; valid = false; }
    if (!password) { tempErrors.password = 'Password is required'; valid = false; }
    else if (!isValidPassword(password)) { tempErrors.password = 'Password must be 8+ chars with uppercase, lowercase, number & special char'; valid = false; }
    if (!confirmpassword) { tempErrors.confirmpassword = 'Please confirm your password'; valid = false; }
    else if (password !== confirmpassword) { tempErrors.confirmpassword = 'Passwords do not match'; valid = false; }
    if (!phone) { tempErrors.phone = 'Phone number is required'; valid = false; }
    else if (!isValidPhone(phone)) { tempErrors.phone = 'Phone must start with 03 and be 11 digits'; valid = false; }
    if (!cnic) { tempErrors.cnic = 'CNIC is required'; valid = false; }
    else if (!isValidCnic(cnic)) { tempErrors.cnic = 'CNIC must be 13 digits'; valid = false; }

    const requiredImages = ['personalImage', 'cnicFront', 'cnicBack', 'vehicleImage', 'licenseFront', 'licenseBack'];
    const missingImages = requiredImages.filter(img => !images[img]);
    if (missingImages.length > 0) { tempErrors.images = `Please upload: ${missingImages.join(', ')}`; valid = false; }

    setErrors(tempErrors);
    if (!valid) { setLoading(false); return; }

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('cnic', cnic);
      formData.append('status', 'pending');

      Object.keys(images).forEach(key => {
        if (images[key]) {
          const uriParts = images[key].split('.');
          const fileType = uriParts[uriParts.length - 1];
          formData.append(key, { uri: images[key], type: `image/${fileType}`, name: `${key}.${fileType}` });
        }
      });

      console.log("Submitting registration data...");
      const response = await fetch("http://10.133.138.73:5000/api/drivers/register-with-images", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Full registration response:", JSON.stringify(data, null, 2));

      // Now send OTP
      try {
        console.log("Sending OTP to:", phone);
        const otpResponse = await fetch("http://10.133.138.73:5000/api/drivers/send-otp", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ phone: phone })
        });

        console.log("OTP Response status:", otpResponse.status);
        const otpData = await otpResponse.json();
        console.log("OTP Response data:", otpData);

        // Show the OTP for development
        if (otpData.otp) {
          Alert.alert(
            "Registration Successful",
            `OTP has been sent to ${phone}. For development: ${otpData.otp}`,
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate('Driver_OTP', {
                    phone: phone,
                    driverId: data.driverId
                  });
                }
              }
            ]
          );
        } else {
          Alert.alert(
            "Registration Successful",
            "OTP has been sent to your phone number.",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate('Driver_OTP', {
                    phone: phone,
                    driverId: data.driverId
                  });
                }
              }
            ]
          );
        }
      } catch (otpError) {
        console.error("Error sending OTP:", otpError);
        if (otpError.otp) {
          Alert.alert(
            "Registration Successful",
            `Your registration was successful. For development, please use this OTP: ${otpError.otp}`,
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate('Driver_OTP', {
                    phone: phone,
                    driverId: data.driverId
                  });
                }
              }
            ]
          );
        } else {
          Alert.alert(
            "Registration Successful",
            "Your registration was successful but we couldn't send OTP. Please try requesting OTP on the next screen.",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate('Driver_OTP', {
                    phone: phone,
                    driverId: data.driverId
                  });
                }
              }
            ]
          );
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("⚠ Registration Error", error.message || "Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const ImageUploadButton = ({ title, imageType, imageUri }) => (
    <View style={styles.imageContainer}>
      <Text style={styles.label}>{title}</Text>
      <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(imageType)}>
        <Ionicons name="camera" size={24} color="white" />
        <Text style={styles.imageButtonText}>Upload</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.heading}>Driver Registration</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput style={styles.inputField} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Confirm Password"
          value={confirmpassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons
            name={showConfirmPassword ? 'eye' : 'eye-off'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmpassword && <Text style={styles.error}>{errors.confirmpassword}</Text>}

      <TextInput 
        style={styles.input} 
        placeholder="Phone (03xxxxxxxxx)" 
        value={phone} 
        onChangeText={setPhone} 
        keyboardType="numeric" 
        maxLength={11}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

      <TextInput 
        style={styles.input} 
        placeholder="CNIC (13 digits)" 
        value={cnic} 
        onChangeText={setCnic} 
        keyboardType="numeric" 
        maxLength={13}
      />
      {errors.cnic && <Text style={styles.error}>{errors.cnic}</Text>}

      <Text style={styles.sectionTitle}>Upload Required Documents</Text>
      {errors.images && <Text style={styles.error}>{errors.images}</Text>}

      <View style={styles.imageRow}>
        <ImageUploadButton title="Personal Image" imageType="personalImage" imageUri={images.personalImage} />
        <ImageUploadButton title="Vehicle Image" imageType="vehicleImage" imageUri={images.vehicleImage} />
      </View>
      <View style={styles.imageRow}>
        <ImageUploadButton title="CNIC Front" imageType="cnicFront" imageUri={images.cnicFront} />
        <ImageUploadButton title="CNIC Back" imageType="cnicBack" imageUri={images.cnicBack} />
      </View>
      <View style={styles.imageRow}>
        <ImageUploadButton title="License Front" imageType="licenseFront" imageUri={images.licenseFront} />
        <ImageUploadButton title="License Back" imageType="licenseBack" imageUri={images.licenseBack} />
      </View>

      <TouchableOpacity style={[styles.registerButton, loading && styles.disabledButton]} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0', padding: 10 },
  heading: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  input: { height: 50, borderWidth: 2, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 15, marginVertical: 5, backgroundColor: '#fff' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#ccc', borderRadius: 5, marginVertical: 5, backgroundColor: '#fff', paddingRight: 10 },
  inputField: { flex: 1, height: 50, paddingHorizontal: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  imageRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  imageContainer: { flex: 1, alignItems: 'center', marginHorizontal: 5 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  imageButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4a6da7', padding: 8, borderRadius: 5 },
  imageButtonText: { color: 'white', marginLeft: 5 },
  previewImage: { width: 120, height: 120, borderRadius: 5, marginTop: 5 },
  registerButton: { backgroundColor: '#290cffff', padding: 15, borderRadius: 5, alignItems: 'center', marginVertical: 10 },
  disabledButton: { backgroundColor: '#cccccc' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  error: { color: 'red', marginLeft: 10, marginBottom: 5 },
});

export default DriverRegister;