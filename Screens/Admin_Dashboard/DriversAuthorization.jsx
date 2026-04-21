import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../apiConfig';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 2; 

export default function DriversAuthorization() {
  const route = useRoute();
  const navigation = useNavigation();
  const { driverId } = route.params || {};
  const [driver, setDriver] = useState(null);
  const [drivers, setDrivers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showList, setShowList] = useState(!driverId); 
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log("DriversAuthorization mounted");
    console.log("Driver ID from params:", driverId);
    
    if (driverId) {

      fetchDriver(driverId);
    } else {

      fetchPendingDrivers();
    }
  }, [driverId]);

  const fetchDriver = async (id) => {
    try {
      console.log("Fetching driver with ID:", id);
      const response = await fetch(`${BASE_URL}/api/drivers/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Driver data received:", data);
      
      if (data.success) {
        setDriver(data.driver);
        setShowList(false); 
      } else {
        setError(data.message || "Failed to fetch driver data");
      }
    } catch (error) {
      console.error("Fetch driver error:", error);
      setError(error.message || "Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingDrivers = async () => {
    try {
      console.log("Fetching pending drivers");
      const response = await fetch(`${BASE_URL}/api/drivers?status=pending`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Pending drivers data received:", data);
      
      if (data.success) {
        setDrivers(data.drivers || []);
        setShowList(true); 
      } else {
        setError(data.message || "Failed to fetch pending drivers");
      }
    } catch (error) {
      console.error("Fetch pending drivers error:", error);
      setError(error.message || "Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      console.log("Approving driver with ID:", driver._id);
      const response = await fetch(`${BASE_URL}/api/drivers/${driver._id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        Alert.alert(
          "Success", 
          "Driver has been approved",
          [
            { 
              text: "OK", 
              onPress: () => navigation.navigate("View Registered Driver", { fromApproval: true })
            }
          ]
        );
      } else {
        Alert.alert("Error", data.message || "Failed to approve driver");
      }
    } catch (error) {
      console.error("Approve error:", error);
      Alert.alert("Error", "Network error occurred");
    }
  };

  const handleReject = async () => {
    try {
      console.log("Rejecting driver with ID:", driver._id);
      const response = await fetch(`${BASE_URL}/api/drivers/${driver._id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        Alert.alert(
          "Success", 
          "Driver has been rejected",
          [
            { 
              text: "OK", 
              onPress: () => navigation.navigate("View Registered Driver", { fromApproval: true })
            }
          ]
        );
      } else {
        Alert.alert("Error", data.message || "Failed to reject driver");
      }
    } catch (error) {
      console.error("Reject error:", error);
      Alert.alert("Error", "Network error occurred");
    }
    const handleApprove = async () => {
  try {
    console.log("Approving driver with ID:", driver._id);
    const response = await fetch(`${BASE_URL}/api/drivers/${driver._id}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      Alert.alert(
        "Success", 
        "Driver has been approved",
        [
          { 
            text: "OK", 
            onPress: () => {
              // Yahan ViewRegisteredDriver par navigate karein
              navigation.navigate("ViewRegisteredDriver", { fromApproval: true });
            }
          }
        ]
      );
    } else {
      Alert.alert("Error", data.message || "Failed to approve driver");
    }
  } catch (error) {
    console.error("Approve error:", error);
    Alert.alert("Error", "Network error occurred");
  }
};

const handleReject = async () => {
  try {
    console.log("Rejecting driver with ID:", driver._id);
    const response = await fetch(`${BASE_URL}/api/drivers/${driver._id}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      Alert.alert(
        "Success", 
        "Driver has been rejected",
        [
          { 
            text: "OK", 
            onPress: () => {
              // Yahan bhi ViewRegisteredDriver par navigate karein
              navigation.navigate("ViewRegisteredDriver", { fromApproval: true });
            }
          }
        ]
      );
    } else {
      Alert.alert("Error", data.message || "Failed to reject driver");
    }
  } catch (error) {
    console.error("Reject error:", error);
    Alert.alert("Error", "Network error occurred");
  }
};
  };
  

  const getImageUri = (imageName) => {
    if (!imageName) return null;
    return { uri: `${BASE_URL}/uploads/drivers/${imageName}` };
  };

  const defaultAvatar = require('../../assets/images/Profileimage.png');

  const handleImagePress = (imageSource) => {
    setSelectedImage(imageSource);
    setModalVisible(true);
  };

  const renderDriverItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.driverItem} 
      onPress={() => fetchDriver(item._id)}
    >
      <Text style={styles.driverName}>{item.name || item.fullName}</Text>
      <Text style={styles.driverEmail}>{item.email}</Text>
      <Text style={styles.driverStatus}>{item.status}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" style={styles.loader} />
        <Text style={styles.debugText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => {
            setLoading(true);
            setError(null);
            if (driverId) {
              fetchDriver(driverId);
            } else {
              fetchPendingDrivers();
            }
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showList ? (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Pending Drivers for Authorization</Text>
          <FlatList
            data={drivers}
            renderItem={renderDriverItem}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={<Text style={styles.emptyText}>No pending drivers found</Text>}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>

            <Text style={styles.labelRow}>
              <Text style={styles.labelTitle}>Name: </Text>
              {driver.name || driver.fullName}
            </Text>
            <Text style={styles.labelRow}>
              <Text style={styles.labelTitle}>Email: </Text>
              {driver.email}
            </Text>
            <Text style={styles.labelRow}>
              <Text style={styles.labelTitle}>Phone: </Text>
              {driver.phone}
            </Text>
            <Text style={styles.labelRow}>
              <Text style={styles.labelTitle}>CNIC: </Text>
              {driver.cnic}
            </Text>
            <Text style={styles.labelRow}>
              <Text style={styles.labelTitle}>Status: </Text>
              <Text style={[
                styles.statusText,
                driver.status === 'approved' ? styles.approvedStatus :
                driver.status === 'rejected' ? styles.rejectedStatus :
                styles.pendingStatus
              ]}>
                {driver.status}
              </Text>
            </Text>

            <View style={styles.grid}>
              <View style={styles.gridCol}>
                <Text style={styles.gridLabel}>Personal</Text>
                <TouchableOpacity 
                  style={styles.imageBox}
                  onPress={() => handleImagePress(getImageUri(driver.personalImage) || defaultAvatar)}
                >
                  <Image 
                    source={getImageUri(driver.personalImage) || defaultAvatar} 
                    style={styles.image} 
                    resizeMode="cover" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.gridCol}>
                <Text style={styles.gridLabel}>Vehicle</Text>
                <TouchableOpacity 
                  style={styles.imageBox}
                  onPress={() => handleImagePress(getImageUri(driver.vehicleImage) || defaultAvatar)}
                >
                  <Image 
                    source={getImageUri(driver.vehicleImage) || defaultAvatar} 
                    style={styles.image} 
                    resizeMode="cover" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.gridCol}>
                <Text style={styles.gridLabel}>CNIC Front</Text>
                <TouchableOpacity 
                  style={styles.imageBox}
                  onPress={() => handleImagePress(getImageUri(driver.cnicFront) || defaultAvatar)}
                >
                  <Image 
                    source={getImageUri(driver.cnicFront) || defaultAvatar} 
                    style={styles.image} 
                    resizeMode="cover" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.gridCol}>
                <Text style={styles.gridLabel}>CNIC Back</Text>
                <TouchableOpacity 
                  style={styles.imageBox}
                  onPress={() => handleImagePress(getImageUri(driver.cnicBack) || defaultAvatar)}
                >
                  <Image 
                    source={getImageUri(driver.cnicBack) || defaultAvatar} 
                    style={styles.image} 
                    resizeMode="cover" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.gridCol}>
                <Text style={styles.gridLabel}>License Front</Text>
                <TouchableOpacity 
                  style={styles.imageBox}
                  onPress={() => handleImagePress(getImageUri(driver.licenseFront) || defaultAvatar)}
                >
                  <Image 
                    source={getImageUri(driver.licenseFront) || defaultAvatar} 
                    style={styles.image} 
                    resizeMode="cover" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.gridCol}>
                <Text style={styles.gridLabel}>License Back</Text>
                <TouchableOpacity 
                  style={styles.imageBox}
                  onPress={() => handleImagePress(getImageUri(driver.licenseBack) || defaultAvatar)}
                >
                  <Image 
                    source={getImageUri(driver.licenseBack) || defaultAvatar} 
                    style={styles.image} 
                    resizeMode="cover" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.approveBtn]}
                onPress={handleApprove}>
                <Text style={styles.actionText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.rejectBtn]}
                onPress={handleReject}>
                <Text style={styles.actionText}>Reject</Text>
              </TouchableOpacity>
            </View>

            {!driverId && (
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => {
                  setShowList(true);
                  setDriver(null);
                  fetchPendingDrivers();
                }}
              >
                <Text style={styles.backButtonText}>Back to List</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      )}

      {/* Image Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Image 
              source={selectedImage} 
              style={styles.modalImage} 
              resizeMode="contain" 
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 32 },
  listContainer: { flex: 1, padding: 16 },
  listTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  driverItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  driverName: { fontSize: 16, fontWeight: 'bold' },
  driverEmail: { fontSize: 14, color: '#666' },
  driverStatus: { fontSize: 14, color: '#f0ad4e', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666' },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  labelRow: { fontSize: 16, marginBottom: 8, color: '#222' },
  labelTitle: { fontWeight: '700', marginRight: 6 },
  statusText: { fontWeight: '700' },
  approvedStatus: { color: '#2e8b57' },
  rejectedStatus: { color: '#d9534f' },
  pendingStatus: { color: '#f0ad4e' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  gridCol: { width: '50%', padding: 8, alignItems: 'center' },
  gridLabel: { fontWeight: '700', marginBottom: 8 },
  imageBox: {
    width: ITEM_SIZE - 16,
    height: ITEM_SIZE - 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: { width: '80%', height: '80%', borderRadius: 6 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  approveBtn: { backgroundColor: '#2e8b57' },
  rejectBtn: { backgroundColor: '#d9534f' },
  actionText: { color: 'white', fontWeight: '700', fontSize: 16 },
  backButton: { 
    backgroundColor: '#3498db', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center', 
    marginTop: 20 
  },
  backButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  errorText: { textAlign: 'center', marginTop: 50, color: 'red', fontSize: 16 },
  retryButton: { backgroundColor: '#3498db', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  retryButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  debugText: { textAlign: 'center', marginTop: 10, color: '#666', fontSize: 14, fontStyle: 'italic' },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});