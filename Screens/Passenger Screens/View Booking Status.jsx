import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";


const ViewBookingStatus = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);
  const fetchBookings = () => {
    fetch("http://10.101.99.73:5000/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(" Fetch Error:", err);
        setError("Failed to load bookings");
        setLoading(false);
      });
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return { backgroundColor: "green" };
      case "rejected":
        return { backgroundColor: "red" };
      default:
        return { backgroundColor: "#007bff" };
    }
  };
  const renderBooking = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.driverInfo}>
        <Image
          source={require("../../assets/images/Profileimage.png")}
          style={styles.driverImage}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.driverName}>{item.driverName || "Unknown Driver"}</Text>
          {item.rating && (
            <Text style={styles.rating}>
              {renderStars(item.rating)} ({item.rating})
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.detail}>From: {item.from}</Text>
      <Text style={styles.detail}>To: {item.to}</Text>
      <Text style={styles.detail}>Date: {item.date}</Text>
      <Text style={styles.detail}>Time: {item.time}</Text>
      <Text style={styles.detail}>Vehicle: {item.vehicle}</Text>
      <Text style={styles.detail}>Seats: {item.seats}</Text>

      {item.status === "pending" ? (
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "green" }]}
            disabled   
          >
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "red" }]}
            disabled   
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>

      ) : (
        <TouchableOpacity
          style={[styles.completeButton, getStatusStyle(item.status)]}
          disabled
        >
          <Text style={styles.completeButtonText}>
            {item.status ? item.status.toUpperCase() : "BOOKING PENDING"}
          </Text>
        </TouchableOpacity>
      )}

    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading bookings...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <View style={styles.center}>
          <Text>No bookings found</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
          renderItem={renderBooking}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#eee9e7ff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333"
  },
  rating: {
    fontSize: 16,
    color: "#ffaa00"
  },
  detail: {
    fontSize: 16,
    color: "#555",
    marginVertical: 2
  },
  completeButton: {
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10
  },
  completeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  actionBtn: {
    flex: 1, marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16
  },
});
export default ViewBookingStatus;