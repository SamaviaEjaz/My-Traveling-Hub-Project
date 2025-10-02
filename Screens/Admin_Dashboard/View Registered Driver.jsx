import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ViewRegisteredDriver = ({ route }) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showRefreshNotice = route?.params?.fromApproval;
  const navigation = useNavigation();

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (showRefreshNotice) {
      fetchDrivers();
    }
  }, [showRefreshNotice]);

  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://10.101.99.73:5000/api/drivers');
      const data = await response.json();
      
      if (data.success) {
        setDrivers(data.drivers || []);
      } else {
        setError(data.message || 'Failed to fetch drivers');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (driverId) => {
    // Navigate to DriversAuthorization with driverId
    navigation.navigate("DriversAuthorization", { driverId });
  };

  const handleDelete = async (driverId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this driver?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`http://10.101.99.73:5000/api/drivers/${driverId}`, {
                method: 'DELETE',
              });
              
              const data = await response.json();
              
              if (data.success) {
                Alert.alert('Success', 'Driver has been deleted');
                fetchDrivers(); // Refresh the list
              } else {
                Alert.alert('Error', data.message || 'Failed to delete driver');
              }
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Network error occurred');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading drivers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchDrivers}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Registered Drivers</Text>
      {showRefreshNotice && (
        <View style={styles.refreshNotice}>
          <Text style={styles.refreshNoticeText}>Driver list has been refreshed</Text>
        </View>
      )}
      {drivers.length === 0 ? (
        <Text style={styles.noDriversText}>No registered drivers found</Text>
      ) : (
        drivers.map((driver) => (
          <View key={driver._id} style={styles.card}>
            <View>
              <Text style={styles.label}>Name: <Text style={styles.value}>{driver.name || driver.fullName}</Text></Text>
              <Text style={styles.label}>Email: <Text style={styles.value}>{driver.email}</Text></Text>
              <Text style={styles.label}>Phone: <Text style={styles.value}>{driver.phone}</Text></Text>
              <Text style={styles.label}>CNIC: <Text style={styles.value}>{driver.cnic}</Text></Text>
              <Text style={styles.label}>Status: 
                <Text style={[
                  styles.value,
                  driver.status === 'approved' ? styles.approvedStatus :
                  driver.status === 'rejected' ? styles.rejectedStatus :
                  styles.pendingStatus
                ]}>
                  {driver.status}
                </Text>
              </Text>
            </View>
            <View>
              <View style={{flexDirection: 'row', gap: 10}}>
                <TouchableOpacity 
                  style={[
                    styles.approvedButton, 
                    driver.status === 'approved' && styles.disabledButton
                  ]}
                  disabled={driver.status === 'approved'}
                  onPress={() => handleApprove(driver._id)}
                >
                  <Text style={styles.approvedText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDelete(driver._id)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f7f7f7'
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  value: {
    fontWeight: 'normal',
    color: '#555'
  },
  approvedButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  approvedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#dc3545',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  refreshNotice: {
    backgroundColor: '#e6f7e6',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center'
  },
  refreshNoticeText: {
    color: '#28a745',
    fontWeight: 'bold'
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666'
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
    fontSize: 16
  },
  retryButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  noDriversText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16
  },
  approvedStatus: {
    color: '#28a745',
    fontWeight: 'bold'
  },
  rejectedStatus: {
    color: '#dc3545',
    fontWeight: 'bold'
  },
  pendingStatus: {
    color: '#ffc107',
    fontWeight: 'bold'
  },
  disabledButton: {
    backgroundColor: '#6c757d'
  }
});

export default ViewRegisteredDriver;