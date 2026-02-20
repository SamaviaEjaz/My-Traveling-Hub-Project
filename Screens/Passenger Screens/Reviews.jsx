import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ReviewForm = ({ bookingId, onReviewSubmitted, navigation }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [driverName, setDriverName] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // Get user information from AsyncStorage
    const getUserInfo = async () => {
      try {
        const driver = await AsyncStorage.getItem('driverName');
        const passenger = await AsyncStorage.getItem('passengerName');
        setDriverName(driver || '');
        setPassengerName(passenger || '');
      } catch (error) {
        console.error("Error getting user info:", error);
      }
    };
    
    getUserInfo();
    
    // Fetch booking details if bookingId is provided
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      // First check if bookingId exists
      if (!bookingId) {
        console.error("No booking ID provided");
        return;
      }
      
      console.log("Fetching booking details for ID:", bookingId);
      const response = await axios.get(`http://10.133.138.73:5000/api/bookings/${bookingId}`);
      setBookingDetails(response.data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      // Don't show an alert here, as we might not need booking details to submit a review
    }
  };

 // In ReviewForm.js

const submitReview = async () => {
  // ... (validation code remains the same)

  setIsLoading(true);

  try {
    // --- CORRECTED REVIEW DATA ---
    // Only include passengerName if it's not empty
    const reviewData = {
      rating,
      comment: comment.trim(),
      driverName,
      bookingId: bookingId || 'unknown',
      date: new Date().toISOString(),
    };

    // Conditionally add passengerName only if it exists
    if (passengerName && passengerName.trim() !== '') {
      reviewData.passengerName = passengerName.trim();
    }

    console.log("Submitting review:", reviewData);

    // Submit review to the server
    const response = await axios.post('http://10.133.138.73:5000/api/reviews', reviewData);
    
    if (response.data.success) {
      Alert.alert(
        "Review Submitted",
        response.data.message || "Thank you for your feedback!",
        [
          { text: "OK", onPress: () => {
            // Reset form
            setRating(0);
            setComment('');
            
            // Call the callback function if provided
            if (onReviewSubmitted) {
              onReviewSubmitted();
            }
            
            // Navigate back if navigation is provided
            if (navigation) {
              navigation.goBack();
            }
          }}
        ]
      );
    } else {
      // This part is now less likely to be hit, but good to keep
      Alert.alert("Error", response.data.message || "Failed to submit review. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    // ... (your existing error handling is good, keep it)
  } finally {
    setIsLoading(false);
  }
};
  const renderStar = (index) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.starButton}
        onPress={() => setRating(index + 1)}
      >
        <Text style={[styles.star, { color: index < rating ? '#FFD700' : '#CCCCCC' }]}>
          ★
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Submit Your Review</Text>
        
        {bookingDetails && (
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingInfoText}>Booking ID: {bookingDetails.id || bookingId}</Text>
            <Text style={styles.bookingInfoText}>From: {bookingDetails.from || 'N/A'}</Text>
            <Text style={styles.bookingInfoText}>To: {bookingDetails.to || 'N/A'}</Text>
          </View>
        )}
        
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  bookingInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  bookingInfoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  ratingContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 40,
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#297ce9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReviewForm;