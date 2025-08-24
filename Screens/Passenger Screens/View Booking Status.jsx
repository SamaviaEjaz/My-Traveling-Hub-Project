import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';

const ViewBookingStatus = ({ navigation }) => {
  const [rides, setRides] = useState([]);

useEffect(() => {
  fetch("http://10.113.22.73:5000/api/bookings")
    .then(res => res.json())
    .then(data => setRides(data))
    .catch(err => console.error(err));
}, []);

  const renderRide = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.driverInfo}>
        <Image
          source={require('../../assets/images/Profileimage.png')}
          style={styles.driverImage}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.driverName}>{item.driverName}</Text>
          <Text style={styles.rating}>{renderStars(item.rating)} ({item.rating})</Text>
        </View>
      </View>

      <Text style={styles.detail}>From: {item.from}</Text>
      <Text style={styles.detail}>To: {item.to}</Text>
      <Text style={styles.detail}>Date: {item.date}</Text>
      <Text style={styles.detail}>Time: {item.Time}</Text>
      <Text style={styles.detail}>Vehicle: {item.vehicle}</Text>
      <Text style={styles.detail}>Seats: {item.seats}</Text>

      <TouchableOpacity style={styles.completeButton}>
        <Text style={styles.completeButtonText}>Booking Pending</Text>
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
  rating: {
    fontSize: 16,
    color: '#ffaa00'
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginVertical: 2
  },
  completeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  completeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  }
});

export default ViewBookingStatus;
