import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';

const ViewSharedPost = () => {
  const [rides, setRides] = useState([]);

  // ✅ Fetch Rides
  const fetchRides = () => {
    fetch("http://10.113.22.73:5000/api/rides")
      .then(res => res.json())
      .then(data => setRides(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchRides();
  }, []);

  // ✅ Delete Ride
  const handleDelete = (id) => {
    fetch(`http://10.113.22.73:5000/api/rides/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Local state se remove
          setRides((prev) => prev.filter((ride) => ride.id !== id));
        }
      })
      .catch(err => console.error(err));
  };

  // ✅ Render Ride
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

      {/* ✅ Delete Button */}
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete Ride</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={renderRide}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
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
