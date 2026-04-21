// ViewBookingStatus.js
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from '../../apiConfig';

const ViewBookingStatus = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewedBookings, setReviewedBookings] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();

  const checkReviews = async (bookings) => {
    try {
      // ✅ Sab ek saath chalao — fast!
      const results = await Promise.all(
        bookings.map(async (booking) => {
          const bookingId = booking._id || booking.id;
          try {
            const res = await fetch(`${BASE_URL}/api/reviews/check/${bookingId}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' },
            });
            const data = await res.json();
            return data.hasReview ? bookingId : null;
          } catch (err) {
            return null;
          }
        })
      );
      setReviewedBookings(results.filter(Boolean));
    } catch (err) {
      console.log('checkReviews error:', err);
    }
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/bookings`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      const text = await res.text();
      console.log('Bookings raw:', text.substring(0, 100));
      const data = JSON.parse(text);
      const bookingsArray = Array.isArray(data) ? data : [];
      const validBookings = bookingsArray.filter(b => b && (b.id || b._id) && b.driverName);
      setBookings(validBookings);
      await checkReviews(validBookings);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const newBooking = route.params?.newBooking;
    if (newBooking) {
      setBookings(prev => {
        const exists = prev.some(b => (b._id === newBooking._id || b.id === newBooking.id));
        return exists ? prev : [newBooking, ...prev];
      });
    }
    fetchBookings();
  }, [fetchBookings, route.params?.newBooking]);

  const getStatusStyle = status => {
    switch (status) {
      case "accepted": return { backgroundColor: "green" };
      case "rejected": return { backgroundColor: "red" };
      case "completed": return { backgroundColor: "#28a745" };
      default: return { backgroundColor: "#007bff" };
    }
  };

  const handleReviewPress = (driverName, bookingId, status) => {
    if (status !== "completed") return;
    navigation.navigate("Reviews", { driverName, bookingId, bookingStatus: status });
  };

  const renderStars = rating => "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));

  const renderBooking = ({ item }) => {
    if (!item) return null;
    const bookingId = item._id || item.id;
    const driverName = item.driverName || "Unknown Driver";
    const status = item.status || "pending";
    const isCompleted = status === "completed";
    const isAccepted = status === "accepted" || isCompleted;
    const hasReviewed = reviewedBookings.includes(bookingId);

    return (
      <View style={styles.card}>
        <View style={styles.driverInfo}>
          <Image source={require("../../assets/images/Profileimage.png")} style={styles.driverImage} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.driverName}>{driverName}</Text>
            {item.rating && <Text style={styles.rating}>{renderStars(item.rating)} ({item.rating})</Text>}
          </View>
        </View>

        <Text style={styles.detail}>From: {item.from || "N/A"}</Text>
        <Text style={styles.detail}>To: {item.to || "N/A"}</Text>
        <Text style={styles.detail}>Date: {item.date || "N/A"}</Text>
        <Text style={styles.detail}>Time: {item.time || "N/A"}</Text>
        <Text style={styles.detail}>Vehicle: {item.vehicle || "N/A"}</Text>
        <Text style={styles.detail}>Seats: {item.seats || "N/A"}</Text>
        <Text style={styles.detail}>Status: {status}</Text>

        {isAccepted && (
          <View style={styles.driverInfoBox}>
            <Text style={styles.driverInfoTitle}>🚗 Driver Contact Info</Text>
            <Text style={styles.driverInfoText}>👤 {item.driverName}</Text>
            <Text style={styles.driverInfoText}>📞 {item.driverPhone || 'Not provided'}</Text>
            <Text style={styles.driverInfoText}>✉️ {item.driverEmail || 'Not provided'}</Text>
          </View>
        )}

        <TouchableOpacity style={[styles.statusButton, getStatusStyle(status)]} disabled>
          <Text style={styles.statusButtonText}>{status.toUpperCase()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.reviewButton, (!isCompleted || hasReviewed) ? styles.disabledButton : styles.enabledButton]}
          disabled={!isCompleted || hasReviewed}
          onPress={() => handleReviewPress(driverName, bookingId, status)}
        >
          <Text style={styles.reviewButtonText}>
            {hasReviewed ? "✅ Review Submitted" : isCompleted ? "DriverReview" : "Complete Ride to Review"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text>Loading bookings...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.center}>
      <Text style={{ color: "red" }}>{error}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <View style={styles.center}><Text>No bookings found</Text></View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={item => {
            const id = item._id || item.id;
            return id ? id.toString() : Math.random().toString(36).substr(2, 9);
          }}
          renderItem={renderBooking}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={10}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#eee9e7ff", padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  driverInfo: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  driverImage: { width: 60, height: 60, borderRadius: 30 },
  driverName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  rating: { fontSize: 16, color: "#ffaa00" },
  detail: { fontSize: 16, color: "#555", marginVertical: 2 },
  driverInfoBox: { backgroundColor: '#e8f5e9', padding: 12, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: '#4caf50' },
  driverInfoTitle: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32', marginBottom: 5 },
  driverInfoText: { fontSize: 15, color: '#333', marginVertical: 2 },
  statusButton: { paddingVertical: 10, borderRadius: 8, marginTop: 10 },
  statusButtonText: { color: "#fff", textAlign: "center", fontSize: 16 },
  reviewButton: { paddingVertical: 10, borderRadius: 8, marginTop: 10, borderWidth: 1, borderColor: "#007bff" },
  disabledButton: { backgroundColor: "#aaa" },
  enabledButton: { backgroundColor: "#007bff" },
  reviewButtonText: { color: "#fff", textAlign: "center", fontSize: 16 },
});

export default ViewBookingStatus;