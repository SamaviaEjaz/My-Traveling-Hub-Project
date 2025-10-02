import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import axios from "axios";

const SERVER_URL = "http:/10.101.99.73:5000/api";

const DriverReviews = () => {
  const loggedInDriver = "Muhammad Moosa"; 
  const [reviewsData, setReviewsData] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/reviews`);
      const driverReviews = res.data.filter(r => r.driverName === loggedInDriver);
      setReviewsData(driverReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

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
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.rating}>{renderStars(item.rating)} ({item.rating})</Text>
          <Text style={styles.comment}>{item.comment}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Reviews</Text>
      {reviewsData.length > 0 ? (
        <FlatList
          data={reviewsData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderReview}
        />
      ) : <Text style={styles.noReviews}>You don’t have any reviews yet.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#f0f0f0", flex: 1 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  noReviews: { fontSize: 16, color: "#555", marginTop: 20 },
  reviewCard: { backgroundColor: "#eee9e7ff", padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  driverInfo: { flexDirection: "row", alignItems: "flex-start" },
  driverImage: { width: 50, height: 50, borderRadius: 25 },
  rating: { fontSize: 16, color: "#ffaa00" },
  comment: { fontSize: 14, color: "#555", marginTop: 4, maxWidth: 250 },
});

export default DriverReviews;
