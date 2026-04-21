import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { DriverContext } from './DriverContext';
import { BASE_URL } from '../../apiConfig';

const ViewSharedPost = () => {
  const { driverName } = useContext(DriverContext);
  const [rides, setRides] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRides = () => {
    setRefreshing(true);
    fetch(`${BASE_URL}/api/rides`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const driverRides = data.rides.filter(ride => ride.driverName === driverName);
          setRides(driverRides);  
        }
      })
      .catch(err => console.error(err))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    setRides([]);
    fetchRides();
  }, [driverName]);

  const handleDelete = (id) => {
    fetch(`${BASE_URL}/api/rides/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRides((prev) => prev.filter((ride) => ride._id !== id));  
        }
      })
      .catch(err => console.error(err));
  };

  const renderRide = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.driverInfo}>
        <Image
          source={require('../../assets/images/Profileimage.png')}
          style={styles.driverImage}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.driverName}>{item.driverName}</Text>
        </View>
      </View>

      <Text style={styles.detail}>From: {item.from}</Text>
      <Text style={styles.detail}>To: {item.to}</Text>
      <Text style={styles.detail}>Date: {item.date}</Text>
      <Text style={styles.detail}>Time: {item.time}</Text>
      <Text style={styles.detail}>Vehicle: {item.vehicle}</Text>
      <Text style={styles.detail}>Seats: {item.seats}</Text>

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDelete(item._id)}  
      >
        <Text style={styles.deleteButtonText}>Delete Ride</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {rides.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't shared any rides yet.</Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item._id} 
          renderItem={renderRide}
          refreshing={refreshing}
          onRefresh={fetchRides}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#eee9e7ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginVertical: 2
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
});

export default ViewSharedPost;