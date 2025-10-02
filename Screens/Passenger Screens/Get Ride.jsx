import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';

const GetRide = ({ navigation }) => {
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');
  const [timeSearch, setTimeSearch] = useState('');
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetch("http://10.101.99.73:5000/api/rides")
      .then(res => res.json())
      .then(data => setRides(data.rides || []))
      .catch(err => console.error(err));
  }, []);

  const filteredRides = rides.filter(ride =>
    (ride.from || "").toLowerCase().includes(fromSearch.toLowerCase()) &&
    (ride.to || "").toLowerCase().includes(toSearch.toLowerCase()) &&
    (ride.date || "").toLowerCase().includes(dateSearch.toLowerCase()) &&
    (ride.time || "").toLowerCase().includes(timeSearch.toLowerCase())
  );

  const renderRide = ({ item }) => (
    <View style={{ backgroundColor: '#eee9e7ff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' }}>
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
        style={styles.bookButton}
        onPress={() => {
          fetch("http://10.101.99.73:5000/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rideId: item._id || item.id,
              driverName: item.driverName,
              from: item.from,
              to: item.to,
              date: item.date,
              time: item.time,
              vehicle: item.vehicle,
              seats: item.seats,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                alert("Booking request sent!");
                navigation.navigate("View Booking Status");
              } else {
                alert("Booking failed: " + data.message);
              }
            })
            .catch((err) => {
              console.error("Booking Error:", err);
              alert("Something went wrong, check console");
            });
        }}
      >
        <Text style={styles.bookButtonText}>Book Ride</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('Reviews', { driverName: item.driverName })}
      >
        <Text style={styles.bookButtonText}>Reviews</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate('Messages', {
          driverId: item._id || item.id,
          driverName: item.driverName
        })}
        >
        <Text style={styles.chatButtonText}>Chat with Driver</Text>
      </TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputrow}>
        <TextInput
          style={styles.input}
          placeholder="From"
          value={fromSearch}
          onChangeText={setFromSearch}
        />
        <TextInput
          style={styles.input}
          placeholder="To"
          value={toSearch}
          onChangeText={setToSearch}
        />
      </View>

      <View style={styles.inputrow}>
        <TextInput
          style={styles.input}
          placeholder="Date YYYY-MM-DD"
          value={dateSearch}
          onChangeText={setDateSearch}
        />
        <TextInput
          style={styles.input}
          placeholder="Time 00:00 AM"
          value={timeSearch}
          onChangeText={setTimeSearch}
        />
      </View>

      <FlatList
        data={filteredRides}
        keyExtractor={(item) => item._id}
        renderItem={renderRide}
        ListEmptyComponent={<Text style={styles.noResult}>No rides found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  inputrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.2,
    fontSize: 16,
    marginHorizontal: 5,
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
  bookButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  bookButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  chatButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  chatButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  noResult: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16
  },
});

export default GetRide;
