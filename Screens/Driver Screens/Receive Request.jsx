import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ViewSharedPost = ({ navigation }) => {
  const [rides] = useState([
    {
      id: '1',
      driverName: 'Muhammad Moosa',
      from: 'Lahore',
      to: 'Islamabad',
      date: '2025-08-10',
      Time: '08:00 AM',
      vehicle: 'Toyota Corolla',
      seats: 3,
    },
    {
      id: '2',
      driverName: 'Ali Khan',
      from: 'Karachi',
      to: 'Hyderabad',
      date: '2025-08-12',
      Time: '02:00 PM',
      vehicle: 'Honda Civic',
      seats: 2,
    },
  ]);

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
      <Text style={styles.detail}>Time: {item.Time}</Text>
      <Text style={styles.detail}>Vehicle: {item.vehicle}</Text>
      <Text style={styles.detail}>Seats: {item.seats}</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.acceptBtn}>
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rejectBtn}>
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.completeButton}>
        <Text style={styles.completeButtonText}>Ride Completed</Text>
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
  btnRow: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between'
  },
  acceptBtn: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 15,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
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

export default ViewSharedPost;
