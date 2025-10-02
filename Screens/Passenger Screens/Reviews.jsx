import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { Rating } from 'react-native-ratings';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from "axios";

const SERVER_URL = "http://10.101.99.73:5000/api";

const Reviews = () => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const loggedInDriver = "Muhammad Moosa"; // driver jiske liye feedback hai

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/reviews`);
      const driverReviews = res.data.filter(r => r.driverName === loggedInDriver);
      setReviews(driverReviews);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async () => {
    if (!comment || rating === 0) return alert("Please write a comment and give a rating!");
    try {
      await axios.post(`${SERVER_URL}/reviews`, { driverName: loggedInDriver, rating, comment });
      setComment('');
      setRating(0);
      fetchReviews(); // immediately update reviews below
      alert("Review submitted!");
    } catch (error) {
      console.error(error);
      alert("Error submitting review");
    }
  };

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
    <SafeAreaView style={styles.container}>
      <Rating
        type="star"
        ratingCount={5}
        imageSize={40}
        showRating
        startingValue={rating}
        onFinishRating={setRating}
        style={{ paddingVertical: 10 }}
      />
      <TextInput
        style={styles.input}
        placeholder="Write your comment"
        value={comment}
        onChangeText={setComment} 
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttontext}>Submit</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Reviews</Text>
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderReview}
        />
      ) : <Text style={styles.noReviews}>No reviews yet.</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f0f0f0" },
  input: { height: 50, borderColor: '#ccc', borderWidth: 2, marginBottom: 5, paddingHorizontal: 15, borderRadius: 3, backgroundColor: '#FFF', fontSize: 16, color: '#333', margin: 15 },
  button: { backgroundColor: '#1215efff', padding: 16, borderRadius: 15, alignItems: 'center', marginHorizontal: 60, marginTop: 15 },
  buttontext: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  heading: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  noReviews: { fontSize: 16, color: '#555', marginTop: 20 },
  reviewCard: { backgroundColor: "#eee9e7ff", padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  driverInfo: { flexDirection: "row", alignItems: "flex-start" },
  driverImage: { width: 50, height: 50, borderRadius: 25 },
  rating: { fontSize: 16, color: "#ffaa00" },
  comment: { fontSize: 14, color: "#555", marginTop: 4, maxWidth: 250 },
});

export default Reviews;
