import React, { useState, useEffect, useContext } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { DriverContext } from './DriverContext';

const ReceiveRequest = () => {
  const { driverName } = useContext(DriverContext);
  const [rides, setRides] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = () => {
    setRefreshing(true);
    fetch(`http://10.133.138.73:5000/api/bookings/driver/${driverName}`)
      .then(res => res.json())
      .then(data => setRides(data))
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    if (driverName) fetchBookings();
  }, [driverName]);

  const updateStatus = (id, status) => {
    if (!id) {
      Alert.alert("Error", "Invalid ride ID. Cannot update status.");
      return;
    }

    // For "completed" status, update locally first to enable the review button
    if (status === "completed") {
      // Update the local state immediately
      setRides(prevRides => 
        prevRides.map(ride => 
          (ride._id === id || ride.id === id) 
            ? { ...ride, status: "completed" } 
            : ride
        )
      );
      
      // Show success message
      Alert.alert("Success", "Ride marked as completed! You can now review the driver.");
      
      // Try to update the backend
      fetch(`http://10.133.138.73:5000/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          console.error("Backend update failed:", data);
          // Don't show an error to the user since we already updated the UI
          return;
        }
        console.log("Backend updated successfully");
      })
      .catch(err => {
        console.error("Backend update failed (but UI was updated):", err);
      });
      
      return; // Skip the rest of the function
    }
    
    // For other statuses (accepted, rejected), use the original logic
    fetch(`http://10.133.138.73:5000/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then(async (res) => {
        console.log("Response status:", res.status);
        
        const data = await res.json().catch(() => ({}));
        
        if (!res.ok) {
          if (res.status === 400 && data.message && data.message.includes('enum')) {
            throw new Error(`"${status}" is not a valid status. The server may need to be updated to support this status.`);
          }
          
          const errorMessage = data.message || data.error || `Server responded with status: ${res.status}`;
          throw new Error(errorMessage);
        }
        
        return data;
      })
      .then(data => {
        console.log("Status updated successfully:", data);
        fetchBookings();
        Alert.alert("Success", `Ride ${status} successfully!`);
      })
      .catch(err => {
        console.error("Update error:", err);
        Alert.alert(
          "Error", 
          `Failed to update ride status: ${err.message}`,
          [{ text: "OK" }]
        );
      });
  };

  const renderRide = ({ item }) => {
    const isHandled = item.status === "accepted" || item.status === "rejected";
    const isCompleted = item.status === "completed";
    const rideId = item._id || item.id; 

    return (
      <View style={styles.card}>
        <View style={styles.driverInfo}>
          <Image
            source={require('../../assets/images/Profileimage.png')}
            style={styles.driverImage}
          />
          <Text style={styles.driverName}>{item.driverName}</Text>
        </View>

        <Text style={styles.detail}>From: {item.from}</Text>
        <Text style={styles.detail}>To: {item.to}</Text>
        <Text style={styles.detail}>Date: {item.date}</Text>
        <Text style={styles.detail}>Time: {item.time}</Text>
        <Text style={styles.detail}>Vehicle: {item.vehicle}</Text>
        <Text style={styles.detail}>Seats: {item.seats}</Text>
        <Text style={styles.detail}>Current Status: {item.status}</Text>

        {/* STATUS TEXT */}
        {(isHandled || isCompleted) && (
          <Text
            style={{
              marginTop: 10,
              fontSize: 16,
              fontWeight: "bold",
              color: item.status === "accepted" ? "green" : 
                     item.status === "rejected" ? "red" : "#007bff",
              textAlign: "center",
            }}
          >
            {item.status.toUpperCase()}
          </Text>
        )}

        {/* ACCEPT + REJECT */}
        {!isHandled && !isCompleted && (
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => updateStatus(rideId, "accepted")}
            >
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => updateStatus(rideId, "rejected")}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* COMPLETE RIDE BUTTON - Only show for accepted rides that aren't completed */}
        {item.status === "accepted" && !isCompleted && (
          <TouchableOpacity
            style={styles.completeBtn}
            onPress={() => updateStatus(rideId, "completed")}
          >
            <Text style={styles.completeText}>Complete Ride</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {rides.length === 0 ? (
        <Text style={styles.emptyText}>No ride requests yet</Text>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => (item._id || item.id).toString()}
          renderItem={renderRide}
          refreshing={refreshing}
          onRefresh={fetchBookings}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  emptyText: { textAlign: 'center', marginTop: 30, fontSize: 18, color: '#666' },

  card: {
    backgroundColor: '#eee9e7ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  driverInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  driverImage: { width: 50, height: 50, borderRadius: 25 },
  driverName: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  detail: { fontSize: 15, marginVertical: 2 },

  btnRow: { flexDirection: 'row', marginTop: 10 },

  acceptBtn: {
    flex: 1,
    backgroundColor: 'green',
    padding: 10,
    marginRight: 5,
    borderRadius: 8,
  },

  rejectBtn: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10,
    marginLeft: 5,
    borderRadius: 8,
  },

  completeBtn: {
    marginTop: 10,
    backgroundColor: '#1e88e5',
    padding: 12,
    borderRadius: 8,
  },

  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

  completeText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReceiveRequest;