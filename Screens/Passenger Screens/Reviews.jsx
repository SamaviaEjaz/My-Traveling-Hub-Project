import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../apiConfig';

const ReviewForm = ({ onReviewSubmitted }) => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookingId, driverName: routeDriverName } = route.params || {};

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [driverName, setDriverName] = useState(routeDriverName || '');
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState(''); // ✅ phone state
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const name = await AsyncStorage.getItem('passengerName');
        const phone = await AsyncStorage.getItem('passengerPhone');
        setPassengerName(name || '');
        setPassengerPhone(phone || ''); // ✅ phone set karo
      } catch (error) {
        console.error("Error getting user info:", error);
      }
    };
    getUserInfo();

    if (bookingId) {
      checkAlreadyReviewed();
    }
  }, [bookingId]);

  const checkAlreadyReviewed = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/check/${bookingId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      const data = await res.json();
      if (data.hasReview) setAlreadyReviewed(true);
    } catch (err) {
      console.log('Check review error:', err);
    }
  };

  const submitReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a comment');
      return;
    }
    if (!driverName) {
      Alert.alert('Error', 'Driver name missing!');
      return;
    }

    setIsLoading(true);
    try {
      const reviewData = {
        rating,
        comment: comment.trim(),
        driverName,
        bookingId: bookingId || 'unknown',
        passengerName: passengerName || 'Anonymous',
        passengerPhone: passengerPhone || 'Not provided', // ✅ phone add karo
        date: new Date().toISOString(),
      };

      const response = await axios.post(`${BASE_URL}/api/reviews`, reviewData, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });

      if (response.data.success) {
        setAlreadyReviewed(true);
        Alert.alert(
          "Review Submitted ✅",
          response.data.message || "Thank you for your feedback!",
          [{
            text: "OK", onPress: () => {
              setRating(0);
              setComment('');
              if (onReviewSubmitted) onReviewSubmitted();
              navigation.goBack();
            }
          }]
        );
      } else {
        Alert.alert("Error", response.data.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already')) {
        setAlreadyReviewed(true);
        Alert.alert("Already Reviewed", "You have already submitted a review for this booking!");
      } else {
        Alert.alert("Error", "Failed to submit review. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStar = (index) => (
    <TouchableOpacity key={index} style={styles.starButton} onPress={() => !alreadyReviewed && setRating(index + 1)}>
      <Text style={[styles.star, { color: index < rating ? '#FFD700' : '#CCCCCC' }]}>★</Text>
    </TouchableOpacity>
  );

  if (alreadyReviewed) {
    return (
      <View style={styles.alreadyReviewedContainer}>
        <Text style={styles.alreadyReviewedText}>✅ You have already submitted a review for this booking!</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.submitButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Submit Your Review</Text>
        <Text style={styles.driverText}>Driver: {driverName}</Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.label}>Rating:</Text>
          <View style={styles.starsContainer}>
            {[0, 1, 2, 3, 4].map(renderStar)}
          </View>
        </View>

        <View style={styles.commentContainer}>
          <Text style={styles.label}>Comment:</Text>
          <TextInput
            style={styles.commentInput}
            multiline
            numberOfLines={4}
            placeholder="Share your experience..."
            value={comment}
            onChangeText={setComment}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={submitReview}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#333' },
  driverText: { fontSize: 18, textAlign: 'center', color: '#297ce9', marginBottom: 20, fontWeight: 'bold' },
  ratingContainer: { marginBottom: 20 },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  starsContainer: { flexDirection: 'row', justifyContent: 'center' },
  starButton: { padding: 5 },
  star: { fontSize: 40 },
  commentContainer: { marginBottom: 20 },
  commentInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 15, fontSize: 16, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#297ce9', padding: 15, borderRadius: 8, alignItems: 'center' },
  disabledButton: { backgroundColor: '#a0a0a0' },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  alreadyReviewedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  alreadyReviewedText: { fontSize: 18, color: '#28a745', textAlign: 'center', marginBottom: 20 },
  backButton: { backgroundColor: '#297ce9', padding: 15, borderRadius: 8, alignItems: 'center', width: '100%' },
});

export default ReviewForm;