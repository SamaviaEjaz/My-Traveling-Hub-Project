import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const DriversAuthorization = () => {
    const navigation = useNavigation();
  
  const localImage = require('../../assets/images/Profileimage.png');

  const [drivers, setDrivers] = useState([
    {
      id: '1',
      name: 'Ali Khan',
      email: 'ali@example.com',
      phone: '03001234567',
      CNIC: '3520212345671',
      personalImage: localImage,
      vehicleImage: localImage,
      cnicFront: localImage,
      cnicBack: localImage,
      licenseFront: localImage,
      licenseBack: localImage,
    },
    {
      id: '2',
      name: 'Sara Ahmed',
      email: 'sara@example.com',
      phone: '03009876543',
      CNIC: '3520212345672',
      personalImage: localImage,
      vehicleImage: localImage,
      cnicFront: localImage,
      cnicBack: localImage,
      licenseFront: localImage,
      licenseBack: localImage,
    },
  ]);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleApprove = (id) => {
    const updatedList = drivers.filter((driver) => driver.id !== id);
    setDrivers(updatedList);
    alert('Driver Approved');
  };

  const handleReject = (id) => {
    const updatedList = drivers.filter((driver) => driver.id !== id);
    setDrivers(updatedList);
    alert('Driver Rejected');
  };

  const renderImageRow = (label, imgSource) => (
    <View style={styles.imageBox}>
      <Text style={styles.imageLabel}>{label}</Text>
      <TouchableOpacity onPress={() => setSelectedImage(imgSource)}>
        <Image source={imgSource} style={styles.image} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Pending Driver Approvals</Text>

        {drivers.map((driver) => (
          <View key={driver.id} style={styles.card}>
            <Text style={styles.label}>Name: <Text style={styles.value}>{driver.name}</Text></Text>
            <Text style={styles.label}>Email: <Text style={styles.value}>{driver.email}</Text></Text>
            <Text style={styles.label}>Phone: <Text style={styles.value}>{driver.phone}</Text></Text>
            <Text style={styles.label}>CNIC: <Text style={styles.value}>{driver.CNIC}</Text></Text>

            <View style={styles.imageRow}>
              {renderImageRow('Personal', driver.personalImage)}
              {renderImageRow('Vehicle', driver.vehicleImage)}
            </View>
            <View style={styles.imageRow}>
              {renderImageRow('CNIC Front', driver.cnicFront)}
              {renderImageRow('CNIC Back', driver.cnicBack)}
            </View>
            <View style={styles.imageRow}>
              {renderImageRow('License Front', driver.licenseFront)}
              {renderImageRow('License Back', driver.licenseBack)}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.approve]} onPress={() => handleApprove(driver.id)}>
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.reject]} onPress={() => handleReject(driver.id)}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {drivers.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16 }}>No pending drivers.</Text>
        )}
      </ScrollView>

      <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <Image source={selectedImage} style={styles.fullImage} />
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedImage(null)}>
            <Text style={styles.closeButtonText}>✕ Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  value: {
    fontWeight: 'normal',
    color: '#555',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  imageBox: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  imageLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  approve: {
    backgroundColor: '#28a745',
  },
  reject: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DriversAuthorization;