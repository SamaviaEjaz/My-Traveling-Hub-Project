import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { BASE_URL } from '../../apiConfig';

const DriverReviews = ({ route }) => {
  const driverName = route?.params?.driverName; 
  const [reviewsData, setReviewsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    if (!driverName) {
      setLoading(false);
      return;
    }
    setRefreshing(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/reviews`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      const driverReviews = res.data.filter(
        r => r.driverName?.trim().toLowerCase() === driverName?.trim().toLowerCase()
      ); setReviewsData(driverReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    setReviewsData([]);
    setLoading(true);
    fetchReviews();
  }, [driverName]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push("★");
      else if (i - rating < 1 && rating % 1 !== 0) stars.push("⯨");
      else stars.push("☆");
    }
    return stars.join(" ");
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.driverInfo}>
        <Image source={require("../../assets/images/Profileimage.png")} style={styles.driverImage} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.passengerName}> {item.passengerName || 'Anonymous'}</Text>
          <Text style={styles.rating}>{renderStars(item.rating)} ({item.rating})</Text>
          <Text style={styles.comment}>{item.comment}</Text>
          <Text style={styles.date}>{item.date || "No date"}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.heading}>{driverName ? `${driverName}'s Reviews` : 'Reviews'}</Text>
          <Text style={styles.loadingText}>Loading reviews...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{driverName ? `${driverName}'s Reviews` : 'Reviews'}</Text>

      {driverName ? (
        reviewsData.length > 0 ? (
          <FlatList
            data={reviewsData}
            keyExtractor={(item) => item._id || item.id || `${item.bookingId}-${item.date}`}
            renderItem={renderReview}
            refreshing={refreshing}
            onRefresh={fetchReviews}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>This driver has no reviews yet.</Text>
          </View>
        )
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Driver not found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f0f0f0" },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: "#555", textAlign: 'center' },
  reviewCard: { backgroundColor: "#eee9e7ff", padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  driverInfo: { flexDirection: "row", alignItems: "flex-start" },
  driverImage: { width: 50, height: 50, borderRadius: 25 },
  rating: { fontSize: 16, color: "#ffaa00", fontWeight: 'bold' },
  comment: { fontSize: 14, color: "#555", marginTop: 4 },
  passengerName: { fontSize: 14, color: '#333', marginTop: 6, fontWeight: 'bold' },
  passengerPhone: { fontSize: 14, color: '#297ce9', marginTop: 2 },
  date: { fontSize: 12, color: "#888", marginTop: 4, fontStyle: 'italic' },
});

export default DriverReviews;